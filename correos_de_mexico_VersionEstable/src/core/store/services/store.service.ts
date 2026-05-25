import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { Store } from '../entities/store.entity';
import { CreateStoreInput } from '../dtos/create-store.input';
import { UpdateStoreInput } from '../dtos/update-store.input';
import { StoreFilterInput } from '../dtos/store-filter.input';
import {
  StoreConfigurationDto,
  StoreProductsDto,
  StorePromotionsDto,
  StorePaymentMethodsDto,
  StoreTaxonomiesDto,
} from '../dtos/store-resources.dto';
import { BusinessException, AppNotFoundException } from '../../shared/exceptions';

@Injectable()
export class StoreService {
  constructor(private prisma: PrismaService) {}

  // crea una tienda nueva con validacion de codigo unico
  async createStore(input: CreateStoreInput): Promise<Store> {
    // comprueba que el codigo de la tienda sea unico
    const existingStore = await this.prisma.store.findUnique({
      where: { code: input.code },
    });

    if (existingStore) {
      throw new BusinessException(
        `La tienda con código '${input.code}' ya existe`,
      );
    }

    const store = await this.prisma.store.create({
      data: {
        name: input.name,
        code: input.code,
        url: input.url,
        description: input.description,
        default_currency: input.default_currency,
        default_locale: input.default_locale,
        customer_support_email: input.customer_support_email,
        new_order_notifications_email: input.new_order_notifications_email,
        mail_from_address: input.mail_from_address,
        default_country_id: input.default_country_id,
        checkout_zone_id: input.checkout_zone_id,
        address: input.address,
        contact_phone: input.contact_phone,
        is_active: true,
      },
    });

    return this.formatStore(store);
  }

  // obtiene una tienda por su id única
  async getStoreById(storeId: string): Promise<Store> {
    const store = await this.prisma.store.findUnique({
      where: { id: storeId },
    });

    if (!store) {
      throw new AppNotFoundException(`Tienda con id '${storeId}' no encontrada`);
    }

    return this.formatStore(store);
  }

  // obtiene una tienda por su código
  async getStoreByCode(code: string): Promise<Store> {
    const store = await this.prisma.store.findUnique({
      where: { code },
    });

    if (!store) {
      throw new AppNotFoundException(`Tienda con código '${code}' no encontrada`);
    }

    return this.formatStore(store);
  }

  // lista todas las tiendas con filtros y paginación
  async listStores(filter?: StoreFilterInput, skip = 0, take = 10): Promise<{ stores: Store[]; total: number }> {
    const where: any = {};

    if (filter?.code) {
      where.code = { contains: filter.code, mode: 'insensitive' };
    }

    if (filter?.name) {
      where.name = { contains: filter.name, mode: 'insensitive' };
    }

    if (filter?.is_active !== undefined) {
      where.is_active = filter.is_active;
    }

    if (filter?.search) {
      where.OR = [
        { code: { contains: filter.search, mode: 'insensitive' } },
        { name: { contains: filter.search, mode: 'insensitive' } },
      ];
    }

    const [stores, total] = await Promise.all([
      this.prisma.store.findMany({
        where,
        skip,
        take,
        orderBy: { created_at: 'desc' },
      }),
      this.prisma.store.count({ where }),
    ]);

    return {
      stores: stores.map(store => this.formatStore(store)),
      total,
    };
  }

  // actualiza los datos de una tienda existente
  async updateStore(storeId: string, input: UpdateStoreInput): Promise<Store> {
    const store = await this.prisma.store.findUnique({
      where: { id: storeId },
    });

    if (!store) {
      throw new AppNotFoundException(`Tienda con id '${storeId}' no encontrada`);
    }

    // si cambia el código, verifica que sea único
    if (input.code && input.code !== store.code) {
      const existingStore = await this.prisma.store.findUnique({
        where: { code: input.code },
      });
      if (existingStore) {
        throw new BusinessException(
          `La tienda con código '${input.code}' ya existe`,
        );
      }
    }

    const updated = await this.prisma.store.update({
      where: { id: storeId },
      data: input
    });

    return this.formatStore(updated);
  }

  // activa o desactiva una tienda
  async toggleStoreStatus(storeId: string, isActive: boolean): Promise<Store> {
    const store = await this.prisma.store.findUnique({
      where: { id: storeId },
    });

    if (!store) {
      throw new AppNotFoundException(`Tienda con id '${storeId}' no encontrada`);
    }

    const updated = await this.prisma.store.update({
      where: { id: storeId },
      data: { is_active: isActive },
    });

    return this.formatStore(updated);
  }

  // resolución de tienda por contexto
  async resolveStore(storeId?: string, code?: string): Promise<Store> {
    if (storeId) {
      return this.getStoreById(storeId);
    }

    if (code) {
      return this.getStoreByCode(code);
    }

    throw new BusinessException('Se debe proporcionar storeId o code');
  }

  // validación de acceso a tienda
  async validateStoreExists(storeId: string): Promise<boolean> {
    const store = await this.prisma.store.findUnique({
      where: { id: storeId },
    });
    return !!store;
  }

  async validateStoreIsActive(storeId: string): Promise<boolean> {
    const store = await this.prisma.store.findUnique({
      where: { id: storeId },
    });
    return store?.is_active ?? false;
  }

  async validateStoreAccess(storeId: string): Promise<void> {
    const exists = await this.validateStoreExists(storeId);
    if (!exists) {
      throw new AppNotFoundException(`Tienda con id '${storeId}' no encontrada`);
    }

    const isActive = await this.validateStoreIsActive(storeId);
    if (!isActive) {
      throw new BusinessException(
        `La tienda con id '${storeId}' no está activa`,
      );
    }
  }

  // recursos habilitados por tienda
  async getEnabledProductsForStore(storeId: string): Promise<StoreProductsDto> {
    await this.validateStoreAccess(storeId);

    const productsStores = await this.prisma.productsStore.findMany({
      where: { store_id: storeId },
    });

    return {
      store_id: storeId,
      product_ids: productsStores
        .map(ps => ps.product_id)
        .filter(Boolean) as string[],
      product_count: productsStores.length,
    };
  }

  async getEnabledPromotionsForStore(
    storeId: string,
  ): Promise<StorePromotionsDto> {
    await this.validateStoreAccess(storeId);

    const promotionsStores = await this.prisma.promotionsStore.findMany({
      where: { store_id: storeId },
    });

    return {
      store_id: storeId,
      promotion_ids: promotionsStores
        .map(ps => ps.promotion_id)
        .filter(Boolean) as string[],
      promotion_count: promotionsStores.length,
    };
  }

  async getEnabledPaymentMethodsForStore(
    storeId: string,
  ): Promise<StorePaymentMethodsDto> {
    await this.validateStoreAccess(storeId);

    const paymentMethods = await this.prisma.paymentMethodsStore.findMany({
      where: { store_id: storeId },
    });

    return {
      store_id: storeId,
      payment_method_ids: paymentMethods
        .map(pm => pm.payment_method_id)
        .filter(Boolean) as string[],
      payment_method_count: paymentMethods.length,
    };
  }

  async getEnabledTaxonomiesForStore(
    storeId: string,
  ): Promise<StoreTaxonomiesDto> {
    await this.validateStoreAccess(storeId);

    const taxonomies = await this.prisma.taxonomy.findMany({
      where: { store_id: storeId },
    });

    return {
      store_id: storeId,
      taxonomy_ids: taxonomies.map(t => t.id),
      taxonomy_count: taxonomies.length,
    };
  }

  /**
   * 6. ASOCIACIÓN DE PRODUCTOS A TIENDA
   */
  async assignProductToStore(
    storeId: string,
    productId: string,
  ): Promise<void> {
    await this.validateStoreAccess(storeId);

    const existingAssignment = await this.prisma.productsStore.findFirst({
      where: { store_id: storeId, product_id: productId },
    });

    if (!existingAssignment) {
      await this.prisma.productsStore.create({
        data: { store_id: storeId, product_id: productId },
      });
    }
  }

  async unassignProductFromStore(
    storeId: string,
    productId: string,
  ): Promise<void> {
    await this.validateStoreAccess(storeId);

    await this.prisma.productsStore.deleteMany({
      where: { store_id: storeId, product_id: productId },
    });
  }

  async isProductAvailableInStore(
    storeId: string,
    productId: string,
  ): Promise<boolean> {
    const assignment = await this.prisma.productsStore.findFirst({
      where: { store_id: storeId, product_id: productId },
    });
    return !!assignment;
  }

  async getStoresForProduct(productId: string): Promise<string[]> {
    const productsStores = await this.prisma.productsStore.findMany({
      where: { product_id: productId },
    });
    return productsStores.map(ps => ps.store_id).filter(Boolean) as string[];
  }

  /**
   * 7. ASOCIACIÓN DE PROMOCIONES A TIENDA
   */
  async assignPromotionToStore(
    storeId: string,
    promotionId: string,
  ): Promise<void> {
    await this.validateStoreAccess(storeId);

    const existingAssignment = await this.prisma.promotionsStore.findFirst({
      where: { store_id: storeId, promotion_id: promotionId },
    });

    if (!existingAssignment) {
      await this.prisma.promotionsStore.create({
        data: { store_id: storeId, promotion_id: promotionId },
      });
    }
  }

  async unassignPromotionFromStore(
    storeId: string,
    promotionId: string,
  ): Promise<void> {
    await this.validateStoreAccess(storeId);

    await this.prisma.promotionsStore.deleteMany({
      where: { store_id: storeId, promotion_id: promotionId },
    });
  }

  async isPromotionAppliedToStore(
    storeId: string,
    promotionId: string,
  ): Promise<boolean> {
    const assignment = await this.prisma.promotionsStore.findFirst({
      where: { store_id: storeId, promotion_id: promotionId },
    });
    return !!assignment;
  }

  /**
   * 8. ASOCIACIÓN DE MÉTODOS DE PAGO A TIENDA
   */
  async assignPaymentMethodToStore(
    storeId: string,
    paymentMethodId: string,
  ): Promise<void> {
    await this.validateStoreAccess(storeId);

    const existingAssignment = await this.prisma.paymentMethodsStore.findFirst({
      where: { store_id: storeId, payment_method_id: paymentMethodId },
    });

    if (!existingAssignment) {
      await this.prisma.paymentMethodsStore.create({
        data: { store_id: storeId, payment_method_id: paymentMethodId },
      });
    }
  }

  async unassignPaymentMethodFromStore(
    storeId: string,
    paymentMethodId: string,
  ): Promise<void> {
    await this.validateStoreAccess(storeId);

    await this.prisma.paymentMethodsStore.deleteMany({
      where: { store_id: storeId, payment_method_id: paymentMethodId },
    });
  }

  async isPaymentMethodEnabledInStore(
    storeId: string,
    paymentMethodId: string,
  ): Promise<boolean> {
    const assignment = await this.prisma.paymentMethodsStore.findFirst({
      where: { store_id: storeId, payment_method_id: paymentMethodId },
    });
    return !!assignment;
  }

  /**
   * 9. ASOCIACIÓN DE TAXONOMÍAS A TIENDA
   */
  async getTaxonomiesForStore(storeId: string): Promise<string[]> {
    await this.validateStoreAccess(storeId);

    const taxonomies = await this.prisma.taxonomy.findMany({
      where: { store_id: storeId },
      select: { id: true },
    });

    return taxonomies.map(t => t.id);
  }

  async isTaxonomyAssociatedWithStore(
    storeId: string,
    taxonomyId: string,
  ): Promise<boolean> {
    const taxonomy = await this.prisma.taxonomy.findFirst({
      where: { id: taxonomyId, store_id: storeId },
    });
    return !!taxonomy;
  }

  /**
   * 10. CONFIGURACIÓN DE ZONA DE CHECKOUT
   */
  async getCheckoutZoneForStore(storeId: string): Promise<string | null> {
    const store = await this.prisma.store.findUnique({
      where: { id: storeId },
      select: { checkout_zone_id: true },
    });

    if (!store) {
      throw new AppNotFoundException(`Tienda con id '${storeId}' no encontrada`);
    }

    return store.checkout_zone_id;
  }

  async setCheckoutZoneForStore(
    storeId: string,
    checkoutZoneId: string,
  ): Promise<void> {
    await this.validateStoreAccess(storeId);

    await this.prisma.store.update({
      where: { id: storeId },
      data: { checkout_zone_id: checkoutZoneId },
    });
  }

  /**
   * 11. VALIDACIÓN DE PAÍS Y CONFIGURACIÓN REGIONAL
   */
  async getStoreRegionalConfiguration(
    storeId: string,
  ): Promise<StoreConfigurationDto> {
    const store = await this.prisma.store.findUnique({
      where: { id: storeId },
    });

    if (!store) {
      throw new AppNotFoundException(`Tienda con id '${storeId}' no encontrada`);
    }

    return {
      store_id: store.id,
      name: store.name,
      code: store.code,
      is_active: store.is_active,
      default_currency: store.default_currency,
      default_locale: store.default_locale,
      default_country_id: store.default_country_id,
      checkout_zone_id: store.checkout_zone_id,
      customer_support_email: store.customer_support_email,
      created_at: store.created_at,
      updated_at: store.updated_at,
    };
  }

  /**
   * Helper: Format store for response
   */
  private formatStore(store: any): Store {
    return {
      id: store.id,
      name: store.name,
      code: store.code,
      url: store.url,
      description: store.description,
      is_active: store.is_active,
      default_currency: store.default_currency,
      default_locale: store.default_locale,
      customer_support_email: store.customer_support_email,
      new_order_notifications_email: store.new_order_notifications_email,
      mail_from_address: store.mail_from_address,
      default_country_id: store.default_country_id,
      checkout_zone_id: store.checkout_zone_id,
      address: store.address,
      contact_phone: store.contact_phone,
      meta_description: store.meta_description,
      meta_keywords: store.meta_keywords,
      seo_title: store.seo_title,
      seo_robots: store.seo_robots,
      facebook: store.facebook,
      twitter: store.twitter,
      instagram: store.instagram,
      supported_currencies: store.supported_currencies,
      supported_locales: store.supported_locales,
      default: store.default,
      created_at: store.created_at,
      updated_at: store.updated_at,
    };
  }
}
