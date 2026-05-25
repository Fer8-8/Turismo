import { BaseEvent } from '../../../../core/shared';

export class PromotionAppliedToOrderEvent extends BaseEvent {
  static readonly eventName = 'marketing.promotion.applied_to_order';

  constructor(
    public readonly promotionId: string,
    public readonly orderId: string,
    public readonly orderPromoTotal: number,
    public readonly reason: string | null,
  ) {
    super(PromotionAppliedToOrderEvent.eventName);
  }

  override toPayload() {
    return {
      ...super.toPayload(),
      promotionId: this.promotionId,
      orderId: this.orderId,
      orderPromoTotal: this.orderPromoTotal,
      reason: this.reason,
    };
  }
}
