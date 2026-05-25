import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import { PromotionRuleNotFoundException } from '../../domain/exceptions/promotion.exceptions';

export interface CreatePromotionRuleData {
  promotion_id: string;
  type: string;
  code?: string | null;
  preferences?: string | null;
  product_ids?: string[];
  user_ids?: string[];
}

export interface UpdatePromotionRuleData {
  type?: string;
  code?: string | null;
  preferences?: string | null;
}

const RULE_INCLUDE = {
  productPromotionRules: true,
  promotionRuleUsers: true,
} as const;

@Injectable()
export class PromotionRuleRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string) {
    return this.prisma.promotionRule.findUnique({
      where: { id },
      include: RULE_INCLUDE,
    });
  }

  async findByIdOrThrow(id: string) {
    const r = await this.findById(id);
    if (!r) throw new PromotionRuleNotFoundException(id);
    return r;
  }

  async findByPromotion(promotionId: string) {
    return this.prisma.promotionRule.findMany({
      where: { promotion_id: promotionId },
      include: RULE_INCLUDE,
      orderBy: { created_at: 'asc' },
    });
  }

  async create(data: CreatePromotionRuleData) {
    const rule = await this.prisma.promotionRule.create({
      data: {
        promotion_id: data.promotion_id,
        type: data.type,
        code: data.code ?? null,
        preferences: data.preferences ?? null,
      },
      include: RULE_INCLUDE,
    });

    if (data.product_ids && data.product_ids.length > 0) {
      await this.prisma.productPromotionRule.createMany({
        data: data.product_ids.map((product_id) => ({
          product_id,
          promotion_rule_id: rule.id,
        })),
        skipDuplicates: true,
      });
      return this.findByIdOrThrow(rule.id);
    }

    if (data.user_ids && data.user_ids.length > 0) {
      await this.prisma.promotionRuleUser.createMany({
        data: data.user_ids.map((user_id) => ({
          user_id,
          promotion_rule_id: rule.id,
        })),
        skipDuplicates: true,
      });
      return this.findByIdOrThrow(rule.id);
    }

    return rule;
  }

  async update(id: string, data: UpdatePromotionRuleData) {
    await this.findByIdOrThrow(id);
    return this.prisma.promotionRule.update({
      where: { id },
      data: {
        ...(data.type !== undefined ? { type: data.type } : {}),
        ...(data.code !== undefined ? { code: data.code } : {}),
        ...(data.preferences !== undefined
          ? { preferences: data.preferences }
          : {}),
      },
      include: RULE_INCLUDE,
    });
  }

  async addProducts(ruleId: string, productIds: string[]) {
    await this.findByIdOrThrow(ruleId);
    await this.prisma.productPromotionRule.createMany({
      data: productIds.map((product_id) => ({
        product_id,
        promotion_rule_id: ruleId,
      })),
      skipDuplicates: true,
    });
    return this.findByIdOrThrow(ruleId);
  }

  async removeProducts(ruleId: string, productIds: string[]) {
    await this.findByIdOrThrow(ruleId);
    await this.prisma.productPromotionRule.deleteMany({
      where: {
        promotion_rule_id: ruleId,
        product_id: { in: productIds },
      },
    });
    return this.findByIdOrThrow(ruleId);
  }

  async addUsers(ruleId: string, userIds: string[]) {
    await this.findByIdOrThrow(ruleId);
    await this.prisma.promotionRuleUser.createMany({
      data: userIds.map((user_id) => ({
        user_id,
        promotion_rule_id: ruleId,
      })),
      skipDuplicates: true,
    });
    return this.findByIdOrThrow(ruleId);
  }

  async removeUsers(ruleId: string, userIds: string[]) {
    await this.findByIdOrThrow(ruleId);
    await this.prisma.promotionRuleUser.deleteMany({
      where: {
        promotion_rule_id: ruleId,
        user_id: { in: userIds },
      },
    });
    return this.findByIdOrThrow(ruleId);
  }

  async deleteRule(id: string) {
    await this.findByIdOrThrow(id);
    await this.prisma.productPromotionRule.deleteMany({
      where: { promotion_rule_id: id },
    });
    await this.prisma.promotionRuleUser.deleteMany({
      where: { promotion_rule_id: id },
    });
    return this.prisma.promotionRule.delete({ where: { id } });
  }
}
