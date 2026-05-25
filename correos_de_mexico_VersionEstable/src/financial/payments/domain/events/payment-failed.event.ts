import { BaseEvent } from '../../../../core/shared/events/base.event';

export class PaymentFailedEvent extends BaseEvent {
  static readonly eventName = 'payment.failed';

  constructor(
    public readonly paymentId: string,
    public readonly orderId: string,
    public readonly amount: number,
    public readonly reason: string,
  ) {
    super(PaymentFailedEvent.eventName);
  }

  override toPayload() {
    return {
      ...super.toPayload(),
      paymentId: this.paymentId,
      orderId: this.orderId,
      amount: this.amount,
      reason: this.reason,
    };
  }
}
