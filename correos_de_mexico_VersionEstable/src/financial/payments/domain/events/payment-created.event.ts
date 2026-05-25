import { BaseEvent } from '../../../../core/shared/events/base.event';

export class PaymentCreatedEvent extends BaseEvent {
  static readonly eventName = 'payment.created';

  constructor(
    public readonly paymentId: string,
    public readonly orderId: string,
    public readonly amount: number,
    public readonly storeId: string,
  ) {
    super(PaymentCreatedEvent.eventName);
  }

  override toPayload() {
    return {
      ...super.toPayload(),
      paymentId: this.paymentId,
      orderId: this.orderId,
      amount: this.amount,
      storeId: this.storeId,
    };
  }
}
