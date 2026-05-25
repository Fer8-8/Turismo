import { Injectable, BadRequestException } from '@nestjs/common';
import { InventoryRepository } from '../infrastructure/inventory.repository';

@Injectable()
export class InventoryReservationAppService {
  constructor(private readonly inventoryRepository: InventoryRepository) {}

  // Caso de uso: Validar disponibilidad real (Stock físico - Stock Reservado)
  async getAvailableStock(variantId: string): Promise<number> {
    const totalPhysicalStock = await this.inventoryRepository.getTotalStockForVariant(variantId);
    
    const reservedStock = await this.inventoryRepository.getReservedStockForVariant(variantId); 

    const available = totalPhysicalStock - reservedStock;
    return available > 0 ? available : 0;
  }

  // Caso de uso: Reservar stock para una orden en proceso
  async reserve(variantId: string, quantity: number, orderId: string): Promise<boolean> {
    const available = await this.getAvailableStock(variantId);

    if (available < quantity) {
      // Fallamos rápido y seguro si no hay stock
      throw new BadRequestException(`Stock insuficiente para la variante ${variantId}. Disponible: ${available}`);
    }

    // Si hay stock, creamos la unidad de inventario en estado 'reserved'
    await this.inventoryRepository.createInventoryUnit({
      variantId: variantId,
      orderId: orderId,
      quantity: quantity,
      state: 'reserved',
    });

    return true;
  }

  // Caso de uso: Liberar reserva (Si el cliente cancela la compra o falla el pago)
  async release(variantId: string, quantity: number, orderId: string): Promise<boolean> {
    // Buscamos las unidades reservadas de esa orden y las cancelamos/borramos
    await this.inventoryRepository.releaseInventoryUnits(variantId, orderId);
    return true;
  }
}