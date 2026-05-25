import { Injectable } from '@nestjs/common';
import {
  PromotionOrderRepository,
  CreateOrderPromotionData,
} from '../infrastructure/repositories/promotion-order.repository';
import { PromotionRepository } from '../infrastructure/repositories/promotion.repository';
import { EventBusService } from '../../../core/shared';
import { PromotionAppliedToOrderEvent } from '../domain/events/promotion-applied-to-order.event';
import { isPromotionWithinUsageLimit } from '../domain/policies/promotion-eligibility.policy';
import { PromotionUsageLimitExceededException } from '../domain/exceptions/promotion.exceptions';

@Injectable()
export class PromotionOrderLinkService {
  constructor(
    private readonly promotionOrderRepo: PromotionOrderRepository,
    private readonly promotionRepo: PromotionRepository,
    private readonly eventBus: EventBusService,
  ) {}

  async link(data: CreateOrderPromotionData, orderPromoTotal = 0) {
    const promotion = await this.promotionRepo.findByIdOrThrow(data.promotion_id);

    if (!isPromotionWithinUsageLimit(promotion)) {
      throw new PromotionUsageLimitExceededException(data.promotion_id);
    }

    const existing = await this.promotionOrderRepo.findByOrderAndPromotion(
      data.order_id,
      data.promotion_id,
    );
    if (existing) return existing;

    const link = await this.promotionOrderRepo.create(data);

    await this.promotionRepo.incrementUsageCount(data.promotion_id);

    await this.eventBus.emit(
      new PromotionAppliedToOrderEvent(
        data.promotion_id,
        data.order_id,
        orderPromoTotal,
        data.reason ?? null,
      ),
    );

    return link;
  }

  async getAppliedPromotions(orderId: string) {
    return this.promotionOrderRepo.findByOrder(orderId);
  }

  async unlink(orderId: string, promotionId: string) {
    return this.promotionOrderRepo.deleteLink(orderId, promotionId);
  }

  async clearOrderLinks(orderId: string) {
    return this.promotionOrderRepo.deleteByOrder(orderId);
  }

  async isLinked(orderId: string, promotionId: string): Promise<boolean> {
    const record = await this.promotionOrderRepo.findByOrderAndPromotion(
      orderId,
      promotionId,
    );
    return record !== null;
  }
}
