import { Test, TestingModule } from '@nestjs/testing';
import { ProductFacade } from './product.facade';
import { ProductService } from '../product.service';
import { VariantService } from '../variant.service';
import { PriceService } from '../price.service';

const mockProduct = { id: 'prod-1', name: 'Test Product' };
const mockVariant = { id: 'var-1', sku: 'SKU-1' };
const mockPrice = { id: 'price-1', amount: 100 };

describe('ProductFacade', () => {
  let facade: ProductFacade;
  let productService: Record<string, jest.Mock>;
  let variantService: Record<string, jest.Mock>;
  let priceService: Record<string, jest.Mock>;

  beforeEach(async () => {
    productService = {
      findOne: jest.fn().mockResolvedValue(mockProduct),
      findBySlug: jest.fn().mockResolvedValue(mockProduct),
      validateProductExists: jest.fn().mockResolvedValue(true),
      isProductAvailable: jest.fn().mockResolvedValue(true),
      getStoresForProduct: jest.fn().mockResolvedValue(['store-1']),
      isProductInStore: jest.fn().mockResolvedValue(true),
      getProductsByStore: jest.fn().mockResolvedValue([mockProduct]),
    };

    variantService = {
      findById: jest.fn().mockResolvedValue(mockVariant),
      findBySku: jest.fn().mockResolvedValue(mockVariant),
      findByProductId: jest.fn().mockResolvedValue([mockVariant]),
      validateVariantExists: jest.fn().mockResolvedValue(true),
      isVariantAvailable: jest.fn().mockResolvedValue(true),
      isVariantTrackable: jest.fn().mockResolvedValue(true),
      getVariantForSales: jest.fn().mockResolvedValue(mockVariant),
      getVariantForInventory: jest.fn().mockResolvedValue(mockVariant),
      resolveProductForVariant: jest.fn().mockResolvedValue('prod-1'),
    };

    priceService = {
      getBasePrice: jest.fn().mockResolvedValue(mockPrice),
      findByVariantId: jest.fn().mockResolvedValue([mockPrice]),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductFacade,
        { provide: ProductService, useValue: productService },
        { provide: VariantService, useValue: variantService },
        { provide: PriceService, useValue: priceService },
      ],
    }).compile();

    facade = module.get<ProductFacade>(ProductFacade);
  });

  it('should be defined', () => {
    expect(facade).toBeDefined();
  });

  // ─── Product delegations ─────────────────────────────────

  describe('product methods', () => {
    it('getProductById delegates to productService.findOne', async () => {
      const result = await facade.getProductById('prod-1');
      expect(productService.findOne).toHaveBeenCalledWith('prod-1');
      expect(result).toEqual(mockProduct);
    });

    it('getProductBySlug delegates to productService.findBySlug', async () => {
      await facade.getProductBySlug('test-slug');
      expect(productService.findBySlug).toHaveBeenCalledWith('test-slug');
    });

    it('validateProductExists delegates to productService', async () => {
      const result = await facade.validateProductExists('prod-1');
      expect(result).toBe(true);
    });

    it('isProductAvailable delegates to productService', async () => {
      const result = await facade.isProductAvailable('prod-1');
      expect(result).toBe(true);
    });
  });

  // ─── Variant delegations ─────────────────────────────────

  describe('variant methods', () => {
    it('getVariantById delegates to variantService.findById', async () => {
      const result = await facade.getVariantById('var-1');
      expect(variantService.findById).toHaveBeenCalledWith('var-1');
      expect(result).toEqual(mockVariant);
    });

    it('getVariantBySku delegates to variantService.findBySku', async () => {
      await facade.getVariantBySku('SKU-1');
      expect(variantService.findBySku).toHaveBeenCalledWith('SKU-1');
    });

    it('getVariantsByProduct delegates to variantService.findByProductId', async () => {
      const result = await facade.getVariantsByProduct('prod-1');
      expect(result).toEqual([mockVariant]);
    });

    it('validateVariantExists delegates to variantService', async () => {
      const result = await facade.validateVariantExists('var-1');
      expect(result).toBe(true);
    });

    it('isVariantAvailable delegates to variantService', async () => {
      const result = await facade.isVariantAvailable('var-1');
      expect(result).toBe(true);
    });

    it('isVariantTrackable delegates to variantService', async () => {
      const result = await facade.isVariantTrackable('var-1');
      expect(result).toBe(true);
    });
  });

  // ─── Sales delegations ───────────────────────────────────

  describe('sales methods', () => {
    it('getVariantForSales delegates to variantService', async () => {
      const result = await facade.getVariantForSales('var-1');
      expect(variantService.getVariantForSales).toHaveBeenCalledWith('var-1');
      expect(result).toEqual(mockVariant);
    });

    it('getVariantBasePrice delegates to priceService.getBasePrice', async () => {
      const result = await facade.getVariantBasePrice('var-1');
      expect(priceService.getBasePrice).toHaveBeenCalledWith('var-1');
      expect(result).toEqual(mockPrice);
    });
  });

  // ─── Inventory delegations ───────────────────────────────

  describe('inventory methods', () => {
    it('getVariantForInventory delegates to variantService', async () => {
      await facade.getVariantForInventory('var-1');
      expect(variantService.getVariantForInventory).toHaveBeenCalledWith('var-1');
    });

    it('resolveProductForVariant delegates to variantService', async () => {
      const result = await facade.resolveProductForVariant('var-1');
      expect(result).toBe('prod-1');
    });
  });

  // ─── Price delegations ───────────────────────────────────

  describe('price methods', () => {
    it('getBasePrice delegates to priceService', async () => {
      const result = await facade.getBasePrice('var-1');
      expect(priceService.getBasePrice).toHaveBeenCalledWith('var-1');
      expect(result).toEqual(mockPrice);
    });

    it('getPricesForVariant delegates to priceService.findByVariantId', async () => {
      const result = await facade.getPricesForVariant('var-1');
      expect(priceService.findByVariantId).toHaveBeenCalledWith('var-1');
      expect(result).toEqual([mockPrice]);
    });
  });

  // ─── Store delegations ───────────────────────────────────

  describe('store methods', () => {
    it('getStoresForProduct delegates to productService', async () => {
      const result = await facade.getStoresForProduct('prod-1');
      expect(result).toEqual(['store-1']);
    });

    it('isProductInStore delegates to productService', async () => {
      const result = await facade.isProductInStore('prod-1', 'store-1');
      expect(productService.isProductInStore).toHaveBeenCalledWith('prod-1', 'store-1');
      expect(result).toBe(true);
    });

    it('getProductsByStore delegates to productService', async () => {
      const result = await facade.getProductsByStore('store-1');
      expect(productService.getProductsByStore).toHaveBeenCalledWith('store-1');
      expect(result).toEqual([mockProduct]);
    });
  });
});
