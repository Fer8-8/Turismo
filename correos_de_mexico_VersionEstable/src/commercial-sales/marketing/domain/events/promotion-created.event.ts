import { BaseEvent } from '../../../../core/shared';

export class PromotionCreatedEvent extends BaseEvent {
  static readonly eventName = 'marketing.promotion.created';

  constructor(
    public readonly promotionId: string,
    public readonly name: string | null,
    public readonly code: string | null,
    public readonly storeIds: string[],
  ) {
    super(PromotionCreatedEvent.eventName);
  }

  override toPayload() {
    return {
      ...super.toPayload(),
      promotionId: this.promotionId,
      name: this.name,
      code: this.code,
      storeIds: this.storeIds,
    };
  }
}
