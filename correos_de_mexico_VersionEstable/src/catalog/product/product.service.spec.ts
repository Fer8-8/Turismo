import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from './product.service';
import { PrismaService } from '../../prisma/prisma.service';
import { AppNotFoundException, AppConflictException } from '../../core/shared';

const NOW = new Date();
const PAST = new Date(Date.now() - 86400000);
const FUTURE = new Date(Date.now() + 86400000);

const mockProduct = {
  id: 'prod-1',
  name: 'Estampilla Centenario',
  description: 'Edición limitada',
  slug: 'estampilla-centenario',
  meta_title: null,
  meta_description: null,
  meta_keywords: null,
  promotionable: true,
  available_on: PAST,
  discontinue_on: null,
  deleted_at: null,
  tax_category_id: null,
  shipping_category_id: null,
  created_at: NOW,
  updated_at: NOW,
  variants: [],
  taxCategory: null,
  shippingCategory: null,
};

describe('ProductService', () => {
  let service: ProductService;
  let prisma: {
    product: {
      create: jest.Mock;
      findUnique: jest.Mock;
      findFirst: jest.Mock;
      findMany: jest.Mock;
      update: jest.Mock;
      count: jest.Mock;
    };
    productsStore: {
      findMany: jest.Mock;
      findFirst: jest.Mock;
      create: jest.Mock;
      delete: jest.Mock;
    };
  };

  beforeEach(async () => {
    prisma = {
      product: {
        create: jest.fn(),
        findUnique: jest.fn(),
        findFirst: jest.fn(),
        findMany: jest.fn(),
        update: jest.fn(),
        count: jest.fn(),
      },
      productsStore: {
        findMany: jest.fn(),
        findFirst: jest.fn(),
        create: jest.fn(),
        delete: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // ─── create ──────────────────────────────────────────────

  describe('create', () => {
    const input = { name: 'Estampilla Centenario', slug: 'estampilla-centenario' };

    it('should create product when slug is unique', async () => {
      prisma.product.findFirst.mockResolvedValue(null);
      prisma.product.create.mockResolvedValue(mockProduct);

      const result = await service.create(input);
      expect(result).toEqual(mockProduct);
      expect(prisma.product.create).toHaveBeenCalled();
    });

    it('should throw AppConflictException when slug already exists', async () => {
      prisma.product.findFirst.mockResolvedValue(mockProduct);

      await expect(service.create(input)).rejects.toThrow(AppConflictException);
      expect(prisma.product.create).not.toHaveBeenCalled();
    });

    it('should create product without slug validation when slug not provided', async () => {
      prisma.product.create.mockResolvedValue({ ...mockProduct, slug: null });

      const result = await service.create({ name: 'Simple' });
      expect(result.slug).toBeNull();
      expect(prisma.product.findFirst).not.toHaveBeenCalled();
    });
  });

  // ─── findAll ─────────────────────────────────────────────

  describe('findAll', () => {
    it('should return paginated products', async () => {
      prisma.product.findMany.mockResolvedValue([mockProduct]);
      prisma.product.count.mockResolvedValue(1);

      const result = await service.findAll({ page: 1, limit: 10 });
      expect(result.data).toHaveLength(1);
      expect(result.total).toBe(1);
      expect(result.pages).toBe(1);
    });

    it('should apply search filter when provided', async () => {
      prisma.product.findMany.mockResolvedValue([]);
      prisma.product.count.mockResolvedValue(0);

      await service.findAll({ page: 1, limit: 10, search: 'centenario' });
      const call = prisma.product.findMany.mock.calls[0][0];
      expect(call.where.AND).toBeDefined();
    });

    it('should apply SKU filter when provided', async () => {
      prisma.product.findMany.mockResolvedValue([]);
      prisma.product.count.mockResolvedValue(0);

      await service.findAll({ page: 1, limit: 10, sku: 'EST-001' });
      const call = prisma.product.findMany.mock.calls[0][0];
      expect(call.where.AND).toBeDefined();
    });

    it('should apply available=true filter', async () => {
      prisma.product.findMany.mockResolvedValue([]);
      prisma.product.count.mockResolvedValue(0);

      await service.findAll({ page: 1, limit: 10, available: true });
      const where = prisma.product.findMany.mock.calls[0][0].where;
      expect(where.AND.length).toBeGreaterThan(1);
    });

    it('should apply available=false filter', async () => {
      prisma.product.findMany.mockResolvedValue([]);
      prisma.product.count.mockResolvedValue(0);

      await service.findAll({ page: 1, limit: 10, available: false });
      const where = prisma.product.findMany.mock.calls[0][0].where;
      expect(where.AND.length).toBeGreaterThan(1);
    });

    it('should calculate pages correctly', async () => {
      prisma.product.findMany.mockResolvedValue([]);
      prisma.product.count.mockResolvedValue(25);

      const result = await service.findAll({ page: 1, limit: 10 });
      expect(result.pages).toBe(3);
    });
  });

  // ─── findOne ─────────────────────────────────────────────

  describe('findOne', () => {
    it('should return product when found', async () => {
      prisma.product.findUnique.mockResolvedValue(mockProduct);

      const result = await service.findOne('prod-1');
      expect(result.id).toBe('prod-1');
    });

    it('should throw AppNotFoundException when product not found', async () => {
      prisma.product.findUnique.mockResolvedValue(null);

      await expect(service.findOne('no-exist')).rejects.toThrow(AppNotFoundException);
    });

    it('should throw AppNotFoundException when product is soft-deleted', async () => {
      prisma.product.findUnique.mockResolvedValue({ ...mockProduct, deleted_at: NOW });

      await expect(service.findOne('prod-1')).rejects.toThrow(AppNotFoundException);
    });
  });

  // ─── findBySlug ──────────────────────────────────────────

  describe('findBySlug', () => {
    it('should return product by slug', async () => {
      prisma.product.findFirst.mockResolvedValue(mockProduct);

      const result = await service.findBySlug('estampilla-centenario');
      expect(result.slug).toBe('estampilla-centenario');
    });

    it('should throw AppNotFoundException when slug not found', async () => {
      prisma.product.findFirst.mockResolvedValue(null);

      await expect(service.findBySlug('no-exist')).rejects.toThrow(AppNotFoundException);
    });
  });

  // ─── update ──────────────────────────────────────────────

  describe('update', () => {
    it('should update product with partial data', async () => {
      prisma.product.findUnique.mockResolvedValue(mockProduct);
      prisma.product.update.mockResolvedValue({ ...mockProduct, name: 'Updated' });

      const result = await service.update('prod-1', { id: 'prod-1', name: 'Updated' });
      expect(result.name).toBe('Updated');
    });

    it('should throw AppNotFoundException when updating non-existent product', async () => {
      prisma.product.findUnique.mockResolvedValue(null);

      await expect(service.update('no-exist', { id: 'no-exist' })).rejects.toThrow(
        AppNotFoundException,
      );
    });

    it('should throw AppConflictException when slug is taken', async () => {
      prisma.product.findUnique.mockResolvedValue(mockProduct);
      prisma.product.findFirst.mockResolvedValue({ id: 'other-prod', slug: 'taken' });

      await expect(
        service.update('prod-1', { id: 'prod-1', slug: 'taken' }),
      ).rejects.toThrow(AppConflictException);
    });
  });

  // ─── remove ──────────────────────────────────────────────

  describe('remove', () => {
    it('should soft-delete product and return true', async () => {
      prisma.product.findUnique.mockResolvedValue(mockProduct);
      prisma.product.update.mockResolvedValue({ ...mockProduct, deleted_at: NOW });

      const result = await service.remove('prod-1');
      expect(result).toBe(true);
      expect(prisma.product.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'prod-1' },
          data: { deleted_at: expect.any(Date) },
        }),
      );
    });

    it('should throw AppNotFoundException when removing non-existent product', async () => {
      prisma.product.findUnique.mockResolvedValue(null);

      await expect(service.remove('no-exist')).rejects.toThrow(AppNotFoundException);
    });
  });

  // ─── isProductAvailable ──────────────────────────────────

  describe('isProductAvailable', () => {
    it('should return true when product is available', async () => {
      prisma.product.findUnique.mockResolvedValue({
        available_on: PAST,
        discontinue_on: null,
        deleted_at: null,
      });

      expect(await service.isProductAvailable('prod-1')).toBe(true);
    });

    it('should return false when product is deleted', async () => {
      prisma.product.findUnique.mockResolvedValue({
        available_on: PAST,
        discontinue_on: null,
        deleted_at: NOW,
      });

      expect(await service.isProductAvailable('prod-1')).toBe(false);
    });

    it('should return false when not yet available', async () => {
      prisma.product.findUnique.mockResolvedValue({
        available_on: FUTURE,
        discontinue_on: null,
        deleted_at: null,
      });

      expect(await service.isProductAvailable('prod-1')).toBe(false);
    });

    it('should return false when discontinued', async () => {
      prisma.product.findUnique.mockResolvedValue({
        available_on: PAST,
        discontinue_on: PAST,
        deleted_at: null,
      });

      expect(await service.isProductAvailable('prod-1')).toBe(false);
    });

    it('should return false when product not found', async () => {
      prisma.product.findUnique.mockResolvedValue(null);

      expect(await service.isProductAvailable('no-exist')).toBe(false);
    });
  });

  // ─── store relations ─────────────────────────────────────

  describe('getStoresForProduct', () => {
    it('should return store ids for a product', async () => {
      prisma.productsStore.findMany.mockResolvedValue([
        { store_id: 'store-1' },
        { store_id: 'store-2' },
      ]);

      const result = await service.getStoresForProduct('prod-1');
      expect(result).toEqual(['store-1', 'store-2']);
    });

    it('should filter out null store ids', async () => {
      prisma.productsStore.findMany.mockResolvedValue([
        { store_id: 'store-1' },
        { store_id: null },
      ]);

      const result = await service.getStoresForProduct('prod-1');
      expect(result).toEqual(['store-1']);
    });
  });

  describe('isProductInStore', () => {
    it('should return true when relation exists', async () => {
      prisma.productsStore.findFirst.mockResolvedValue({ id: 'rel-1' });

      expect(await service.isProductInStore('prod-1', 'store-1')).toBe(true);
    });

    it('should return false when no relation', async () => {
      prisma.productsStore.findFirst.mockResolvedValue(null);

      expect(await service.isProductInStore('prod-1', 'store-1')).toBe(false);
    });
  });

  describe('addProductToStore', () => {
    it('should create relation when it does not exist', async () => {
      const newRel = { id: 'rel-1', product_id: 'prod-1', store_id: 'store-1' };
      prisma.productsStore.findFirst.mockResolvedValue(null);
      prisma.productsStore.create.mockResolvedValue(newRel);

      const result = await service.addProductToStore('prod-1', 'store-1');
      expect(result).toEqual(newRel);
      expect(prisma.productsStore.create).toHaveBeenCalled();
    });

    it('should return existing relation without creating (idempotent)', async () => {
      const existing = { id: 'rel-1', product_id: 'prod-1', store_id: 'store-1' };
      prisma.productsStore.findFirst.mockResolvedValue(existing);

      const result = await service.addProductToStore('prod-1', 'store-1');
      expect(result).toEqual(existing);
      expect(prisma.productsStore.create).not.toHaveBeenCalled();
    });
  });

  describe('removeProductFromStore', () => {
    it('should delete relation and return true', async () => {
      prisma.productsStore.findFirst.mockResolvedValue({ id: 'rel-1' });
      prisma.productsStore.delete.mockResolvedValue({});

      expect(await service.removeProductFromStore('prod-1', 'store-1')).toBe(true);
    });

    it('should return false when relation does not exist', async () => {
      prisma.productsStore.findFirst.mockResolvedValue(null);

      expect(await service.removeProductFromStore('prod-1', 'store-1')).toBe(false);
    });
  });

  // ─── validateProductExists ───────────────────────────────

  describe('validateProductExists', () => {
    it('should return true when product exists and not deleted', async () => {
      prisma.product.findUnique.mockResolvedValue({ id: 'prod-1', deleted_at: null });

      expect(await service.validateProductExists('prod-1')).toBe(true);
    });

    it('should return false when product is deleted', async () => {
      prisma.product.findUnique.mockResolvedValue({ id: 'prod-1', deleted_at: NOW });

      expect(await service.validateProductExists('prod-1')).toBe(false);
    });

    it('should return false when product does not exist', async () => {
      prisma.product.findUnique.mockResolvedValue(null);

      expect(await service.validateProductExists('no-exist')).toBe(false);
    });
  });
});
