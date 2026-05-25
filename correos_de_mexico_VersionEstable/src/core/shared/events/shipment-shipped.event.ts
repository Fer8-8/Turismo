import { BaseEvent } from './base.event';

// evento emitido cuando envío es enviado con carrier
export class ShipmentShippedEvent extends BaseEvent {
  static readonly eventName = 'shipment.shipped';

  constructor(
    public readonly shipmentId: string,
    public readonly orderId: string,
    public readonly trackingNumber: string,
  ) {
    super(ShipmentShippedEvent.eventName);
  }

  override toPayload() {
    return {
      ...super.toPayload(),
      shipmentId: this.shipmentId,
      orderId: this.orderId,
      trackingNumber: this.trackingNumber,
    };
  }
}
