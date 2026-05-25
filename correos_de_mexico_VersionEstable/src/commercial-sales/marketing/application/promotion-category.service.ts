import { Injectable } from '@nestjs/common';
import {
  PromotionCategoryRepository,
  CreatePromotionCategoryData,
  UpdatePromotionCategoryData,
} from '../infrastructure/repositories/promotion-category.repository';
import { PromotionRepository } from '../infrastructure/repositories/promotion.repository';

@Injectable()
export class PromotionCategoryService {
  constructor(
    private readonly categoryRepo: PromotionCategoryRepository,
    private readonly promotionRepo: PromotionRepository,
  ) {}

  getById(id: string) {
    return this.categoryRepo.findByIdOrThrow(id);
  }

  list() {
    return this.categoryRepo.findMany();
  }

  create(data: CreatePromotionCategoryData) {
    return this.categoryRepo.create(data);
  }

  update(id: string, data: UpdatePromotionCategoryData) {
    return this.categoryRepo.update(id, data);
  }

  async listPromotions(categoryId: string) {
    await this.categoryRepo.findByIdOrThrow(categoryId);
    return this.promotionRepo.findByCategory(categoryId);
  }

  async assignPromotion(promotionId: string, categoryId: string) {
    await this.categoryRepo.findByIdOrThrow(categoryId);
    return this.promotionRepo.assignCategory(promotionId, categoryId);
  }
}
