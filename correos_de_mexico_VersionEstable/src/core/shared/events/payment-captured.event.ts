import { BaseEvent } from './base.event';

// evento emitido cuando pago es capturado o confirmado
export class PaymentCapturedEvent extends BaseEvent {
  static readonly eventName = 'payment.captured';

  constructor(
    public readonly paymentId: string,
    public readonly orderId: string,
    public readonly amount: number,
  ) {
    super(PaymentCapturedEvent.eventName);
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
