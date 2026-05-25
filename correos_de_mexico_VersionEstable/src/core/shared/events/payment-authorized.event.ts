import { BaseEvent } from './base.event';

// evento emitido cuando pago es autorizado por gateway
export class PaymentAuthorizedEvent extends BaseEvent {
  static readonly eventName = 'payment.authorized';

  constructor(
    public readonly paymentId: string,
    public readonly orderId: string,
    public readonly amount: number,
  ) {
    super(PaymentAuthorizedEvent.eventName);
  }

  override toPayload() {
    return {
      ...super.toPayload(),
      paymentId: this.paymentId,
      orderId: this.orderId,
      amount: this.amount,
    };
  }
}
