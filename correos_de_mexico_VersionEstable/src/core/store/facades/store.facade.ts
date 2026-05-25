import { Injectable } from '@nestjs/common';
import { StoreService } from '../services/store.service';
import { Store } from '../entities/store.entity';

// punto de acceso público de tiendas para otros módulos
@Injectable()
export class StoreFacade {
  constructor(private storeService: StoreService) {}

  // obtiene una tienda por su id
  async getStoreById(storeId: string): Promise<Store> {
    return this.storeService.getStoreById(storeId);
  }

  // obtiene una tienda por su código
  async getStoreByCode(code: string): Promise<Store> {
    return this.storeService.getStoreByCode(code);
  }

  // resuelve una tienda por id o código
  async resolveStore(storeId?: string, code?: string): Promise<Store> {
    return this.storeService.resolveStore(storeId, code);
  }

  // valida que la tienda exista y esté activa
  async validateStoreAccess(storeId: string): Promise<void> {
    return this.storeService.validateStoreAccess(storeId);
  }

  // valida si una tienda existe
  async validateStoreExists(storeId: string): Promise<boolean> {
    return this.storeService.validateStoreExists(storeId);
  }

  // valida si una tienda está activa
  async validateStoreIsActive(storeId: string): Promise<boolean> {
    return this.storeService.validateStoreIsActive(storeId);
  }

  // obtiene los ids de productos disponibles en una tienda
  async getProductsForStore(storeId: string): Promise<string[]> {
    const dto = await this.storeService.getEnabledProductsForStore(storeId);
    return dto.product_ids;
  }

  // valida si un producto está disponible en una tienda
  async isProductAvailableInStore(
    storeId: string,
    productId: string,
  ): Promise<boolean> {
    return this.storeService.isProductAvailableInStore(storeId, productId);
  }

  // obtiene las tiendas que venden un producto
  async getStoresForProduct(productId: string): Promise<string[]> {
    return this.storeService.getStoresForProduct(productId);
  }

  // obtiene los métodos de pago habilitados en una tienda
  async getPaymentMethodsForStore(storeId: string): Promise<string[]> {
    const dto =
      await this.storeService.getEnabledPaymentMethodsForStore(storeId);
    return dto.payment_method_ids;
  }

  // valida si un método de pago está habilitado en una tienda
  async isPaymentMethodEnabledInStore(
    storeId: string,
    paymentMethodId: string,
  ): Promise<boolean> {
    return this.storeService.isPaymentMethodEnabledInStore(
      storeId,
      paymentMethodId,
    );
  }

  // obtiene las promociones activas en una tienda
  async getPromotionsForStore(storeId: string): Promise<string[]> {
    const dto =
      await this.storeService.getEnabledPromotionsForStore(storeId);
    return dto.promotion_ids;
  }

  // valida si una promoción aplica a una tienda
  async isPromotionAppliedToStore(
    storeId: string,
    promotionId: string,
  ): Promise<boolean> {
    return this.storeService.isPromotionAppliedToStore(
      storeId,
      promotionId,
    );
  }

  // obtiene las taxonomías de una tienda
  async getTaxonomiesForStore(storeId: string): Promise<string[]> {
    return this.storeService.getTaxonomiesForStore(storeId);
  }

  // obtiene la zona de checkout de una tienda
  async getCheckoutZoneForStore(
    storeId: string,
  ): Promise<string | null> {
    return this.storeService.getCheckoutZoneForStore(storeId);
  }

  // obtiene la configuración regional de una tienda
  async getRegionalConfiguration(storeId: string) {
    return this.storeService.getStoreRegionalConfiguration(storeId);
  }
}
