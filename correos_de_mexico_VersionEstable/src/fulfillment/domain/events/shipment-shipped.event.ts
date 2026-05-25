import { BaseEvent } from '../../../core/shared';

export class FulfillmentShipmentShippedEvent extends BaseEvent {
  static readonly eventName = 'fulfillment.shipment.shipped';

  constructor(
    public readonly shipmentId: string,
    public readonly orderId: string,
    public readonly tracking: string | null,
  ) {
    super(FulfillmentShipmentShippedEvent.eventName);
  }

  override toPayload() {
    return {
      ...super.toPayload(),
      shipmentId: this.shipmentId,
      orderId: this.orderId,
      tracking: this.tracking,
    };
  }
}