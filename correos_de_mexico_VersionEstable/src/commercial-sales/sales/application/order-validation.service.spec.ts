import { Test, TestingModule } from '@nestjs/testing';
import { OrderValidationService } from './order-validation.service';
import { UserFacade } from '../../../core/user/facades/user.facade';
import { StoreFacade } from '../../../core/store/facades/store.facade';
import { ProductFacade } from '../../../catalog/product/facades/product.facade';
import { InventoryFacade } from '../../../inventory/inventory.facade';
import {
  VariantUnavailableException,
  InsufficientInventoryException,
} from '../domain/exceptions/order.exceptions';
import { AppNotFoundException, BusinessException } from '../../../core/shared';

const mockUserFacade = {
  validateUserExists: jest.fn(),
};
const mockStoreFacade = {
  validateStoreAccess: jest.fn(),
  isProductAvailableInStore: jest.fn(),
};
const mockProductFacade = {
  isVariantAvailable: jest.fn(),
  getVariantForSales: jest.fn(),
  getVariantBasePrice: jest.fn(),
  isVariantTrackable: jest.fn(),
};
const mockInventoryFacade = {
  getSalesAvailability: jest.fn(),
};

describe('OrderValidationService', () => {
  let service: OrderValidationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderValidationService,
        { provide: UserFacade, useValue: mockUserFacade },
        { provide: StoreFacade, useValue: mockStoreFacade },
        { provide: ProductFacade, useValue: mockProductFacade },
        { provide: InventoryFacade, useValue: mockInventoryFacade },
      ],
    }).compile();

    service = module.get<OrderValidationService>(OrderValidationService);
    jest.clearAllMocks();
  });

  describe('validateUserExists', () => {
    it('resolves when user exists', async () => {
      mockUserFacade.validateUserExists.mockResolvedValue(true);
      await expect(service.validateUserExists('user-1')).resolves.toBeUndefined();
    });

    it('throws NotFoundException when user missing', async () => {
      mockUserFacade.validateUserExists.mockResolvedValue(false);
      await expect(service.validateUserExists('ghost')).rejects.toThrow(AppNotFoundException);
    });
  });

  describe('validateStoreAccess', () => {
    it('delegates to StoreFacade', async () => {
      mockStoreFacade.validateStoreAccess.mockResolvedValue(undefined);
      await service.validateStoreAccess('store-1');
      expect(mockStoreFacade.validateStoreAccess).toHaveBeenCalledWith('store-1');
    });
  });

  describe('validateAndResolveVariant', () => {
    beforeEach(() => {
      mockProductFacade.isVariantAvailable.mockResolvedValue(true);
      mockProductFacade.getVariantForSales.mockResolvedValue({
        id: 'var-1',
        sku: 'SKU-01',
        tax_category_id: 'tax-cat-1',
        cost_price: '10.00',
        product_id: 'prod-1',
        product: { id: 'prod-1', name: 'Test Product', slug: 'test' },
      });
      mockProductFacade.getVariantBasePrice.mockResolvedValue({
        amount: '99.99',
        currency: 'MXN',
      });
      mockProductFacade.isVariantTrackable.mockResolvedValue(true);
      mockInventoryFacade.getSalesAvailability.mockResolvedValue({
        canSell: true,
        totalAvailable: 10,
      });
    });

    it('returns resolved variant data for a valid request', async () => {
      const result = await service.validateAndResolveVariant({
        variantId: 'var-1',
        quantity: 2,
      });

      expect(result.variantId).toBe('var-1');
      expect(result.basePrice).toBeCloseTo(99.99);
      expect(result.currency).toBe('MXN');
      expect(result.taxCategoryId).toBe('tax-cat-1');
    });

    it('throws VariantUnavailableException when variant not available', async () => {
      mockProductFacade.isVariantAvailable.mockResolvedValue(false);
      await expect(
        service.validateAndResolveVariant({ variantId: 'var-1', quantity: 1 }),
      ).rejects.toThrow(VariantUnavailableException);
    });

    it('throws BusinessException when variant has no price', async () => {
      mockProductFacade.getVariantBasePrice.mockResolvedValue({ amount: null });
      await expect(
        service.validateAndResolveVariant({ variantId: 'var-1', quantity: 1 }),
      ).rejects.toThrow(BusinessException);
    });

    it('throws InsufficientInventoryException when stock unavailable', async () => {
      mockInventoryFacade.getSalesAvailability.mockResolvedValue({
        canSell: false,
        totalAvailable: 0,
      });
      await expect(
        service.validateAndResolveVariant({ variantId: 'var-1', quantity: 5 }),
      ).rejects.toThrow(InsufficientInventoryException);
    });

    it('skips inventory check when checkInventory=false', async () => {
      await service.validateAndResolveVariant({
        variantId: 'var-1',
        quantity: 5,
        checkInventory: false,
      });
      expect(mockInventoryFacade.getSalesAvailability).not.toHaveBeenCalled();
    });

    it('throws BusinessException for quantity <= 0', async () => {
      await expect(
        service.validateAndResolveVariant({ variantId: 'var-1', quantity: 0 }),
      ).rejects.toThrow(BusinessException);
    });
  });
});
