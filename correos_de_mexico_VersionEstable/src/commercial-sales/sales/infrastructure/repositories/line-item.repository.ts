import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import { LineItemNotFoundException } from '../../domain/exceptions/order.exceptions';

export interface CreateLineItemData {
  order_id: string;
  variant_id: string;
  quantity: number;
  price: number;
  currency?: string;
  cost_price?: number | null;
  tax_category_id?: string | null;
}

export interface UpdateLineItemData {
  quantity?: number;
  price?: number;
  pre_tax_amount?: number;
  additional_tax_total?: number;
  included_tax_total?: number;
  adjustment_total?: number;
  promo_total?: number;
}

const LINE_ITEM_WITH_VARIANT = {
  variant: {
    include: {
      prices: { where: { deleted_at: null } },
      product: { select: { id: true, name: true, slug: true } },
    },
  },
} as const;

@Injectable()
export class LineItemRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateLineItemData) {
    return this.prisma.lineItem.create({
      data: {
        order_id: data.order_id,
        variant_id: data.variant_id,
        quantity: data.quantity,
        price: data.price,
        currency: data.currency,
        cost_price: data.cost_price ?? null,
        tax_category_id: data.tax_category_id ?? null,
        adjustment_total: 0,
        promo_total: 0,
        additional_tax_total: 0,
        included_tax_total: 0,
      },
      include: LINE_ITEM_WITH_VARIANT,
    });
  }

  async findById(id: string) {
    return this.prisma.lineItem.findUnique({
      where: { id },
      include: LINE_ITEM_WITH_VARIANT,
    });
  }

  async findByIdOrThrow(id: string) {
    const item = await this.findById(id);
    if (!item) throw new LineItemNotFoundException(id);
    return item;
  }

  async findByOrder(orderId: string) {
    return this.prisma.lineItem.findMany({
      where: { order_id: orderId },
      include: LINE_ITEM_WITH_VARIANT,
      orderBy: { created_at: 'asc' },
    });
  }

  async findByOrderAndVariant(orderId: string, variantId: string) {
    return this.prisma.lineItem.findFirst({
      where: { order_id: orderId, variant_id: variantId },
      include: LINE_ITEM_WITH_VARIANT,
    });
  }

  async update(id: string, data: UpdateLineItemData) {
    return this.prisma.lineItem.update({
      where: { id },
      data,
      include: LINE_ITEM_WITH_VARIANT,
    });
  }

  async updateManyPricing(
    items: Array<{
      id: string;
      pre_tax_amount: number;
      additional_tax_total: number;
      included_tax_total: number;
      promo_total: number;
      adjustment_total: number;
    }>,
  ) {
    await this.prisma.$transaction(
      items.map((item) =>
        this.prisma.lineItem.update({
          where: { id: item.id },
          data: {
            pre_tax_amount: item.pre_tax_amount,
            additional_tax_total: item.additional_tax_total,
            included_tax_total: item.included_tax_total,
            promo_total: item.promo_total,
            adjustment_total: item.adjustment_total,
          },
        }),
      ),
    );
  }

  async delete(id: string) {
    return this.prisma.lineItem.delete({ where: { id } });
  }
}
