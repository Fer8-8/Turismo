import { BaseEvent } from './base.event';

// evento emitido cuando orden es cancelada
export class OrderCancelledEvent extends BaseEvent {
  static readonly eventName = 'order.cancelled';

  constructor(
    public readonly orderId: string,
    public readonly storeId: string,
    public readonly reason: string,
  ) {
    super(OrderCancelledEvent.eventName);
  }

  override toPayload() {
    return {
      ...super.toPayload(),
      orderId: this.orderId,
      storeId: this.storeId,
      reason: this.reason,
    };
  }
}
