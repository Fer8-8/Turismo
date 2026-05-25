import { Injectable } from '@nestjs/common';
import { PromotionRepository } from '../infrastructure/repositories/promotion.repository';
import { EventBusService } from '../../../core/shared';
import { PromotionCreatedEvent } from '../domain/events/promotion-created.event';
import { PromotionActivatedEvent } from '../domain/events/promotion-activated.event';
import type {
  CreatePromotionInput,
  UpdatePromotionInput,
  PromotionListFilter,
} from './contracts/marketing.facade.contracts';

@Injectable()
export class PromotionService {
  constructor(
    private readonly promotionRepo: PromotionRepository,
    private readonly eventBus: EventBusService,
  ) {}

  async getById(id: string): Promise<any> {
    return this.promotionRepo.findByIdOrThrow(id);
  }

  async getByCode(code: string): Promise<any> {
    return this.promotionRepo.findByCodeOrThrow(code);
  }

  async list(filter: PromotionListFilter = {}): Promise<any[]> {
    return this.promotionRepo.findMany(filter);
  }

  async listActive(storeId?: string): Promise<any[]> {
    if (storeId) {
      return this.promotionRepo.findActiveByStore(storeId);
    }
    return this.promotionRepo.findActiveGlobal();
  }

  async listByStore(storeId: string): Promise<any[]> {
    return this.promotionRepo.findByStore(storeId);
  }

  async create({ store_ids, ...promotionData }: CreatePromotionInput): Promise<any> {
    const promotion = await this.promotionRepo.create(promotionData);

    if (store_ids?.length) {
      for (const storeId of store_ids) {
        await this.promotionRepo.assignToStore(promotion.id, storeId);
      }
    }

    const hydratedPromotion = await this.promotionRepo.findByIdOrThrow(promotion.id);

    await this.eventBus.emit(
      new PromotionCreatedEvent(
        hydratedPromotion.id,
        hydratedPromotion.name ?? null,
        hydratedPromotion.code ?? null,
        hydratedPromotion.promotionsStores.map((ps) => ps.store_id ?? ''),
      ),
    );

    return hydratedPromotion;
  }

  async update(id: string, updateData: UpdatePromotionInput): Promise<any> {
    return this.promotionRepo.update(id, updateData);
  }

  async activate(id: string): Promise<any> {
    const promotion = await this.promotionRepo.setActive(id, true);
    await this.eventBus.emit(new PromotionActivatedEvent(id, true));
    return promotion;
  }

  async deactivate(id: string): Promise<any> {
    const promotion = await this.promotionRepo.setActive(id, false);
    await this.eventBus.emit(new PromotionActivatedEvent(id, false));
    return promotion;
  }

  async assignToStore(promotionId: string, storeId: string): Promise<any> {
    await this.promotionRepo.assignToStore(promotionId, storeId);
    return this.promotionRepo.findByIdOrThrow(promotionId);
  }

  async removeFromStore(promotionId: string, storeId: string): Promise<any> {
    await this.promotionRepo.removeFromStore(promotionId, storeId);
    return this.promotionRepo.findByIdOrThrow(promotionId);
  }

  async isEnabledForStore(promotionId: string, storeId: string): Promise<boolean> {
    const promotion = await this.promotionRepo.findByIdOrThrow(promotionId);
    if (!promotion.active) return false;
    
    const storeIds = promotion.promotionsStores.map((ps) => ps.store_id);
    if (storeIds.length === 0) return true;
    
    return storeIds.includes(storeId);
  }

  async getUsageAvailability(promotionId: string): Promise<any> {
    const promotion = await this.promotionRepo.findByIdOrThrow(promotionId);
    const remaining =
      promotion.usage_limit === null
        ? null
        : Math.max(promotion.usage_limit - promotion.usage_count, 0);

    return {
      promotionId: promotion.id,
      usageLimit: promotion.usage_limit,
      usageCount: promotion.usage_count,
      remainingUsage: remaining,
      hasAvailability: remaining === null ? true : remaining > 0,
    };
  }
}