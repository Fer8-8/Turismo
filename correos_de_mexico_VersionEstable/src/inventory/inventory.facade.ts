import { Injectable } from '@nestjs/common';
import { InventoryReservationAppService } from './application/inventory-reservation.app-service';
import { InventoryMovementAppService } from './application/inventory-movement.app-service';
import {
  InventoryLookupAppService,
  InventoryStockLocationLookup,
  InventoryUnitLookup,
} from './application/inventory-lookup.app-service';

export interface SalesAvailability {
  totalAvailable: number;
  canSell: boolean;
}

@Injectable()
export class InventoryFacade {
  constructor(
    private readonly reservationService: InventoryReservationAppService,
    private readonly movementService: InventoryMovementAppService,
    private readonly lookupService: InventoryLookupAppService,
  ) {}

  // Validates available physical stock minus reserved units
  async getAvailableStock(variantId: string): Promise<number> {
    return this.reservationService.getAvailableStock(variantId);
  }

  async getSalesAvailability(
    variantId: string,
    requestedQuantity: number,
  ): Promise<SalesAvailability> {
    const totalAvailable = await this.reservationService.getAvailableStock(variantId);

    return {
      totalAvailable,
      canSell: totalAvailable >= requestedQuantity,
    };
  }

  // Reserves inventory for an ongoing order
  async reserveStock(variantId: string, quantity: number, orderId: string): Promise<boolean> {
    return this.reservationService.reserve(variantId, quantity, orderId);
  }

  // Releases reserved inventory back to the available pool
  async releaseReservation(variantId: string, quantity: number, orderId: string): Promise<boolean> {
    return this.reservationService.release(variantId, quantity, orderId);
  }

  async getInventoryUnit(inventoryUnitId: string): Promise<InventoryUnitLookup> {
    return this.lookupService.getInventoryUnit(inventoryUnitId);
  }

  async updateInventoryUnitState(
    inventoryUnitId: string,
    state: string,
    pending?: boolean,
  ): Promise<void> {
    await this.lookupService.updateInventoryUnitState(inventoryUnitId, state, pending);
  }

  async getStockLocation(stockLocationId: string): Promise<InventoryStockLocationLookup> {
    return this.lookupService.getStockLocation(stockLocationId);
  }

  // Decrements physical inventory permanently
  async decrementInventory(
    variantId: string,
    locationId: string,
    quantity: number,
    reason: string,
    originatorId?: string,
  ) {
    return this.movementService.decrement(variantId, locationId, quantity, reason, originatorId);
  }

  // Increments physical inventory
  async incrementInventory(
    variantId: string,
    locationId: string,
    quantity: number,
    reason: string,
    originatorId?: string,
  ) {
    return this.movementService.increment(variantId, locationId, quantity, reason, originatorId);
  }
}