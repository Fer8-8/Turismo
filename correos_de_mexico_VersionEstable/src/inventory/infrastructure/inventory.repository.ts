import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { StockItem } from '../types/stockItem.type';

import { Prisma } from '../../prisma/client';

const INVENTORY_UNIT_LOOKUP_INCLUDE = {
  lineItem: {
    select: {
      quantity: true,
      pre_tax_amount: true,
      included_tax_total: true,
      additional_tax_total: true,
    },
  },
} satisfies Prisma.InventoryUnitInclude;

export type InventoryUnitRecord = Prisma.InventoryUnitGetPayload<{
  include: typeof INVENTORY_UNIT_LOOKUP_INCLUDE;
}>;

@Injectable()
export class InventoryRepository {
  constructor(private readonly prisma: PrismaService) {}

  // Retrieves available stock item by variant and location
  async findStockItem(variantId: string, locationId: string): Promise<StockItem | null> {
    return this.prisma.stockItem.findFirst({
      where: {
        variant_id: variantId,
        stock_location_id: locationId,
        deleted_at: null,
      },
    });
  }

  // Aggregates total physical stock for a variant across all active locations
  async getTotalStockForVariant(variantId: string): Promise<number> {
    const result = await this.prisma.stockItem.aggregate({
      where: { 
        variant_id: variantId, 
        deleted_at: null 
      },
      _sum: { count_on_hand: true },
    });
    
    return result._sum.count_on_hand || 0;
  }

  // Executes a stock adjustment and records the movement within a transaction
  async adjustStockWithMovement(
    variantId: string,
    locationId: string,
    quantityChange: number,
    action: string,
    originatorType?: string,
    originatorId?: string,
  ): Promise<StockItem> {
    return this.prisma.$transaction(async (tx) => {
      const existingStock = await tx.stockItem.findFirst({
        where: { variant_id: variantId, stock_location_id: locationId },
      });

      let stockItem;

      if (existingStock) {
        stockItem = await tx.stockItem.update({
          where: { id: existingStock.id },
          data: { count_on_hand: { increment: quantityChange } },
        });
      } else {
        stockItem = await tx.stockItem.create({
          data: {
            variant_id: variantId,
            stock_location_id: locationId,
            count_on_hand: Math.max(0, quantityChange),
          },
        });
      }

      await tx.stockMovement.create({
        data: {
          stock_item_id: stockItem.id,
          quantity: quantityChange,
          action,
          originator_type: originatorType,
          originator_id: originatorId,
        },
      });

      return stockItem;
    });
  }

  // Sums total reserved quantity for a specific variant based on inventory units
  async getReservedStockForVariant(variantId: string): Promise<number> {
    const result = await this.prisma.inventoryUnit.aggregate({
      where: {
        variant_id: variantId,
        state: 'reserved',
      },
      _sum: { quantity: true },
    });

    return result._sum.quantity || 0;
  }

  // Creates a single inventory unit record with aggregated quantity for order reservations
  async createInventoryUnit(data: {
    variantId: string;
    orderId: string;
    quantity: number;
    state: string;
  }) {
    return this.prisma.inventoryUnit.create({
      data: {
        variant_id: data.variantId,
        order_id: data.orderId,
        quantity: data.quantity,
        state: data.state,
        pending: true,
      },
    });
  }

  // Releases reserved inventory units associated with a canceled or failed order
  async releaseInventoryUnits(variantId: string, orderId: string): Promise<void> {
    await this.prisma.inventoryUnit.deleteMany({
      where: {
        variant_id: variantId,
        order_id: orderId,
        state: 'reserved',
      },
    });
  }

  async findInventoryUnitById(inventoryUnitId: string): Promise<InventoryUnitRecord | null> {
    return this.prisma.inventoryUnit.findUnique({
      where: { id: inventoryUnitId },
      include: INVENTORY_UNIT_LOOKUP_INCLUDE,
    });
  }

  async updateInventoryUnitState(
    inventoryUnitId: string,
    data: {
      state: string;
      pending?: boolean;
    },
  ): Promise<void> {
    await this.prisma.inventoryUnit.update({
      where: { id: inventoryUnitId },
      data: {
        state: data.state,
        ...(data.pending !== undefined ? { pending: data.pending } : {}),
      },
    });
  }

  async findStockLocationById(stockLocationId: string) {
    return this.prisma.stockLocation.findFirst({
      where: {
        id: stockLocationId,
        active: true,
      },
      select: {
        id: true,
        active: true,
      },
    });
  }
}