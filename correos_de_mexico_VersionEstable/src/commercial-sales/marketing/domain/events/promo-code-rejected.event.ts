import { BaseEvent } from '../../../../core/shared';

export class PromoCodeRejectedEvent extends BaseEvent {
  static readonly eventName = 'marketing.promo_code.rejected';

  constructor(
    public readonly code: string,
    public readonly reason: string,
  ) {
    super(PromoCodeRejectedEvent.eventName);
  }

  override toPayload() {
    return {
      ...super.toPayload(),
      code: this.code,
      reason: this.reason,
    };
  }
}
