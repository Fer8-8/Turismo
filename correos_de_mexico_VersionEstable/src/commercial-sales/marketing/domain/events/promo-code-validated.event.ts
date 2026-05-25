import { BaseEvent } from '../../../../core/shared';

export class PromoCodeValidatedEvent extends BaseEvent {
  static readonly eventName = 'marketing.promo_code.validated';

  constructor(
    public readonly code: string,
    public readonly promotionId: string,
  ) {
    super(PromoCodeValidatedEvent.eventName);
  }

  override toPayload() {
    return {
      ...super.toPayload(),
      code: this.code,
      promotionId: this.promotionId,
    };
  }
}
