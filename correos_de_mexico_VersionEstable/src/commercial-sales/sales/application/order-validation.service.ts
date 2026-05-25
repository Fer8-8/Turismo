import { Injectable } from '@nestjs/common';
import { UserFacade } from '../../../core/user/facades/user.facade';
import { StoreFacade } from '../../../core/store/facades/store.facade';
import { ProductFacade } from '../../../catalog/product/facades/product.facade';
import { InventoryFacade } from '../../../inventory/inventory.facade';
import {
  VariantUnavailableException,
  InsufficientInventoryException,
} from '../domain/exceptions/order.exceptions';
import {
  AppNotFoundException,
  BusinessException,
} from '../../../core/shared';

export interface ValidateLineItemInput {
  variantId: string;
  quantity: number;
  checkInventory?: boolean;
}

export interface ValidatedVariantData {
  variantId: string;
  sku: string;
  productName: string;
  basePrice: number;
  currency: string;
  taxCategoryId: string | null;
  costPrice: number | null;
  trackInventory: boolean;
}

@Injectable()
export class OrderValidationService {
  constructor(
    private readonly userFacade: UserFacade,
    private readonly storeFacade: StoreFacade,
    private readonly productFacade: ProductFacade,
    private readonly inventoryFacade: InventoryFacade,
  ) {}

  async validateUserExists(userId: string): Promise<void> {
    const exists = await this.userFacade.validateUserExists(userId);
    if (!exists) {
      throw new AppNotFoundException('User', userId);
    }
  }

  async validateStoreAccess(storeId: string): Promise<void> {
    await this.storeFacade.validateStoreAccess(storeId);
  }

  async validateAndResolveVariant(
    input: ValidateLineItemInput,
  ): Promise<ValidatedVariantData> {
    const { variantId, quantity, checkInventory = true } = input;

    if (quantity <= 0) {
      throw new BusinessException(
        `La cantidad debe ser mayor a 0; recibido: ${quantity}`,
      );
    }

    const isAvailable = await this.productFacade.isVariantAvailable(variantId);
    if (!isAvailable) {
      throw new VariantUnavailableException(variantId);
    }

    const variant = await this.productFacade.getVariantForSales(variantId);
    const priceRecord = await this.productFacade.getVariantBasePrice(variantId);

    if (!priceRecord || priceRecord.amount === null) {
      throw new BusinessException(
        `La variante ${variantId} no tiene precio base configurado`,
      );
    }

    const trackInventory = await this.productFacade.isVariantTrackable(
      variantId,
    );

    if (checkInventory && trackInventory) {
      const availability = await this.inventoryFacade.getSalesAvailability(
        variantId,
        quantity,
      );

      if (!availability.canSell) {
        throw new InsufficientInventoryException(
          variantId,
          quantity,
          availability.totalAvailable,
        );
      }
    }

    return {
      variantId,
      sku: variant.sku,
      productName: variant.product?.name ?? '',
      basePrice: Number(priceRecord.amount),
      currency: priceRecord.currency ?? 'MXN',
      taxCategoryId: variant.tax_category_id ?? null,
      costPrice: variant.cost_price ? Number(variant.cost_price) : null,
      trackInventory,
    };
  }

  async validateVariantBelongsToStore(
    storeId: string,
    variantId: string,
  ): Promise<void> {
    const variant = await this.productFacade.getVariantForSales(variantId);
    if (!variant.product_id) return;

    const available = await this.storeFacade.isProductAvailableInStore(
      storeId,
      variant.product_id,
    );

    if (!available) {
      throw new VariantUnavailableException(variantId);
    }
  }
}
