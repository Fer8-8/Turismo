import { BaseEvent } from '../../../../core/shared/events/base.event';

export class RefundProcessedEvent extends BaseEvent {
  static readonly eventName = 'payment.refund.processed';

  constructor(
    public readonly refundId: string,
    public readonly paymentId: string,
    public readonly orderId: string,
    public readonly amount: number,
  ) {
    super(RefundProcessedEvent.eventName);
  }

  override toPayload() {
    return {
      ...super.toPayload(),
      refundId: this.refundId,
      paymentId: this.paymentId,
      orderId: this.orderId,
      amount: this.amount,
    };
  }
}
