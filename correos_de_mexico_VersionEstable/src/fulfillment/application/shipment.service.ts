import { Injectable } from '@nestjs/common';
import { EventBusService, BusinessException } from '../../core/shared';
import { SalesFacade } from '../../commercial-sales/sales/facades/sales.facade';
import { AddressFacade } from '../../core/address/facades/address.facade';
import { InventoryFacade } from '../../inventory/inventory.facade';
import { StoreFacade } from '../../core/store/facades/store.facade';
import { ShipmentRepository } from '../infrastructure/repositories/shipment.repository';
import { ShipmentState } from '../domain/enums/shipment-state.enum';
import { ShipmentCreatedEvent } from '../domain/events/shipment-created.event';
import { ShipmentOrderContextException } from '../domain/exceptions/fulfillment.exceptions';
import { ShipmentAdminFilters } from '../domain/contracts/fulfillment.contracts';
import { serializeShipment } from './fulfillment.mapper';
import { projectOrderShipmentState } from '../domain/policies/shipment-state.policy';

export interface CreateShipmentInput {
  orderId: string;
  addressId?: string;
  stockLocationId?: string;
  baseCost?: number;
  tracking?: string;
}

export interface UpdateShipmentInput {
  shipmentId: string;
  addressId?: string;
  stockLocationId?: string;
  baseCost?: number;
  tracking?: string;
}

@Injectable()
export class ShipmentService {
  constructor(
    private readonly shipmentRepo: ShipmentRepository,
    private readonly salesFacade: SalesFacade,
    private readonly addressFacade: AddressFacade,
    private readonly inventoryFacade: InventoryFacade,
    private readonly storeFacade: StoreFacade,
    private readonly eventBus: EventBusService,
  ) {}

  async createShipment(input: CreateShipmentInput) {
    const orderContext = await this.salesFacade.getFulfillmentContext(input.orderId);
    if (!orderContext.fulfillable) {
      throw new ShipmentOrderContextException(
        `La orden ${input.orderId} no está lista para crear un envío`,
      );
    }

    if (orderContext.storeId) {
      await this.storeFacade.validateStoreAccess(orderContext.storeId);
    }

    const addressId = input.addressId ?? orderContext.shipAddressId;
    if (!addressId) {
      throw new ShipmentOrderContextException(
        `La orden ${input.orderId} no tiene una dirección de envío disponible`,
      );
    }

    await this.addressFacade.getAddressById(addressId);

    if (input.stockLocationId) {
      await this.inventoryFacade.getStockLocation(input.stockLocationId);
    }

    const baseCost = input.baseCost ?? 0;

    const shipment = await this.shipmentRepo.create({
      order_id: input.orderId,
      address_id: addressId,
      stock_location_id: input.stockLocationId ?? null,
      state: ShipmentState.PENDING,
      cost: baseCost,
      pre_tax_amount: baseCost,
      tracking: input.tracking ?? null,
      pending_at: new Date(),
    });

    await this.eventBus.emit(
      new ShipmentCreatedEvent(
        shipment.id,
        shipment.order_id ?? input.orderId,
        orderContext.storeId,
      ),
    );

    return serializeShipment(shipment);
  }

  async getShipmentById(shipmentId: string) {
    const shipment = await this.shipmentRepo.findByIdOrThrow(shipmentId);
    return serializeShipment(shipment);
  }

  async listShipmentsByOrder(orderId: string) {
    await this.salesFacade.getFulfillmentContext(orderId);
    const shipments = await this.shipmentRepo.findByOrder(orderId);
    return shipments.map((shipment) => serializeShipment(shipment));
  }

  async listAdministrativeShipments(filters: ShipmentAdminFilters) {
    const shipments = await this.shipmentRepo.findMany(filters);
    return shipments.map((shipment) => serializeShipment(shipment));
  }

  async updateShipment(input: UpdateShipmentInput) {
    if (
      Object.prototype.hasOwnProperty.call(input, 'shippedAt') ||
      Object.prototype.hasOwnProperty.call(input, 'deliveredAt')
    ) {
      throw new BusinessException(
        'Las fechas logísticas del envío solo se controlan mediante transiciones de estado',
        'SHIPMENT_LOGISTICS_FIELDS_READ_ONLY',
      );
    }

    await this.shipmentRepo.findByIdOrThrow(input.shipmentId);

    if (input.addressId) {
      await this.addressFacade.getAddressById(input.addressId);
    }

    if (input.stockLocationId) {
      await this.inventoryFacade.getStockLocation(input.stockLocationId);
    }

    if (input.baseCost !== undefined && input.baseCost < 0) {
      throw new BusinessException('El costo del envío no puede ser negativo', 'SHIPMENT_COST_INVALID');
    }

    const updated = await this.shipmentRepo.update(input.shipmentId, {
      ...(input.addressId ? { address_id: input.addressId } : {}),
      ...(input.stockLocationId !== undefined
        ? { stock_location_id: input.stockLocationId }
        : {}),
      ...(input.tracking !== undefined ? { tracking: input.tracking } : {}),
      ...(input.baseCost !== undefined
        ? {
            cost: input.baseCost,
            pre_tax_amount: input.baseCost,
          }
        : {}),
    });

    return serializeShipment(updated);
  }

  async getProjectedOrderShipmentState(orderId: string) {
    const states = await this.shipmentRepo.getOrderShipmentStates(orderId);
    return projectOrderShipmentState(states);
  }

  async getShipmentLogisticsContext(shipmentId: string) {
    const shipment = await this.shipmentRepo.findByIdOrThrow(shipmentId);
    const shipmentData = shipment as typeof shipment & {
      delivered_at?: Date | null;
    };

    return {
      shipmentId: shipment.id,
      orderId: shipment.order_id,
      addressId: shipment.address_id,
      stockLocationId: shipment.stock_location_id,
      tracking: shipment.tracking,
      state: shipment.state,
      shippedAt: shipment.shipped_at,
      deliveredAt: shipmentData.delivered_at ?? null,
    };
  }
}