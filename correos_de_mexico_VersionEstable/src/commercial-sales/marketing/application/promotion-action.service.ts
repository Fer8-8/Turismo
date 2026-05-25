import { Injectable } from '@nestjs/common';
import {
  PromotionActionRepository,
} from '../infrastructure/repositories/promotion-action.repository';
import { PromotionRepository } from '../infrastructure/repositories/promotion.repository';
import { parseActionPreferences } from '../domain/calculators/promotion-discount.calculator';
import type {
  CreatePromotionActionInput,
  UpdatePromotionActionInput,
} from './contracts/marketing.facade.contracts';

@Injectable()
export class PromotionActionService {
  constructor(
    private readonly actionRepo: PromotionActionRepository,
    private readonly promotionRepo: PromotionRepository,
  ) {}

  async getById(id: string) {
    return this.actionRepo.findByIdOrThrow(id);
  }

  async listByPromotion(promotionId: string) {
    await this.promotionRepo.findByIdOrThrow(promotionId);
    return this.actionRepo.findByPromotion(promotionId);
  }

  async create(data: CreatePromotionActionInput) {
    await this.promotionRepo.findByIdOrThrow(data.promotion_id);
    // validar preferencias antes de persistir
    parseActionPreferences(data.type, data.preferences);
    return this.actionRepo.create(data);
  }

  async update(id: string, data: UpdatePromotionActionInput) {
    const existing = await this.actionRepo.findByIdOrThrow(id);
    if (data.type !== undefined || data.preferences !== undefined) {
      const type = data.type ?? existing.type ?? '';
      const preferences = data.preferences ?? existing.preferences ?? null;
      parseActionPreferences(type, preferences);
    }
    return this.actionRepo.update(id, data);
  }

  async softDelete(id: string) {
    return this.actionRepo.softDelete(id);
  }
}
