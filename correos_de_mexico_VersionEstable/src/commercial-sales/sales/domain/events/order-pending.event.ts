import { BaseEvent } from '../../../../core/shared';

export class OrderPendingEvent extends BaseEvent {
  static readonly eventName = 'sales.order.pending';

  constructor(
    public readonly orderId: string,
    public readonly storeId: string,
    public readonly userId: string,
    public readonly total: number,
  ) {
    super(OrderPendingEvent.eventName);
  }

  override toPayload() {
    return {
      ...super.toPayload(),
      orderId: this.orderId,
      storeId: this.storeId,
      userId: this.userId,
      total: this.total,
    };
  }
}
