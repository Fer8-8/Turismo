import { BaseEvent } from '../../../core/shared';

export class ShipmentCreatedEvent extends BaseEvent {
  static readonly eventName = 'fulfillment.shipment.created';

  constructor(
    public readonly shipmentId: string,
    public readonly orderId: string,
    public readonly storeId: string | null,
  ) {
    super(ShipmentCreatedEvent.eventName);
  }

  override toPayload() {
    return {
      ...super.toPayload(),
      shipmentId: this.shipmentId,
      orderId: this.orderId,
      storeId: this.storeId,
    };
  }
}