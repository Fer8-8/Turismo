import { BaseEvent } from '../../../core/shared';

export class ReimbursementStatusUpdatedEvent extends BaseEvent {
  static readonly eventName = 'fulfillment.reimbursement.status_updated';

  constructor(
    public readonly reimbursementId: string,
    public readonly previousStatus: string,
    public readonly newStatus: string,
  ) {
    super(ReimbursementStatusUpdatedEvent.eventName);
  }

  override toPayload() {
    return {
      ...super.toPayload(),
      reimbursementId: this.reimbursementId,
      previousStatus: this.previousStatus,
      newStatus: this.newStatus,
    };
  }
}
