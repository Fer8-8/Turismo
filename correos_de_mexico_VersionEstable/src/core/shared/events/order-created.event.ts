import { BaseEvent } from './base.event';

// evento emitido cuando orden es creada exitosamente
export class OrderCreatedEvent extends BaseEvent {
  static readonly eventName = 'order.created';

  constructor(
    public readonly orderId: string,
    public readonly storeId: string,
    public readonly userId: string,
    public readonly lineItemIds: string[],
    public readonly total: number,
  ) {
    super(OrderCreatedEvent.eventName);
  }

  override toPayload() {
    return {
      ...super.toPayload(),
      orderId: this.orderId,
      storeId: this.storeId,
      userId: this.userId,
      lineItemIds: this.lineItemIds,
      total: this.total,
    };
  }
}
