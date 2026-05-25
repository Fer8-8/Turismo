import { Injectable } from '@nestjs/common';
import { BusinessException } from '../../core/shared';
import { StoreFacade } from '../../core/store/facades/store.facade';
import { ShippingCategoryRepository } from '../infrastructure/repositories/shipping-category.repository';
import { ShippingMethodRepository } from '../infrastructure/repositories/shipping-method.repository';
import { serializeShippingCategory, serializeShippingMethod } from './fulfillment.mapper';

export interface CreateShippingCategoryInput {
  name: string;
  code?: string;
  isGlobal?: boolean;
  storeId?: string;
}

export interface UpdateShippingCategoryInput {
  categoryId: string;
  name?: string;
  code?: string;
  isGlobal?: boolean;
  storeId?: string | null;
}

@Injectable()
export class ShippingCategoryService {
  constructor(
    private readonly categoryRepo: ShippingCategoryRepository,
    private readonly methodRepo: ShippingMethodRepository,
    private readonly storeFacade: StoreFacade,
  ) {}

  async createShippingCategory(input: CreateShippingCategoryInput) {
    const scope = await this.resolveScope(input.storeId, input.isGlobal);
    const category = await this.categoryRepo.create({
      name: input.name,
      code: input.code ?? null,
      is_global: scope.isGlobal,
      store_id: scope.storeId,
    });

    return serializeShippingCategory(category);
  }

  async getShippingCategoryById(categoryId: string) {
    const category = await this.categoryRepo.findByIdOrThrow(categoryId);
    return serializeShippingCategory(category);
  }

  async listShippingCategories(storeId?: string) {
    if (storeId) {
      await this.storeFacade.validateStoreAccess(storeId);
    }

    const categories = await this.categoryRepo.findMany({ storeId });
    return categories.map((category) => serializeShippingCategory(category));
  }

  async updateShippingCategory(input: UpdateShippingCategoryInput) {
    const existing = await this.categoryRepo.findByIdOrThrow(input.categoryId);
    const existingCategory = existing as typeof existing & {
      store_id?: string | null;
      is_global?: boolean;
    };
    const scope = await this.resolveScope(
      input.storeId === undefined ? existingCategory.store_id ?? undefined : input.storeId ?? undefined,
      input.isGlobal ?? existingCategory.is_global ?? true,
    );

    const category = await this.categoryRepo.update(input.categoryId, {
      ...(input.name !== undefined ? { name: input.name } : {}),
      ...(input.code !== undefined ? { code: input.code } : {}),
      is_global: scope.isGlobal,
      store_id: scope.storeId,
    });

    return serializeShippingCategory(category);
  }

  async associateMethodToCategory(methodId: string, categoryId: string) {
    const method = await this.methodRepo.findByIdOrThrow(methodId);
    const category = await this.categoryRepo.findByIdOrThrow(categoryId);
    const scopedMethod = method as typeof method & {
      is_global?: boolean;
      store_id?: string | null;
    };
    const scopedCategory = category as typeof category & {
      is_global?: boolean;
      store_id?: string | null;
    };

    if (
      !scopedMethod.is_global &&
      !scopedCategory.is_global &&
      scopedMethod.store_id !== scopedCategory.store_id
    ) {
      throw new BusinessException(
        'El método y la categoría de envío con alcance de tienda deben pertenecer a la misma tienda',
        'SHIPPING_SCOPE_MISMATCH',
      );
    }

    await this.categoryRepo.associateMethod(categoryId, methodId);
    return true;
  }

  disassociateMethodFromCategory(methodId: string, categoryId: string) {
    return this.categoryRepo.disassociateMethod(categoryId, methodId);
  }

  async listCategoriesForMethod(methodId: string) {
    await this.methodRepo.findByIdOrThrow(methodId);
    const categories = await this.categoryRepo.listCategoriesForMethod(methodId);
    return categories.map((category) => serializeShippingCategory(category));
  }

  async listMethodsForCategory(categoryId: string) {
    await this.categoryRepo.findByIdOrThrow(categoryId);
    const methods = await this.categoryRepo.listMethodsForCategory(categoryId);
    return methods.map((method) => serializeShippingMethod(method));
  }

  isMethodApplicable(methodId: string, categoryId: string) {
    return this.categoryRepo.isMethodApplicable(methodId, categoryId);
  }

  private async resolveScope(storeId?: string, isGlobal?: boolean | null) {
    const global = isGlobal ?? !storeId;
    if (global) {
      return { isGlobal: true, storeId: null };
    }

    if (!storeId) {
      throw new BusinessException(
        'Las categorías de envío con alcance de tienda requieren storeId',
        'SHIPPING_CATEGORY_SCOPE_INVALID',
      );
    }

    await this.storeFacade.validateStoreAccess(storeId);
    return { isGlobal: false, storeId };
  }
}