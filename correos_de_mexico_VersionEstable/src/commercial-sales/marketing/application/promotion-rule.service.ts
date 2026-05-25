import { Injectable } from '@nestjs/common';
import {
  PromotionRuleRepository,
} from '../infrastructure/repositories/promotion-rule.repository';
import { PromotionRepository } from '../infrastructure/repositories/promotion.repository';
import type {
  CreatePromotionRuleInput,
  UpdatePromotionRuleInput,
} from './contracts/marketing.facade.contracts';

@Injectable()
export class PromotionRuleService {
  constructor(
    private readonly ruleRepo: PromotionRuleRepository,
    private readonly promotionRepo: PromotionRepository,
  ) {}

  async getById(id: string) {
    return this.ruleRepo.findByIdOrThrow(id);
  }

  async listByPromotion(promotionId: string) {
    await this.promotionRepo.findByIdOrThrow(promotionId);
    return this.ruleRepo.findByPromotion(promotionId);
  }

  async create(data: CreatePromotionRuleInput) {
    await this.promotionRepo.findByIdOrThrow(data.promotion_id);
    return this.ruleRepo.create(data);
  }

  async update(id: string, data: UpdatePromotionRuleInput) {
    return this.ruleRepo.update(id, data);
  }

  async addProductsToRule(ruleId: string, productIds: string[]) {
    return this.ruleRepo.addProducts(ruleId, productIds);
  }

  async removeProductsFromRule(ruleId: string, productIds: string[]) {
    return this.ruleRepo.removeProducts(ruleId, productIds);
  }

  async addUsersToRule(ruleId: string, userIds: string[]) {
    return this.ruleRepo.addUsers(ruleId, userIds);
  }

  async removeUsersFromRule(ruleId: string, userIds: string[]) {
    return this.ruleRepo.removeUsers(ruleId, userIds);
  }

  async deleteRule(id: string) {
    return this.ruleRepo.deleteRule(id);
  }
}
