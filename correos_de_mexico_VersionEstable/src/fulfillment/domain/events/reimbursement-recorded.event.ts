import { BaseEvent } from '../../../core/shared';

export class ReimbursementRecordedEvent extends BaseEvent {
  static readonly eventName = 'fulfillment.reimbursement.recorded';

  constructor(
    public readonly reimbursementId: string,
    public readonly orderId: string | null,
    public readonly customerReturnId: string | null,
  ) {
    super(ReimbursementRecordedEvent.eventName);
  }

  override toPayload() {
    return {
      ...super.toPayload(),
      reimbursementId: this.reimbursementId,
      orderId: this.orderId,
      customerReturnId: this.customerReturnId,
    };
  }
}
