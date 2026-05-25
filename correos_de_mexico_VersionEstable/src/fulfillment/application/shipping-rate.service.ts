import { Injectable } from '@nestjs/common';
import { BusinessException } from '../../core/shared';
import { SalesFacade } from '../../commercial-sales/sales/facades/sales.facade';
import { TaxFacade } from '../../location/tax/facades/tax.facade';
import { ShipmentRepository } from '../infrastructure/repositories/shipment.repository';
import { ShippingRateRepository } from '../infrastructure/repositories/shipping-rate.repository';
import { ShippingMethodService } from './shipping-method.service';
import { serializeShippingRate, serializeShipment, calculateShipmentTaxBreakdown } from './fulfillment.mapper';
import { ShippingRateSelectionException } from '../domain/exceptions/fulfillment.exceptions';

export interface CreateShippingRateInput {
  shipmentId: string;
  shippingMethodId: string;
  cost: number;
  taxRateId?: string;
  selected?: boolean;
}

export interface UpdateShippingRateInput {
  rateId: string;
  cost?: number;
  taxRateId?: string | null;
  selected?: boolean;
}

@Injectable()
export class ShippingRateService {
  constructor(
    private readonly shipmentRepo: ShipmentRepository,
    private readonly rateRepo: ShippingRateRepository,
    private readonly shippingMethodService: ShippingMethodService,
    private readonly salesFacade: SalesFacade,
    private readonly taxFacade: TaxFacade,
  ) {}

  async createShippingRate(input: CreateShippingRateInput) {
    if (input.cost < 0) {
      throw new BusinessException('El costo de la tarifa de envío no puede ser negativo', 'SHIPPING_RATE_COST_INVALID');
    }

    const shipment = await this.shipmentRepo.findByIdOrThrow(input.shipmentId);
    if (!shipment.order_id) {
      throw new ShippingRateSelectionException(
        `El envío ${input.shipmentId} no está vinculado a una orden`,
      );
    }

    const orderContext = await this.salesFacade.getFulfillmentContext(shipment.order_id);
    await this.shippingMethodService.validateMethodAvailable(input.shippingMethodId, {
      storeId: orderContext.storeId ?? undefined,
    });

    let taxRate: any = null;
    if (input.taxRateId) {
      taxRate = await this.taxFacade.getRateById(input.taxRateId);
    }

    const rate = await this.rateRepo.create({
      shipment_id: input.shipmentId,
      shipping_method_id: input.shippingMethodId,
      cost: input.cost,
      selected: input.selected ?? false,
      tax_rate_id: input.taxRateId ?? null,
    });

    if (input.selected) {
      return this.selectShippingRateAndReturnRate(rate.id);
    }

    return serializeShippingRate(rate, taxRate);
  }

  async updateShippingRate(input: UpdateShippingRateInput) {
    if (input.cost !== undefined && input.cost < 0) {
      throw new BusinessException('El costo de la tarifa de envío no puede ser negativo', 'SHIPPING_RATE_COST_INVALID');
    }

    let taxRate: any = null;
    if (input.taxRateId) {
      taxRate = await this.taxFacade.getRateById(input.taxRateId);
    }

    const rate = await this.rateRepo.update(input.rateId, {
      ...(input.cost !== undefined ? { cost: input.cost } : {}),
      ...(input.taxRateId !== undefined ? { tax_rate_id: input.taxRateId } : {}),
      ...(input.selected !== undefined ? { selected: input.selected } : {}),
    });

    if (input.selected) {
      return this.selectShippingRateAndReturnRate(rate.id);
    }

    const resolvedTaxRate = taxRate ?? (await this.resolveTaxRate(rate.tax_rate_id));
    return serializeShippingRate(rate, resolvedTaxRate);
  }

  async listRatesByShipment(shipmentId: string) {
    await this.shipmentRepo.findByIdOrThrow(shipmentId);
    const rates = await this.rateRepo.findByShipment(shipmentId);

    return Promise.all(
      rates.map(async (rate) => {
        const taxRate = rate.tax_rate_id
          ? await this.taxFacade.getRateById(rate.tax_rate_id).catch(() => null)
          : null;
        return serializeShippingRate(rate, taxRate);
      }),
    );
  }

  async selectShippingRate(rateId: string) {
    const { shipment } = await this.applyRateSelection(rateId);
    return shipment;
  }

  private async selectShippingRateAndReturnRate(rateId: string) {
    const { rate } = await this.applyRateSelection(rateId);
    return rate;
  }

  private async applyRateSelection(rateId: string) {
    const rate = await this.rateRepo.findByIdOrThrow(rateId);
    if (!rate.shipment_id) {
      throw new ShippingRateSelectionException(`La tarifa ${rateId} no está vinculada a un envío`);
    }

    await this.rateRepo.deselectByShipment(rate.shipment_id);
    const selectedRate = await this.rateRepo.select(rateId);
    const taxRate = await this.resolveTaxRate(selectedRate.tax_rate_id);

    const totals = calculateShipmentTaxBreakdown(Number(selectedRate.cost), taxRate);
    const shipment = await this.shipmentRepo.updateSelectedRateTotals(rate.shipment_id, totals);

    return {
      rate: serializeShippingRate(selectedRate, taxRate),
      shipment: serializeShipment(
        shipment,
        await this.listRatesByShipment(rate.shipment_id),
      ),
    };
  }

  private async resolveTaxRate(taxRateId?: string | null) {
    if (!taxRateId) {
      return null;
    }

    return this.taxFacade.getRateById(taxRateId).catch(() => null);
  }
}