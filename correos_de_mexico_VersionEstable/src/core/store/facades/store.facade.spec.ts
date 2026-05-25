import { StoreFacade } from './store.facade';

describe('StoreFacade', () => {
  let facade: StoreFacade;
  let storeService: {
    getStoreById: jest.Mock;
    getStoreByCode: jest.Mock;
    resolveStore: jest.Mock;
    validateStoreAccess: jest.Mock;
    validateStoreExists: jest.Mock;
    validateStoreIsActive: jest.Mock;
    getEnabledProductsForStore: jest.Mock;
    isProductAvailableInStore: jest.Mock;
    getStoresForProduct: jest.Mock;
    getEnabledPaymentMethodsForStore: jest.Mock;
    isPaymentMethodEnabledInStore: jest.Mock;
    getEnabledPromotionsForStore: jest.Mock;
    isPromotionAppliedToStore: jest.Mock;
    getTaxonomiesForStore: jest.Mock;
    getCheckoutZoneForStore: jest.Mock;
    getStoreRegionalConfiguration: jest.Mock;
  };

  beforeEach(() => {
    storeService = {
      getStoreById: jest.fn(),
      getStoreByCode: jest.fn(),
      resolveStore: jest.fn(),
      validateStoreAccess: jest.fn(),
      validateStoreExists: jest.fn(),
      validateStoreIsActive: jest.fn(),
      getEnabledProductsForStore: jest.fn(),
      isProductAvailableInStore: jest.fn(),
      getStoresForProduct: jest.fn(),
      getEnabledPaymentMethodsForStore: jest.fn(),
      isPaymentMethodEnabledInStore: jest.fn(),
      getEnabledPromotionsForStore: jest.fn(),
      isPromotionAppliedToStore: jest.fn(),
      getTaxonomiesForStore: jest.fn(),
      getCheckoutZoneForStore: jest.fn(),
      getStoreRegionalConfiguration: jest.fn(),
    };

    facade = new StoreFacade(storeService as any);
  });

  it('returns only product ids from the products dto', async () => {
    storeService.getEnabledProductsForStore.mockResolvedValue({
      store_id: 'store-1',
      product_ids: ['product-1', 'product-2'],
      product_count: 2,
    });

    await expect(facade.getProductsForStore('store-1')).resolves.toEqual([
      'product-1',
      'product-2',
    ]);
    expect(storeService.getEnabledProductsForStore).toHaveBeenCalledWith('store-1');
  });

  it('returns only payment method ids from the payment-method dto', async () => {
    storeService.getEnabledPaymentMethodsForStore.mockResolvedValue({
      store_id: 'store-1',
      payment_method_ids: ['pm-1'],
      payment_method_count: 1,
    });

    await expect(facade.getPaymentMethodsForStore('store-1')).resolves.toEqual([
      'pm-1',
    ]);
    expect(storeService.getEnabledPaymentMethodsForStore).toHaveBeenCalledWith('store-1');
  });

  it('delegates validateStoreAccess unchanged', async () => {
    storeService.validateStoreAccess.mockResolvedValue(undefined);

    await expect(facade.validateStoreAccess('store-1')).resolves.toBeUndefined();
    expect(storeService.validateStoreAccess).toHaveBeenCalledWith('store-1');
  });
});