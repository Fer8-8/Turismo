import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { Store } from '../entities/store.entity';
import { StoreService } from '../services/store.service';
import { CreateStoreInput } from '../dtos/create-store.input';
import { UpdateStoreInput } from '../dtos/update-store.input';
import { StoreFilterInput } from '../dtos/store-filter.input';
import { SkipStoreContext } from '../../shared/decorators';
import {
  StoreConfigurationDto,
  StoreProductsDto,
  StorePromotionsDto,
  StorePaymentMethodsDto,
  StoreTaxonomiesDto,
} from '../dtos/store-resources.dto';
import { Paginated } from '../../shared/dtos';

const PaginatedStore = Paginated(Store);

@Resolver(() => Store)
export class StoreResolver {
  constructor(private storeService: StoreService) {}

  // obtener tienda por id
  @Query(() => Store, { name: 'store' })
  @SkipStoreContext()
  async getStore(@Args('id', { type: () => ID }) id: string): Promise<Store> {
    return this.storeService.getStoreById(id);
  }

  // obtener tienda por código
  @Query(() => Store, { name: 'storeByCode' })
  @SkipStoreContext()
  async getStoreByCode(@Args('code', { type: () => String }) code: string): Promise<Store> {
    return this.storeService.getStoreByCode(code);
  }

  // listar tiendas con paginación
  @Query(() => PaginatedStore, { name: 'stores' })
  @SkipStoreContext()
  async listStores(
    @Args('filter', { type: () => StoreFilterInput, nullable: true })
    filter?: StoreFilterInput,
    @Args('skip', { type: () => Number, nullable: true, defaultValue: 0 })
    skip: number = 0,
    @Args('take', { type: () => Number, nullable: true, defaultValue: 10 })
    take: number = 10,
  ) {
    const result = await this.storeService.listStores(filter, skip, take);
    return {
      items: result.stores,
      totalCount: result.total,
      hasMore: skip + take < result.total,
    };
  }

  // crear nueva tienda
  @Mutation(() => Store, { name: 'createStore' })
  @SkipStoreContext()
  async createStore(@Args('input') input: CreateStoreInput): Promise<Store> {
    return this.storeService.createStore(input);
  }

  // actualizar tienda
  @Mutation(() => Store, { name: 'updateStore' })
  @SkipStoreContext()
  async updateStore(
    @Args('input') input: UpdateStoreInput,
  ): Promise<Store> {
    return this.storeService.updateStore(input.id, input);
  }

  // activar tienda
  @Mutation(() => Store, { name: 'activateStore' })
  @SkipStoreContext()
  async activateStore(@Args('id', { type: () => ID }) id: string): Promise<Store> {
    return this.storeService.toggleStoreStatus(id, true);
  }

  // desactivar tienda
  @Mutation(() => Store, { name: 'deactivateStore' })
  @SkipStoreContext()
  async deactivateStore(@Args('id', { type: () => ID }) id: string): Promise<Store> {
    return this.storeService.toggleStoreStatus(id, false);
  }

  // productos habilitados en tienda
  @Query(() => StoreProductsDto, { name: 'storeProducts' })
  @SkipStoreContext()
  async getStoreProducts(
    @Args('storeId', { type: () => ID }) storeId: string,
  ): Promise<StoreProductsDto> {
    return this.storeService.getEnabledProductsForStore(storeId);
  }

  // asignar producto a tienda
  @Mutation(() => Boolean, { name: 'assignProductToStore' })
  @SkipStoreContext()
  async assignProductToStore(
    @Args('storeId', { type: () => ID }) storeId: string,
    @Args('productId', { type: () => ID }) productId: string,
  ): Promise<boolean> {
    await this.storeService.assignProductToStore(storeId, productId);
    return true;
  }

  // desasignar producto de tienda
  @Mutation(() => Boolean, { name: 'unassignProductFromStore' })
  @SkipStoreContext()
  async unassignProductFromStore(
    @Args('storeId', { type: () => ID }) storeId: string,
    @Args('productId', { type: () => ID }) productId: string,
  ): Promise<boolean> {
    await this.storeService.unassignProductFromStore(storeId, productId);
    return true;
  }

  // promociones habilitadas en tienda
  @Query(() => StorePromotionsDto, { name: 'storePromotions' })
  @SkipStoreContext()
  async getStorePromotions(
    @Args('storeId', { type: () => ID }) storeId: string,
  ): Promise<StorePromotionsDto> {
    return this.storeService.getEnabledPromotionsForStore(storeId);
  }

  // asignar promoción a tienda
  @Mutation(() => Boolean, { name: 'assignPromotionToStore' })
  @SkipStoreContext()
  async assignPromotionToStore(
    @Args('storeId', { type: () => ID }) storeId: string,
    @Args('promotionId', { type: () => ID }) promotionId: string,
  ): Promise<boolean> {
    await this.storeService.assignPromotionToStore(storeId, promotionId);
    return true;
  }

  /**
   * Mutation: Desasignar promoción de tienda
   */
  @Mutation(() => Boolean, { name: 'unassignPromotionFromStore' })
  @SkipStoreContext()
  async unassignPromotionFromStore(
    @Args('storeId', { type: () => ID }) storeId: string,
    @Args('promotionId', { type: () => ID }) promotionId: string,
  ): Promise<boolean> {
    await this.storeService.unassignPromotionFromStore(storeId, promotionId);
    return true;
  }

  /**
   * Query: Métodos de pago habilitados en tienda
   */
  @Query(() => StorePaymentMethodsDto, { name: 'storePaymentMethods' })
  @SkipStoreContext()
  async getStorePaymentMethods(
    @Args('storeId', { type: () => ID }) storeId: string,
  ): Promise<StorePaymentMethodsDto> {
    return this.storeService.getEnabledPaymentMethodsForStore(storeId);
  }

  /**
   * Mutation: Asignar método de pago a tienda
   */
  @Mutation(() => Boolean, { name: 'assignPaymentMethodToStore' })
  @SkipStoreContext()
  async assignPaymentMethodToStore(
    @Args('storeId', { type: () => ID }) storeId: string,
    @Args('paymentMethodId', { type: () => ID }) paymentMethodId: string,
  ): Promise<boolean> {
    await this.storeService.assignPaymentMethodToStore(storeId, paymentMethodId);
    return true;
  }

  /**
   * Mutation: Desasignar método de pago de tienda
   */
  @Mutation(() => Boolean, { name: 'unassignPaymentMethodFromStore' })
  @SkipStoreContext()
  async unassignPaymentMethodFromStore(
    @Args('storeId', { type: () => ID }) storeId: string,
    @Args('paymentMethodId', { type: () => ID }) paymentMethodId: string,
  ): Promise<boolean> {
    await this.storeService.unassignPaymentMethodFromStore(storeId, paymentMethodId);
    return true;
  }

  /**
   * Query: Taxonomías de tienda
   */
  @Query(() => StoreTaxonomiesDto, { name: 'storeTaxonomies' })
  @SkipStoreContext()
  async getStoreTaxonomies(
    @Args('storeId', { type: () => ID }) storeId: string,
  ): Promise<StoreTaxonomiesDto> {
    return this.storeService.getEnabledTaxonomiesForStore(storeId);
  }

  /**
   * Query: Configuración regional de tienda
   */
  @Query(() => StoreConfigurationDto, { name: 'storeConfiguration' })
  @SkipStoreContext()
  async getStoreConfiguration(
    @Args('storeId', { type: () => ID }) storeId: string,
  ): Promise<StoreConfigurationDto> {
    return this.storeService.getStoreRegionalConfiguration(storeId);
  }

  /**
   * Query: Zona de checkout de tienda
   */
  @Query(() => String, { name: 'storeCheckoutZone', nullable: true })
  @SkipStoreContext()
  async getStoreCheckoutZone(
    @Args('storeId', { type: () => ID }) storeId: string,
  ): Promise<string | null> {
    return this.storeService.getCheckoutZoneForStore(storeId);
  }

  /**
   * Mutation: Establecer zona de checkout
   */
  @Mutation(() => Boolean, { name: 'setStoreCheckoutZone' })
  @SkipStoreContext()
  async setStoreCheckoutZone(
    @Args('storeId', { type: () => ID }) storeId: string,
    @Args('checkoutZoneId', { type: () => ID }) checkoutZoneId: string,
  ): Promise<boolean> {
    await this.storeService.setCheckoutZoneForStore(storeId, checkoutZoneId);
    return true;
  }
}
