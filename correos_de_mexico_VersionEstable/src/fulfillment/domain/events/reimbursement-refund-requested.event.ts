import { BaseEvent } from '../../../core/shared';

export class ReimbursementRefundRequestedEvent extends BaseEvent {
  static readonly eventName = 'fulfillment.reimbursement.refund_requested';

  constructor(
    public readonly reimbursementId: string,
    public readonly orderId: string | null,
    public readonly amount: number,
  ) {
    super(ReimbursementRefundRequestedEvent.eventName);
  }

  override toPayload() {
    return {
      ...super.toPayload(),
      reimbursementId: this.reimbursementId,
      orderId: this.orderId,
      amount: this.amount,
    };
  }
}
