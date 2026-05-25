import { Injectable } from '@nestjs/common';
import { TaxRateService } from './tax-rate.service';
import { ZoneService } from './zone.service';

export interface TaxLineInput {
  amount: number;
  tax_category_id?: string;
}

export interface TaxCalculation {
  additional_tax: number;
  included_tax: number;
  taxable_amount: number;
  rate_name?: string;
  rate_amount: number;
  included_in_price: boolean;
}

export interface OrderTaxInput {
  line_items: TaxLineInput[];
  shipment_amount?: number;
  shipment_tax_category_id?: string;
  state_id?: string;
  zone_id?: string;
}

export interface OrderTaxResult {
  additional_tax_total: number;
  included_tax_total: number;
  line_items_tax: number;
  shipment_tax: number;
  breakdown: TaxCalculation[];
}

@Injectable()
export class TaxCalculationService {
  constructor(
    private readonly taxRateService: TaxRateService,
    private readonly zoneService: ZoneService,
  ) {}

  // calcula impuestos para un monto dado y una categoría fiscal + zona
  async calculateTax(
    amount: number,
    taxCategoryId?: string,
    zoneId?: string,
  ): Promise<TaxCalculation> {
    if (!taxCategoryId || !zoneId) {
      return this.zeroTax(amount);
    }

    const rates = await this.taxRateService.findByCategoryAndZone(
      taxCategoryId,
      zoneId,
    );

    if (rates.length === 0) {
      return this.zeroTax(amount);
    }

    // Usa la primera tasa que coincida
    const rate = rates[0];
    const rateAmount = rate.amount ? Number(rate.amount) : 0;

    return this.applyRate(amount, rateAmount, rate.included_in_price, rate.name);
  }

  // calcula impuestos para una línea (line item)
  // si no se proporciona zoneId, intenta resolver la zona por stateId
  async calculateLineTax(
    amount: number,
    taxCategoryId?: string,
    stateId?: string,
    zoneId?: string,
  ): Promise<TaxCalculation> {
    const resolvedZoneId = await this.resolveZone(stateId, zoneId);
    return this.calculateTax(amount, taxCategoryId, resolvedZoneId);
  }

  // calcula impuestos para un envío
  async calculateShippingTax(
    shippingAmount: number,
    taxCategoryId?: string,
    stateId?: string,
    zoneId?: string,
  ): Promise<TaxCalculation> {
    const resolvedZoneId = await this.resolveZone(stateId, zoneId);
    return this.calculateTax(shippingAmount, taxCategoryId, resolvedZoneId);
  }

  // calcula el impuesto total de una orden: suma líneas + envío
  async calculateOrderTax(input: OrderTaxInput): Promise<OrderTaxResult> {
    const resolvedZoneId = await this.resolveZone(
      input.state_id,
      input.zone_id,
    );

    const breakdown: TaxCalculation[] = [];

    // calcular impuestos de cada línea
    let lineItemsTax = 0;
    for (const line of input.line_items) {
      const lineTax = await this.calculateTax(
        line.amount,
        line.tax_category_id,
        resolvedZoneId,
      );
      lineItemsTax += lineTax.additional_tax;
      breakdown.push(lineTax);
    }

    // calcular impuesto de envío
    let shipmentTax = 0;
    if (input.shipment_amount && input.shipment_amount > 0) {
      const shippingCalc = await this.calculateTax(
        input.shipment_amount,
        input.shipment_tax_category_id,
        resolvedZoneId,
      );
      shipmentTax = shippingCalc.additional_tax;
      breakdown.push(shippingCalc);
    }

    // totales
    const additionalTotal = breakdown.reduce(
      (sum, b) => sum + b.additional_tax,
      0,
    );
    const includedTotal = breakdown.reduce(
      (sum, b) => sum + b.included_tax,
      0,
    );

    return {
      additional_tax_total: this.round(additionalTotal),
      included_tax_total: this.round(includedTotal),
      line_items_tax: this.round(lineItemsTax),
      shipment_tax: this.round(shipmentTax),
      breakdown,
    };
  }

  // ─── HELPERS INTERNOS ────────────────────────────────────

  private applyRate(
    amount: number,
    rateAmount: number,
    includedInPrice: boolean,
    rateName?: string | null,
  ): TaxCalculation {
    if (includedInPrice) {
      // el impuesto ya está incluido en el precio
      // tax = amount - (amount / (1 + rate))
      const taxableAmount = amount / (1 + rateAmount);
      const tax = amount - taxableAmount;
      return {
        additional_tax: 0,
        included_tax: this.round(tax),
        taxable_amount: this.round(taxableAmount),
        rate_name: rateName ?? undefined,
        rate_amount: rateAmount,
        included_in_price: true,
      };
    } else {
      // el impuesto se agrega sobre el precio
      const tax = amount * rateAmount;
      return {
        additional_tax: this.round(tax),
        included_tax: 0,
        taxable_amount: this.round(amount),
        rate_name: rateName ?? undefined,
        rate_amount: rateAmount,
        included_in_price: false,
      };
    }
  }

  private zeroTax(amount: number): TaxCalculation {
    return {
      additional_tax: 0,
      included_tax: 0,
      taxable_amount: this.round(amount),
      rate_amount: 0,
      included_in_price: false,
    };
  }

  private async resolveZone(
    stateId?: string,
    zoneId?: string,
  ): Promise<string | undefined> {
    if (zoneId) return zoneId;
    if (!stateId) return undefined;

    const zone = await this.zoneService.resolveZoneForState(stateId);
    return zone?.id;
  }

  private round(value: number): number {
    return Math.round(value * 100) / 100;
  }
}
