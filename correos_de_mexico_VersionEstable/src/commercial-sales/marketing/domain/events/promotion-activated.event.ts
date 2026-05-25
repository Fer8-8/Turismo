import { BaseEvent } from '../../../../core/shared';

export class PromotionActivatedEvent extends BaseEvent {
  static readonly eventName = 'marketing.promotion.activated';

  constructor(
    public readonly promotionId: string,
    public readonly active: boolean,
  ) {
    super(PromotionActivatedEvent.eventName);
  }

  override toPayload() {
    return {
      ...super.toPayload(),
      promotionId: this.promotionId,
      active: this.active,
    };
  }
}
