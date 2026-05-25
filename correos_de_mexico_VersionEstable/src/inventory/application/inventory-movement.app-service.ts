import { Injectable } from '@nestjs/common';
import { InventoryRepository } from '../infrastructure/inventory.repository';

@Injectable()
export class InventoryMovementAppService {
  constructor(private readonly inventoryRepository: InventoryRepository) {}

  // Caso de uso: Incrementar inventario (Ingreso de mercancía o devolución)
  async increment(
    variantId: string,
    locationId: string,
    quantity: number,
    reason: string,
    originatorId?: string,
  ) {
    if (quantity <= 0) throw new Error('La cantidad a incrementar debe ser mayor a 0');

    return this.inventoryRepository.adjustStockWithMovement(
      variantId,
      locationId,
      quantity, // Positivo
      reason,
      'increment',
      originatorId,
    );
  }

  // Caso de uso: Decrementar inventario físico (Salida de almacén definitiva)
  async decrement(
    variantId: string,
    locationId: string,
    quantity: number,
    reason: string,
    originatorId?: string,
  ) {
    if (quantity <= 0) throw new Error('La cantidad a decrementar debe ser mayor a 0');

    // Validar si hay stock físico suficiente antes de restar, 
    // usualmente el decremento ocurre cuando ya se apartó (reservó) previamente.
    return this.inventoryRepository.adjustStockWithMovement(
      variantId,
      locationId,
      -Math.abs(quantity), // Negativo garantizado
      reason,
      'decrement',
      originatorId,
    );
  }
}