import { BaseEvent } from '../../../../core/shared';

export class OrderApprovedEvent extends BaseEvent {
  static readonly eventName = 'sales.order.approved';

  constructor(
    public readonly orderId: string,
    public readonly storeId: string,
    public readonly userId: string,
    public readonly total: number,
  ) {
    super(OrderApprovedEvent.eventName);
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
