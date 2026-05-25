import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';

export interface CreateOrderPromotionData {
  order_id: string;
  promotion_id: string;
  promo_total?: number;
  reason?: string | null;
  evaluation_snapshot?: string | null;
}

@Injectable()
export class PromotionOrderRepository {
  constructor(private readonly prisma: PrismaService) {}

  private mapOrderPromotion<T extends {
    promo_total: { toNumber?: () => number } | number;
    promotion?: {
      usage_limit?: number | null;
      usage_count?: number;
      promotionsStores?: Array<{ store_id: string | null }>;
    } | null;
  }>(record: T) {
    const promoTotal =
      typeof record.promo_total === 'number'
        ? record.promo_total
        : record.promo_total.toNumber?.() ?? Number(record.promo_total);

    const promotion = record.promotion
      ? {
          ...record.promotion,
          is_global: (record.promotion.promotionsStores?.length ?? 0) === 0,
          remaining_usage:
            record.promotion.usage_limit === null ||
            record.promotion.usage_limit === undefined
              ? null
              : Math.max(
                  record.promotion.usage_limit - (record.promotion.usage_count ?? 0),
                  0,
                ),
        }
      : null;

    return {
      ...record,
      promo_total: promoTotal,
      promotion,
    };
  }

  async findByOrder(orderId: string) {
    const records = await this.prisma.orderPromotion.findMany({
      where: { order_id: orderId },
      include: {
        promotion: {
          include: {
            promotionCategory: true,
            promotionsStores: true,
            promotionActions: true,
            promotionRules: {
              include: {
                productPromotionRules: true,
                promotionRuleUsers: true,
              },
            },
          },
        },
      },
      orderBy: { created_at: 'desc' },
    });

    return records.map((record) => this.mapOrderPromotion(record));
  }

  async findByPromotion(promotionId: string) {
    return this.prisma.orderPromotion.findMany({
      where: { promotion_id: promotionId },
    });
  }

  async findByOrderAndPromotion(orderId: string, promotionId: string) {
    return this.prisma.orderPromotion.findFirst({
      where: { order_id: orderId, promotion_id: promotionId },
    });
  }

  async create(data: CreateOrderPromotionData) {
    const record = await this.prisma.orderPromotion.create({
      data: {
        order_id: data.order_id,
        promotion_id: data.promotion_id,
        promo_total: data.promo_total ?? 0,
        reason: data.reason ?? null,
        evaluation_snapshot: data.evaluation_snapshot ?? null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      include: {
        promotion: {
          include: {
            promotionCategory: true,
            promotionsStores: true,
            promotionActions: true,
            promotionRules: {
              include: {
                productPromotionRules: true,
                promotionRuleUsers: true,
              },
            },
          },
        },
      },
    });

    return this.mapOrderPromotion(record);
  }

  async deleteByOrder(orderId: string) {
    return this.prisma.orderPromotion.deleteMany({
      where: { order_id: orderId },
    });
  }

  async deleteLink(orderId: string, promotionId: string) {
    return this.prisma.orderPromotion.deleteMany({
      where: { order_id: orderId, promotion_id: promotionId },
    });
  }
}
