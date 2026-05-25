import { BaseEvent } from '../../../core/shared';

export class ShipmentDeliveredEvent extends BaseEvent {
  static readonly eventName = 'fulfillment.shipment.delivered';

  constructor(
    public readonly shipmentId: string,
    public readonly orderId: string,
    public readonly deliveredAt: Date,
  ) {
    super(ShipmentDeliveredEvent.eventName);
  }

  override toPayload() {
    return {
      ...super.toPayload(),
      shipmentId: this.shipmentId,
      orderId: this.orderId,
      deliveredAt: this.deliveredAt.toISOString(),
    };
  }
}