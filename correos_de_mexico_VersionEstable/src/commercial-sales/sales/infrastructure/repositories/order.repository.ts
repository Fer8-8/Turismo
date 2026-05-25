import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import { OrderState } from '../../domain/enums/order-state.enum';
import { OrderNotFoundException } from '../../domain/exceptions/order.exceptions';
import { OrderTotals } from '../../domain/calculators/order-totals.calculator';
import { randomUUID } from 'crypto';

export interface CreateOrderData {
  user_id: string;
  store_id: string;
  currency: string;
  email: string;
  channel?: string;
}

export interface OrderListFilters {
  userId: string;
  storeId?: string;
  state?: string;
  page?: number;
  take?: number;
}

export interface UpdateOrderTotalsData extends OrderTotals {
  adjustment_total: number;
}

const ORDER_WITH_LINES = {
  lineItems: {
    include: {
      variant: {
        include: {
          prices: { where: { deleted_at: null } },
          product: { select: { id: true, name: true, slug: true } },
        },
      },
    },
  },
  billAddress: true,
  shipAddress: true,
  store: true,
} as const;

@Injectable()
export class OrderRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateOrderData) {
    const number = this.generateOrderNumber();
    return this.prisma.order.create({
      data: {
        number,
        user_id: data.user_id,
        store_id: data.store_id,
        currency: data.currency,
        email: data.email,
        channel: data.channel ?? 'cdm',
        state: OrderState.CART,
        item_total: 0,
        total: 0,
        adjustment_total: 0,
        promo_total: 0,
        shipment_total: 0,
        additional_tax_total: 0,
        included_tax_total: 0,
        payment_total: 0,
        item_count: 0,
      },
      include: ORDER_WITH_LINES,
    });
  }

  async findById(id: string) {
    return this.prisma.order.findUnique({
      where: { id },
      include: ORDER_WITH_LINES,
    });
  }

  async findByIdOrThrow(id: string) {
    const order = await this.findById(id);
    if (!order) throw new OrderNotFoundException(id);
    return order;
  }

  async findByNumber(number: string) {
    return this.prisma.order.findFirst({
      where: { number },
      include: ORDER_WITH_LINES,
    });
  }

  async findByIdForUser(id: string, userId: string, storeId?: string) {
    return this.prisma.order.findFirst({
      where: {
        id,
        user_id: userId,
        ...(storeId ? { store_id: storeId } : {}),
      },
      include: ORDER_WITH_LINES,
    });
  }

  async findByUser(filters: OrderListFilters) {
    const { userId, storeId, state, page = 1, take = 20 } = filters;
    const skip = (page - 1) * take;

    const where = {
      user_id: userId,
      ...(storeId ? { store_id: storeId } : {}),
      ...(state ? { state } : {}),
    };

    const [items, total] = await this.prisma.$transaction([
      this.prisma.order.findMany({
        where,
        include: ORDER_WITH_LINES,
        orderBy: { created_at: 'desc' },
        skip,
        take,
      }),
      this.prisma.order.count({ where }),
    ]);

    return { items, total, page, take };
  }

  async updateState(id: string, state: OrderState) {
    const data: Record<string, unknown> = { state };
    if (state === OrderState.CANCELLED) {
      data.canceled_at = new Date();
    }
    if (state === OrderState.APPROVED) {
      data.approved_at = new Date();
    }
    return this.prisma.order.update({ where: { id }, data });
  }

  async updateAddresses(
    id: string,
    addresses: { bill_address_id?: string; ship_address_id?: string },
  ) {
    return this.prisma.order.update({
      where: { id },
      data: addresses,
      include: ORDER_WITH_LINES,
    });
  }

  async updateTotals(id: string, totals: UpdateOrderTotalsData) {
    return this.prisma.order.update({
      where: { id },
      data: {
        item_total: totals.item_total,
        adjustment_total: totals.adjustment_total,
        promo_total: totals.promo_total,
        shipment_total: totals.shipment_total,
        additional_tax_total: totals.additional_tax_total,
        included_tax_total: totals.included_tax_total,
        payment_total: totals.payment_total,
        total: totals.total,
        item_count: totals.item_count,
      },
    });
  }

  // devuelve solo los artículos de línea con campos fiscales para recalcular totales.
  async findLineItemsForTotals(orderId: string) {
    return this.prisma.lineItem.findMany({
      where: { order_id: orderId },
      select: {
        price: true,
        quantity: true,
        adjustment_total: true,
        promo_total: true,
        additional_tax_total: true,
        included_tax_total: true,
      },
    });
  }

  private generateOrderNumber(): string {
    const ts = Date.now().toString(36).toUpperCase();
    const rand = randomUUID().replace(/-/g, '').slice(0, 6).toUpperCase();
    return `R${ts}${rand}`;
  }
}
