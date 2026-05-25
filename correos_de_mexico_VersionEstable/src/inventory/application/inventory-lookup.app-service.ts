import { Injectable, NotFoundException } from '@nestjs/common';
import {
  InventoryRepository,
  InventoryUnitRecord,
} from '../infrastructure/inventory.repository';

type DecimalLike = { toNumber?: () => number } | number | null;

export interface InventoryUnitLookup {
  id: string;
  state: string | null;
  pending: boolean;
  quantity: number;
  order_id: string | null;
  lineItem: {
    quantity: number | null;
    pre_tax_amount: DecimalLike;
    included_tax_total: DecimalLike;
    additional_tax_total: DecimalLike;
  } | null;
}

export interface InventoryStockLocationLookup {
  id: string;
  active: boolean;
}

@Injectable()
export class InventoryLookupAppService {
  constructor(private readonly inventoryRepository: InventoryRepository) {}

  async getInventoryUnit(inventoryUnitId: string): Promise<InventoryUnitLookup> {
    const inventoryUnit = await this.inventoryRepository.findInventoryUnitById(inventoryUnitId);

    if (!inventoryUnit) {
      throw new NotFoundException(`InventoryUnit ${inventoryUnitId} no existe`);
    }

    return this.mapInventoryUnit(inventoryUnit);
  }

  async updateInventoryUnitState(
    inventoryUnitId: string,
    state: string,
    pending?: boolean,
  ): Promise<void> {
    await this.getInventoryUnit(inventoryUnitId);
    await this.inventoryRepository.updateInventoryUnitState(inventoryUnitId, {
      state,
      pending,
    });
  }

  async getStockLocation(stockLocationId: string): Promise<InventoryStockLocationLookup> {
    const stockLocation = await this.inventoryRepository.findStockLocationById(stockLocationId);

    if (!stockLocation) {
      throw new NotFoundException(`StockLocation ${stockLocationId} no existe o no está activa`);
    }

    return stockLocation;
  }

  private mapInventoryUnit(inventoryUnit: InventoryUnitRecord): InventoryUnitLookup {
    return {
      id: inventoryUnit.id,
      state: inventoryUnit.state ?? null,
      pending: inventoryUnit.pending,
      quantity: inventoryUnit.quantity,
      order_id: inventoryUnit.order_id ?? null,
      lineItem: inventoryUnit.lineItem
        ? {
            quantity: inventoryUnit.lineItem.quantity,
            pre_tax_amount: inventoryUnit.lineItem.pre_tax_amount,
            included_tax_total: inventoryUnit.lineItem.included_tax_total,
            additional_tax_total: inventoryUnit.lineItem.additional_tax_total,
          }
        : null,
    };
  }
}