import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import {
  PromotionAlreadyAssignedToStoreException,
  PromotionNotAssignedToStoreException,
} from '../../domain/exceptions/promotion.exceptions';

export interface CreatePromotionData {
  name?: string;
  description?: string;
  type?: string;
  code?: string;
  match_policy?: string;
  starts_at?: Date | null;
  expires_at?: Date | null;
  usage_limit?: number | null;
  advertise?: boolean;
  path?: string;
  promotion_category_id?: string | null;
}

export interface UpdatePromotionData extends Partial<CreatePromotionData> {}

export interface PromotionFilter {
  active?: boolean;
  storeId?: string;
  since?: Date;
  until?: Date;
  code?: string;
  name?: string;
  categoryId?: string;
  page?: number;
  take?: number;
}

const PROMOTION_INCLUDE = {
  promotionCategory: true,
  promotionRules: {
    include: {
      productPromotionRules: true,
      promotionRuleUsers: true,
    },
  },
  promotionActions: true,
  promotionsStores: true,
} as const;

function toPromotionView<T extends {
  usage_limit: number | null;
  usage_count: number;
  promotionsStores?: Array<{ store_id: string | null }>;
}>(promotion: T) {
  const remaining =
    promotion.usage_limit === null
      ? null
      : Math.max(promotion.usage_limit - promotion.usage_count, 0);

  return {
    ...promotion,
    is_global: (promotion.promotionsStores?.length ?? 0) === 0,
    remaining_usage: remaining,
  };
}

@Injectable()
export class PromotionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByIdOrThrow(id: string) {
    const promotion = await this.prisma.promotion.findUniqueOrThrow({
      where: { id },
      include: PROMOTION_INCLUDE,
    });
    return toPromotionView(promotion);
  }

  async findByCodeOrThrow(code: string) {
    const promotion = await this.prisma.promotion.findFirstOrThrow({
      where: { code },
      include: PROMOTION_INCLUDE,
    });
    return toPromotionView(promotion);
  }

  async findMany(filter: PromotionFilter = {}) {
    const {
      page = 1,
      take = 20,
      active,
      storeId,
      since,
      until,
      code,
      name,
      categoryId,
    } = filter;
    const skip = (page - 1) * take;

    const promotions = await this.prisma.promotion.findMany({
      where: {
        active,
        promotionsStores: storeId ? { some: { store_id: storeId } } : undefined,
        starts_at: since ? { gte: since } : undefined,
        expires_at: until ? { lte: until } : undefined,
        code: code ? { contains: code, mode: 'insensitive' } : undefined,
        name: name ? { contains: name, mode: 'insensitive' } : undefined,
        promotion_category_id: categoryId,
      },
      include: PROMOTION_INCLUDE,
      orderBy: { created_at: 'desc' },
      skip,
      take,
    });

    return promotions.map(toPromotionView);
  }

  async findActiveByStore(storeId: string, now = new Date()) {
    const promotions = await this.prisma.promotion.findMany({
      where: {
        active: true,
        AND: [
          { OR: [{ starts_at: null }, { starts_at: { lte: now } }] },
          { OR: [{ expires_at: null }, { expires_at: { gte: now } }] },
          {
            OR: [
              { promotionsStores: { some: { store_id: storeId } } },
              { promotionsStores: { none: {} } },
            ],
          },
        ],
      },
      include: PROMOTION_INCLUDE,
    });

    return promotions.map(toPromotionView);
  }

  async findActiveGlobal(now = new Date()) {
    const promotions = await this.prisma.promotion.findMany({
      where: {
        active: true,
        promotionsStores: { none: {} },
        AND: [
          { OR: [{ starts_at: null }, { starts_at: { lte: now } }] },
          { OR: [{ expires_at: null }, { expires_at: { gte: now } }] },
        ],
      },
      include: PROMOTION_INCLUDE,
    });

    return promotions.map(toPromotionView);
  }

  async findByCategory(categoryId: string) {
    const promotions = await this.prisma.promotion.findMany({
      where: { promotion_category_id: categoryId },
      include: PROMOTION_INCLUDE,
      orderBy: { created_at: 'desc' },
    });

    return promotions.map(toPromotionView);
  }

  async findByStore(storeId: string) {
    const promotions = await this.prisma.promotion.findMany({
      where: { promotionsStores: { some: { store_id: storeId } } },
      include: PROMOTION_INCLUDE,
      orderBy: { created_at: 'desc' },
    });

    return promotions.map(toPromotionView);
  }

  async create(data: CreatePromotionData) {
    const promotion = await this.prisma.promotion.create({
      data,
      include: PROMOTION_INCLUDE,
    });

    return toPromotionView(promotion);
  }

  async update(id: string, data: UpdatePromotionData) {
    const promotion = await this.prisma.promotion.update({
      where: { id },
      data,
      include: PROMOTION_INCLUDE,
    });

    return toPromotionView(promotion);
  }

  async setActive(id: string, active: boolean) {
    const promotion = await this.prisma.promotion.update({
      where: { id },
      data: { active },
      include: PROMOTION_INCLUDE,
    });

    return toPromotionView(promotion);
  }

  async incrementUsageCount(id: string) {
    return this.prisma.promotion.update({
      where: { id },
      data: { usage_count: { increment: 1 } },
    });
  }

  async assignCategory(promotionId: string, categoryId: string) {
    const promotion = await this.prisma.promotion.update({
      where: { id: promotionId },
      data: { promotion_category_id: categoryId },
      include: PROMOTION_INCLUDE,
    });

    return toPromotionView(promotion);
  }

  async isAssignedToStore(promotionId: string, storeId: string): Promise<boolean> {
    const link = await this.prisma.promotionsStore.findFirst({
      where: { promotion_id: promotionId, store_id: storeId },
    });
    return link !== null;
  }

  async assignToStore(promotionId: string, storeId: string) {
    const alreadyAssigned = await this.isAssignedToStore(promotionId, storeId);
    if (alreadyAssigned) {
      throw new PromotionAlreadyAssignedToStoreException(promotionId, storeId);
    }
    
    return this.prisma.promotionsStore.create({
      data: { promotion_id: promotionId, store_id: storeId },
    });
  }

  async removeFromStore(promotionId: string, storeId: string) {
    const assigned = await this.isAssignedToStore(promotionId, storeId);
    if (!assigned) {
      throw new PromotionNotAssignedToStoreException(promotionId, storeId);
    }
    return this.prisma.promotionsStore.deleteMany({
      where: { promotion_id: promotionId, store_id: storeId },
    });
  }
}