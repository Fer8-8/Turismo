import { Injectable } from '@nestjs/common';
import { EventBusService } from '../../core/shared';
import { ShipmentRepository } from '../infrastructure/repositories/shipment.repository';
import { ShipmentState } from '../domain/enums/shipment-state.enum';
import { ShipmentStateTransitionException } from '../domain/exceptions/fulfillment.exceptions';
import { canTransitionShipmentState, projectOrderShipmentState } from '../domain/policies/shipment-state.policy';
import { FulfillmentShipmentShippedEvent } from '../domain/events/shipment-shipped.event';
import { ShipmentDeliveredEvent } from '../domain/events/shipment-delivered.event';
import { serializeShipment } from './fulfillment.mapper';

@Injectable()
export class ShipmentStateService {
  constructor(
    private readonly shipmentRepo: ShipmentRepository,
    private readonly eventBus: EventBusService,
  ) {}

  async markPending(shipmentId: string) {
    return this.transitionShipmentState(shipmentId, ShipmentState.PENDING, {
      pending_at: new Date(),
    });
  }

  async markReady(shipmentId: string) {
    return this.transitionShipmentState(shipmentId, ShipmentState.READY, {
      ready_at: new Date(),
    });
  }

  async markShipped(shipmentId: string, shippedAt?: Date) {
    const shipment = await this.transitionShipmentState(shipmentId, ShipmentState.SHIPPED, {
      shipped_at: shippedAt ?? new Date(),
    });

    await this.eventBus.emit(
      new FulfillmentShipmentShippedEvent(
        shipment.id,
        shipment.order_id ?? '',
        shipment.tracking ?? null,
      ),
    );

    return shipment;
  }

  async markDelivered(shipmentId: string, deliveredAt?: Date) {
    const shipment = await this.transitionShipmentState(shipmentId, ShipmentState.DELIVERED, {
      delivered_at: deliveredAt ?? new Date(),
    });

    await this.eventBus.emit(
      new ShipmentDeliveredEvent(
        shipment.id,
        shipment.order_id ?? '',
        shipment.delivered_at ?? new Date(),
      ),
    );

    return shipment;
  }

  async getCurrentState(shipmentId: string) {
    const shipment = await this.shipmentRepo.findByIdOrThrow(shipmentId);
    return shipment.state ?? ShipmentState.PENDING;
  }

  async getProjectedOrderShipmentState(orderId: string) {
    const states = await this.shipmentRepo.getOrderShipmentStates(orderId);
    return projectOrderShipmentState(states);
  }

  private async transitionShipmentState(
    shipmentId: string,
    nextState: ShipmentState,
    dates: Partial<Record<'pending_at' | 'ready_at' | 'shipped_at' | 'delivered_at', Date>>,
  ) {
    const shipment = await this.shipmentRepo.findByIdOrThrow(shipmentId);
    if (!canTransitionShipmentState(shipment.state, nextState)) {
      throw new ShipmentStateTransitionException(shipment.state, nextState);
    }

    const updated = await this.shipmentRepo.updateState(shipmentId, nextState, dates);
    return serializeShipment(updated);
  }
}