import { BaseEvent } from './base.event';

// evento emitido cuando devolución es aprobada
export class ReturnApprovedEvent extends BaseEvent {
  static readonly eventName = 'return.approved';

  constructor(
    public readonly returnAuthorizationId: string,
    public readonly orderId: string,
    public readonly itemIds: string[],
  ) {
    super(ReturnApprovedEvent.eventName);
  }

  override toPayload() {
    return {
      ...super.toPayload(),
      returnAuthorizationId: this.returnAuthorizationId,
      orderId: this.orderId,
      itemIds: this.itemIds,
    };
  }
}
