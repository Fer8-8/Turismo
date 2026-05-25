import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import { PromotionCategoryNotFoundException } from '../../domain/exceptions/promotion.exceptions';

export interface CreatePromotionCategoryData {
  name: string;
  code?: string | null;
}

export interface UpdatePromotionCategoryData {
  name?: string;
  code?: string | null;
}

@Injectable()
export class PromotionCategoryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string) {
    return this.prisma.promotionCategory.findUnique({
      where: { id },
      include: {
        promotions: {
          include: {
            promotionActions: true,
            promotionRules: {
              include: {
                productPromotionRules: true,
                promotionRuleUsers: true,
              },
            },
            promotionsStores: true,
            promotionCategory: true,
          },
        },
      },
    });
  }

  async findByIdOrThrow(id: string) {
    const category = await this.findById(id);
    if (!category) throw new PromotionCategoryNotFoundException(id);
    return category;
  }

  async findMany() {
    return this.prisma.promotionCategory.findMany({
      include: {
        promotions: {
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
      orderBy: { name: 'asc' },
    });
  }

  async create(data: CreatePromotionCategoryData) {
    return this.prisma.promotionCategory.create({
      data: {
        name: data.name,
        code: data.code ?? null,
      },
      include: { promotions: true },
    });
  }

  async update(id: string, data: UpdatePromotionCategoryData) {
    await this.findByIdOrThrow(id);
    return this.prisma.promotionCategory.update({
      where: { id },
      data: {
        ...(data.name !== undefined ? { name: data.name } : {}),
        ...(data.code !== undefined ? { code: data.code } : {}),
      },
      include: { promotions: true },
    });
  }
}