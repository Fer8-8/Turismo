import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import { PromotionActionNotFoundException } from '../../domain/exceptions/promotion.exceptions';

export interface CreatePromotionActionData {
  promotion_id: string;
  type: string;
  preferences: string;
  position?: number | null;
}

export interface UpdatePromotionActionData {
  type?: string;
  preferences?: string;
  position?: number | null;
}

@Injectable()
export class PromotionActionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string) {
    return this.prisma.promotionAction.findUnique({ where: { id } });
  }

  async findByIdOrThrow(id: string) {
    const a = await this.findById(id);
    if (!a) throw new PromotionActionNotFoundException(id);
    return a;
  }

  async findByPromotion(promotionId: string) {
    return this.prisma.promotionAction.findMany({
      where: { promotion_id: promotionId, deleted_at: null },
      orderBy: { position: 'asc' },
    });
  }

  async create(data: CreatePromotionActionData) {
    return this.prisma.promotionAction.create({
      data: {
        promotion_id: data.promotion_id,
        type: data.type,
        preferences: data.preferences,
        position: data.position ?? null,
        created_at: new Date(),
        updated_at: new Date(),
      },
    });
  }

  async update(id: string, data: UpdatePromotionActionData) {
    await this.findByIdOrThrow(id);
    return this.prisma.promotionAction.update({
      where: { id },
      data: {
        ...(data.type !== undefined ? { type: data.type } : {}),
        ...(data.preferences !== undefined
          ? { preferences: data.preferences }
          : {}),
        ...(data.position !== undefined ? { position: data.position } : {}),
        updated_at: new Date(),
      },
    });
  }

  async softDelete(id: string) {
    await this.findByIdOrThrow(id);
    return this.prisma.promotionAction.update({
      where: { id },
      data: { deleted_at: new Date() },
    });
  }
}
