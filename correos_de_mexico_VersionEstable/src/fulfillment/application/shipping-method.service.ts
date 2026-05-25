import { Injectable } from '@nestjs/common';
import { BusinessException } from '../../core/shared';
import { StoreFacade } from '../../core/store/facades/store.facade';
import { SalesFacade } from '../../commercial-sales/sales/facades/sales.facade';
import { TaxFacade } from '../../location/tax/facades/tax.facade';
import { ShippingMethodAvailabilityContext } from '../domain/contracts/fulfillment.contracts';
import { ShippingMethodAvailabilityException } from '../domain/exceptions/fulfillment.exceptions';
import { ShippingMethodRepository } from '../infrastructure/repositories/shipping-method.repository';
import { serializeShippingMethod } from './fulfillment.mapper';

export interface CreateShippingMethodInput {
  name: string;
  code: string;
  displayOn?: string;
  trackingUrl?: string;
  adminName?: string;
  taxCategoryId?: string;
  active?: boolean;
  isGlobal?: boolean;
  configuration?: string;
  storeId?: string;
}

export interface UpdateShippingMethodInput {
  methodId: string;
  name?: string;
  code?: string;
  displayOn?: string;
  trackingUrl?: string;
  adminName?: string;
  taxCategoryId?: string;
  active?: boolean;
  isGlobal?: boolean;
  configuration?: string;
  storeId?: string | null;
}

@Injectable()
export class ShippingMethodService {
  constructor(
    private readonly methodRepo: ShippingMethodRepository,
    private readonly storeFacade: StoreFacade,
    private readonly salesFacade: SalesFacade,
    private readonly taxFacade: TaxFacade,
  ) {}

  async createShippingMethod(input: CreateShippingMethodInput) {
    const scope = await this.resolveScope(input.storeId, input.isGlobal);
    if (input.taxCategoryId) {
      await this.taxFacade.validateCategoryExists(input.taxCategoryId);
    }

    const method = await this.methodRepo.create({
      name: input.name,
      code: input.code,
      display_on: input.displayOn ?? null,
      tracking_url: input.trackingUrl ?? null,
      admin_name: input.adminName ?? null,
      tax_category_id: input.taxCategoryId ?? null,
      active: input.active ?? true,
      is_global: scope.isGlobal,
      store_id: scope.storeId,
      configuration: this.parseConfiguration(input.configuration),
    });

    return serializeShippingMethod(method);
  }

  async getShippingMethodById(methodId: string) {
    const method = await this.methodRepo.findByIdOrThrow(methodId);
    return serializeShippingMethod(method);
  }

  async listShippingMethods(includeInactive = false, storeId?: string) {
    const methods = await this.methodRepo.findMany({ includeInactive, storeId });
    return methods.map((method) => serializeShippingMethod(method));
  }

  async updateShippingMethod(input: UpdateShippingMethodInput) {
    const existing = await this.methodRepo.findByIdOrThrow(input.methodId);
    const existingMethod = existing as typeof existing & {
      store_id?: string | null;
      is_global?: boolean;
    };
    const scope = await this.resolveScope(
      input.storeId === undefined ? existingMethod.store_id ?? undefined : input.storeId ?? undefined,
      input.isGlobal ?? existingMethod.is_global ?? true,
    );

    if (input.taxCategoryId) {
      await this.taxFacade.validateCategoryExists(input.taxCategoryId);
    }

    const updated = await this.methodRepo.update(input.methodId, {
      ...(input.name !== undefined ? { name: input.name } : {}),
      ...(input.code !== undefined ? { code: input.code } : {}),
      ...(input.displayOn !== undefined ? { display_on: input.displayOn } : {}),
      ...(input.trackingUrl !== undefined ? { tracking_url: input.trackingUrl } : {}),
      ...(input.adminName !== undefined ? { admin_name: input.adminName } : {}),
      ...(input.taxCategoryId !== undefined ? { tax_category_id: input.taxCategoryId ?? null } : {}),
      ...(input.active !== undefined ? { active: input.active } : {}),
      is_global: scope.isGlobal,
      store_id: scope.storeId,
      ...(input.configuration !== undefined
        ? { configuration: this.parseConfiguration(input.configuration) }
        : {}),
    });

    return serializeShippingMethod(updated);
  }

  async activateShippingMethod(methodId: string) {
    const method = await this.methodRepo.setActive(methodId, true);
    return serializeShippingMethod(method);
  }

  async deactivateShippingMethod(methodId: string) {
    const method = await this.methodRepo.setActive(methodId, false);
    return serializeShippingMethod(method);
  }

  async listAvailableMethods(context: ShippingMethodAvailabilityContext) {
    const storeId = await this.resolveContextStoreId(context);
    const methods = await this.methodRepo.findMany({
      includeInactive: context.includeInactive ?? false,
      storeId: storeId ?? undefined,
      shippingCategoryId: context.shippingCategoryId,
    });

    return methods.map((method) => serializeShippingMethod(method));
  }

  async validateMethodAvailable(methodId: string, context: ShippingMethodAvailabilityContext) {
    const methods = await this.listAvailableMethods(context);
    const found = methods.find((method) => method.id === methodId);
    if (!found) {
      throw new ShippingMethodAvailabilityException(
        methodId,
        context.orderId ? `order ${context.orderId}` : `store ${context.storeId ?? 'global'}`,
      );
    }

    return true;
  }

  private async resolveContextStoreId(context: ShippingMethodAvailabilityContext) {
    if (context.storeId) {
      await this.storeFacade.validateStoreAccess(context.storeId);
      return context.storeId;
    }

    if (context.orderId) {
      const orderContext = await this.salesFacade.getFulfillmentContext(context.orderId);
      if (orderContext.storeId) {
        await this.storeFacade.validateStoreAccess(orderContext.storeId);
      }
      return orderContext.storeId;
    }

    return null;
  }

  private async resolveScope(storeId?: string, isGlobal?: boolean | null) {
    const global = isGlobal ?? !storeId;
    if (global) {
      return { isGlobal: true, storeId: null };
    }

    if (!storeId) {
      throw new BusinessException(
        'Los métodos de envío con alcance de tienda requieren storeId',
        'SHIPPING_METHOD_SCOPE_INVALID',
      );
    }

    await this.storeFacade.validateStoreAccess(storeId);
    return { isGlobal: false, storeId };
  }

  private parseConfiguration(configuration?: string) {
    if (!configuration) {
      return null;
    }

    try {
      return JSON.parse(configuration) as Record<string, unknown>;
    } catch {
      throw new BusinessException(
        'La configuración del método de envío debe ser JSON válido',
        'SHIPPING_METHOD_CONFIGURATION_INVALID',
      );
    }
  }
}