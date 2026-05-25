import { Test, TestingModule } from '@nestjs/testing';
import { ProductResolver } from './product.resolver';
import { ProductService } from './product.service';
import { VariantService } from './variant.service';
import { PriceService } from './price.service';

// mock del módulo ESM que Jest no puede parsear directamente
jest.mock('@thallesp/nestjs-better-auth', () => ({
  AllowAnonymous: () => () => {},
}));

const mockProduct = { id: 'prod-1', name: 'Test Product', slug: 'test' };
const mockVariant = { id: 'var-1', sku: 'SKU-1' };
const mockPrice = { id: 'price-1', amount: 100 };
const mockConnection = { data: [mockProduct], total: 1, page: 1, limit: 10, pages: 1 };

describe('ProductResolver', () => {
  let resolver: ProductResolver;
  let productService: Record<string, jest.Mock>;
  let variantService: Record<string, jest.Mock>;
  let priceService: Record<string, jest.Mock>;

  beforeEach(async () => {
    productService = {
      create: jest.fn().mockResolvedValue(mockProduct),
      findAll: jest.fn().mockResolvedValue(mockConnection),
      findOne: jest.fn().mockResolvedValue(mockProduct),
      findBySlug: jest.fn().mockResolvedValue(mockProduct),
      update: jest.fn().mockResolvedValue(mockProduct),
      remove: jest.fn().mockResolvedValue(true),
      isProductAvailable: jest.fn().mockResolvedValue(true),
      getProductsByStore: jest.fn().mockResolvedValue([mockProduct]),
      addProductToStore: jest.fn().mockResolvedValue({ id: 'rel-1' }),
      removeProductFromStore: jest.fn().mockResolvedValue(true),
    };

    variantService = {
      create: jest.fn().mockResolvedValue(mockVariant),
      findById: jest.fn().mockResolvedValue(mockVariant),
      findByProductId: jest.fn().mockResolvedValue([mockVariant]),
      findBySku: jest.fn().mockResolvedValue(mockVariant),
      update: jest.fn().mockResolvedValue(mockVariant),
      remove: jest.fn().mockResolvedValue(true),
      isVariantAvailable: jest.fn().mockResolvedValue(true),
    };

    priceService = {
      create: jest.fn().mockResolvedValue(mockPrice),
      findByVariantId: jest.fn().mockResolvedValue([mockPrice]),
      update: jest.fn().mockResolvedValue(mockPrice),
      remove: jest.fn().mockResolvedValue(true),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductResolver,
        { provide: ProductService, useValue: productService },
        { provide: VariantService, useValue: variantService },
        { provide: PriceService, useValue: priceService },
      ],
    }).compile();

    resolver = module.get<ProductResolver>(ProductResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  // ─── Product queries ─────────────────────────────────────

  describe('products (findAll)', () => {
    it('should return product connection', async () => {
      const result = await resolver.findAll({ page: 1, limit: 10 });
      expect(result).toEqual(mockConnection);
      expect(productService.findAll).toHaveBeenCalled();
    });

    it('should use empty object when no filter provided', async () => {
      await resolver.findAll();
      expect(productService.findAll).toHaveBeenCalledWith({});
    });
  });

  describe('product (findOne)', () => {
    it('should return product by id', async () => {
      const result = await resolver.findOne('prod-1');
      expect(result).toEqual(mockProduct);
    });
  });

  describe('productBySlug', () => {
    it('should return product by slug', async () => {
      const result = await resolver.findBySlug('test');
      expect(productService.findBySlug).toHaveBeenCalledWith('test');
      expect(result).toEqual(mockProduct);
    });
  });

  describe('isProductAvailable', () => {
    it('should return boolean availability', async () => {
      const result = await resolver.isProductAvailable('prod-1');
      expect(result).toBe(true);
    });
  });

  describe('productsByStore', () => {
    it('should return products for store', async () => {
      const result = await resolver.findProductsByStore('store-1');
      expect(productService.getProductsByStore).toHaveBeenCalledWith('store-1');
      expect(result).toEqual([mockProduct]);
    });
  });

  // ─── Product mutations ───────────────────────────────────

  describe('createProduct', () => {
    it('should call productService.create', async () => {
      const input = { name: 'New Product' };
      const result = await resolver.createProduct(input as any);
      expect(productService.create).toHaveBeenCalledWith(input);
      expect(result).toEqual(mockProduct);
    });
  });

  describe('updateProduct', () => {
    it('should call productService.update', async () => {
      const input = { id: 'prod-1', name: 'Updated' };
      const result = await resolver.updateProduct(input as any);
      expect(productService.update).toHaveBeenCalledWith('prod-1', input);
      expect(result).toEqual(mockProduct);
    });
  });

  describe('removeProduct', () => {
    it('should call productService.remove', async () => {
      const result = await resolver.removeProduct('prod-1');
      expect(productService.remove).toHaveBeenCalledWith('prod-1');
      expect(result).toBe(true);
    });
  });

  describe('addProductToStore', () => {
    it('should return true after adding', async () => {
      const result = await resolver.addProductToStore('prod-1', 'store-1');
      expect(productService.addProductToStore).toHaveBeenCalledWith('prod-1', 'store-1');
      expect(result).toBe(true);
    });
  });

  describe('removeProductFromStore', () => {
    it('should call productService.removeProductFromStore', async () => {
      const result = await resolver.removeProductFromStore('prod-1', 'store-1');
      expect(result).toBe(true);
    });
  });

  // ─── Variant queries ─────────────────────────────────────

  describe('variant (findVariant)', () => {
    it('should return variant by id', async () => {
      const result = await resolver.findVariant('var-1');
      expect(variantService.findById).toHaveBeenCalledWith('var-1');
      expect(result).toEqual(mockVariant);
    });
  });

  describe('variantsByProduct', () => {
    it('should return variants for product', async () => {
      const result = await resolver.findVariantsByProduct('prod-1');
      expect(result).toEqual([mockVariant]);
    });
  });

  describe('variantBySku', () => {
    it('should return variant by sku', async () => {
      const result = await resolver.findVariantBySku('SKU-1');
      expect(variantService.findBySku).toHaveBeenCalledWith('SKU-1');
      expect(result).toEqual(mockVariant);
    });
  });

  describe('isVariantAvailable', () => {
    it('should return boolean', async () => {
      const result = await resolver.isVariantAvailable('var-1');
      expect(result).toBe(true);
    });
  });

  // ─── Variant mutations ───────────────────────────────────

  describe('createVariant', () => {
    it('should call variantService.create', async () => {
      const input = { product_id: 'prod-1', sku: 'SKU-NEW' };
      const result = await resolver.createVariant(input as any);
      expect(variantService.create).toHaveBeenCalledWith(input);
      expect(result).toEqual(mockVariant);
    });
  });

  describe('updateVariant', () => {
    it('should call variantService.update', async () => {
      const input = { id: 'var-1', weight: 5 };
      const result = await resolver.updateVariant(input as any);
      expect(variantService.update).toHaveBeenCalledWith('var-1', input);
      expect(result).toEqual(mockVariant);
    });
  });

  describe('removeVariant', () => {
    it('should call variantService.remove', async () => {
      const result = await resolver.removeVariant('var-1');
      expect(result).toBe(true);
    });
  });

  // ─── Price queries ───────────────────────────────────────

  describe('pricesByVariant', () => {
    it('should return prices for variant', async () => {
      const result = await resolver.findPricesByVariant('var-1');
      expect(priceService.findByVariantId).toHaveBeenCalledWith('var-1');
      expect(result).toEqual([mockPrice]);
    });
  });

  // ─── Price mutations ─────────────────────────────────────

  describe('createPrice', () => {
    it('should call priceService.create', async () => {
      const input = { variant_id: 'var-1', amount: 100, currency: 'MXN' };
      const result = await resolver.createPrice(input as any);
      expect(priceService.create).toHaveBeenCalledWith(input);
      expect(result).toEqual(mockPrice);
    });
  });

  describe('updatePrice', () => {
    it('should call priceService.update', async () => {
      const input = { id: 'price-1', amount: 200 };
      const result = await resolver.updatePrice(input as any);
      expect(priceService.update).toHaveBeenCalledWith('price-1', input);
      expect(result).toEqual(mockPrice);
    });
  });

  describe('removePrice', () => {
    it('should call priceService.remove', async () => {
      const result = await resolver.removePrice('price-1');
      expect(result).toBe(true);
    });
  });
});
