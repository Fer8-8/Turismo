import { Test, TestingModule } from '@nestjs/testing';
import { VariantService } from './variant.service';
import { PrismaService } from '../../prisma/prisma.service';
import {
  AppNotFoundException,
  AppConflictException,
  BusinessException,
} from '../../core/shared';

const NOW = new Date();
const PAST = new Date(Date.now() - 86400000);
const FUTURE = new Date(Date.now() + 86400000);

const mockVariant = {
  id: 'var-1',
  product_id: 'prod-1',
  sku: 'EST-001',
  weight: 0.01,
  height: 5,
  width: 3,
  depth: 0.1,
  is_master: true,
  cost_price: 100,
  cost_currency: 'MXN',
  track_inventory: true,
  position: 0,
  tax_category_id: null,
  discontinue_on: null,
  deleted_at: null,
  created_at: NOW,
  updated_at: NOW,
  prices: [],
  taxCategory: null,
};

const mockProduct = {
  id: 'prod-1',
  deleted_at: null,
};

describe('VariantService', () => {
  let service: VariantService;
  let prisma: {
    variant: {
      create: jest.Mock;
      findUnique: jest.Mock;
      findFirst: jest.Mock;
      findMany: jest.Mock;
      update: jest.Mock;
    };
    product: {
      findUnique: jest.Mock;
    };
  };

  beforeEach(async () => {
    prisma = {
      variant: {
        create: jest.fn(),
        findUnique: jest.fn(),
        findFirst: jest.fn(),
        findMany: jest.fn(),
        update: jest.fn(),
      },
      product: {
        findUnique: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VariantService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<VariantService>(VariantService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // ─── create ──────────────────────────────────────────────

  describe('create', () => {
    const input = { product_id: 'prod-1', sku: 'EST-001' };

    it('should create variant when product exists and sku is unique', async () => {
      prisma.product.findUnique.mockResolvedValue(mockProduct);
      prisma.variant.findFirst.mockResolvedValue(null); // sku unique
      prisma.variant.create.mockResolvedValue(mockVariant);

      const result = await service.create(input);
      expect(result).toEqual(mockVariant);
    });

    it('should throw AppNotFoundException when product does not exist', async () => {
      prisma.product.findUnique.mockResolvedValue(null);

      await expect(service.create(input)).rejects.toThrow(AppNotFoundException);
    });

    it('should throw AppNotFoundException when product is soft-deleted', async () => {
      prisma.product.findUnique.mockResolvedValue({ id: 'prod-1', deleted_at: NOW });

      await expect(service.create(input)).rejects.toThrow(AppNotFoundException);
    });

    it('should throw AppConflictException when sku is already in use', async () => {
      prisma.product.findUnique.mockResolvedValue(mockProduct);
      prisma.variant.findFirst.mockResolvedValue({ id: 'other-var', sku: 'EST-001' });

      await expect(service.create(input)).rejects.toThrow(AppConflictException);
    });
  });

  // ─── findById ────────────────────────────────────────────

  describe('findById', () => {
    it('should return variant when found', async () => {
      prisma.variant.findUnique.mockResolvedValue(mockVariant);

      const result = await service.findById('var-1');
      expect(result.id).toBe('var-1');
    });

    it('should throw AppNotFoundException when variant not found', async () => {
      prisma.variant.findUnique.mockResolvedValue(null);

      await expect(service.findById('no-exist')).rejects.toThrow(AppNotFoundException);
    });

    it('should throw AppNotFoundException when variant is soft-deleted', async () => {
      prisma.variant.findUnique.mockResolvedValue({ ...mockVariant, deleted_at: NOW });

      await expect(service.findById('var-1')).rejects.toThrow(AppNotFoundException);
    });
  });

  // ─── findByProductId ─────────────────────────────────────

  describe('findByProductId', () => {
    it('should return variants for a given product', async () => {
      prisma.variant.findMany.mockResolvedValue([mockVariant]);

      const result = await service.findByProductId('prod-1');
      expect(result).toHaveLength(1);
    });

    it('should return empty array when no variants found', async () => {
      prisma.variant.findMany.mockResolvedValue([]);

      const result = await service.findByProductId('prod-1');
      expect(result).toEqual([]);
    });
  });

  // ─── findBySku ───────────────────────────────────────────

  describe('findBySku', () => {
    it('should return variant with product when found by sku', async () => {
      const withProduct = { ...mockVariant, product: mockProduct };
      prisma.variant.findFirst.mockResolvedValue(withProduct);

      const result = await service.findBySku('EST-001');
      expect(result.sku).toBe('EST-001');
    });

    it('should throw AppNotFoundException when sku not found', async () => {
      prisma.variant.findFirst.mockResolvedValue(null);

      await expect(service.findBySku('NO-SKU')).rejects.toThrow(AppNotFoundException);
    });
  });

  // ─── update ──────────────────────────────────────────────

  describe('update', () => {
    it('should update variant with partial data', async () => {
      prisma.variant.findUnique.mockResolvedValue(mockVariant);
      prisma.variant.update.mockResolvedValue({ ...mockVariant, weight: 0.02 });

      const result = await service.update('var-1', { id: 'var-1', weight: 0.02 });
      expect(result.weight).toBe(0.02);
    });

    it('should throw AppNotFoundException when variant does not exist', async () => {
      prisma.variant.findUnique.mockResolvedValue(null);

      await expect(service.update('no-exist', { id: 'no-exist' })).rejects.toThrow(
        AppNotFoundException,
      );
    });

    it('should throw AppConflictException when new sku is taken', async () => {
      prisma.variant.findUnique.mockResolvedValueOnce(mockVariant); // findById
      prisma.variant.findFirst.mockResolvedValue({ id: 'other', sku: 'TAKEN' }); // sku check

      await expect(
        service.update('var-1', { id: 'var-1', sku: 'TAKEN' }),
      ).rejects.toThrow(AppConflictException);
    });
  });

  // ─── remove ──────────────────────────────────────────────

  describe('remove', () => {
    it('should soft-delete variant and return true', async () => {
      prisma.variant.findUnique.mockResolvedValue(mockVariant);
      prisma.variant.update.mockResolvedValue({ ...mockVariant, deleted_at: NOW });

      const result = await service.remove('var-1');
      expect(result).toBe(true);
    });

    it('should throw when variant does not exist', async () => {
      prisma.variant.findUnique.mockResolvedValue(null);

      await expect(service.remove('no-exist')).rejects.toThrow(AppNotFoundException);
    });
  });

  // ─── validateSkuUniqueness ───────────────────────────────

  describe('validateSkuUniqueness', () => {
    it('should not throw when sku is unique', async () => {
      prisma.variant.findFirst.mockResolvedValue(null);

      await expect(service.validateSkuUniqueness('NEW-SKU')).resolves.not.toThrow();
    });

    it('should throw AppConflictException when sku exists', async () => {
      prisma.variant.findFirst.mockResolvedValue({ id: 'other' });

      await expect(service.validateSkuUniqueness('TAKEN')).rejects.toThrow(
        AppConflictException,
      );
    });

    it('should skip validation for falsy sku', async () => {
      await expect(service.validateSkuUniqueness('')).resolves.not.toThrow();
      expect(prisma.variant.findFirst).not.toHaveBeenCalled();
    });

    it('should exclude specific id from check', async () => {
      prisma.variant.findFirst.mockResolvedValue(null);

      await service.validateSkuUniqueness('SKU-1', 'var-1');
      const where = prisma.variant.findFirst.mock.calls[0][0].where;
      expect(where.id).toEqual({ not: 'var-1' });
    });
  });

  // ─── isVariantAvailable ──────────────────────────────────

  describe('isVariantAvailable', () => {
    it('should return true when variant and product are active', async () => {
      prisma.variant.findUnique.mockResolvedValue({
        deleted_at: null,
        discontinue_on: null,
        product: { available_on: PAST, discontinue_on: null, deleted_at: null },
      });

      expect(await service.isVariantAvailable('var-1')).toBe(true);
    });

    it('should return false when variant is deleted', async () => {
      prisma.variant.findUnique.mockResolvedValue({
        deleted_at: NOW,
        discontinue_on: null,
        product: { available_on: PAST, discontinue_on: null, deleted_at: null },
      });

      expect(await service.isVariantAvailable('var-1')).toBe(false);
    });

    it('should return false when variant is discontinued', async () => {
      prisma.variant.findUnique.mockResolvedValue({
        deleted_at: null,
        discontinue_on: PAST,
        product: { available_on: PAST, discontinue_on: null, deleted_at: null },
      });

      expect(await service.isVariantAvailable('var-1')).toBe(false);
    });

    it('should return false when product is not yet available', async () => {
      prisma.variant.findUnique.mockResolvedValue({
        deleted_at: null,
        discontinue_on: null,
        product: { available_on: FUTURE, discontinue_on: null, deleted_at: null },
      });

      expect(await service.isVariantAvailable('var-1')).toBe(false);
    });

    it('should return false when product is deleted', async () => {
      prisma.variant.findUnique.mockResolvedValue({
        deleted_at: null,
        discontinue_on: null,
        product: { available_on: PAST, discontinue_on: null, deleted_at: NOW },
      });

      expect(await service.isVariantAvailable('var-1')).toBe(false);
    });

    it('should return false when variant not found', async () => {
      prisma.variant.findUnique.mockResolvedValue(null);

      expect(await service.isVariantAvailable('no-exist')).toBe(false);
    });

    it('should return false when product is null', async () => {
      prisma.variant.findUnique.mockResolvedValue({
        deleted_at: null,
        discontinue_on: null,
        product: null,
      });

      expect(await service.isVariantAvailable('var-1')).toBe(false);
    });
  });

  // ─── isVariantTrackable ──────────────────────────────────

  describe('isVariantTrackable', () => {
    it('should return true when track_inventory is true', async () => {
      prisma.variant.findUnique.mockResolvedValue({
        track_inventory: true,
        deleted_at: null,
      });

      expect(await service.isVariantTrackable('var-1')).toBe(true);
    });

    it('should return false when track_inventory is false', async () => {
      prisma.variant.findUnique.mockResolvedValue({
        track_inventory: false,
        deleted_at: null,
      });

      expect(await service.isVariantTrackable('var-1')).toBe(false);
    });

    it('should return false when variant is deleted', async () => {
      prisma.variant.findUnique.mockResolvedValue({
        track_inventory: true,
        deleted_at: NOW,
      });

      expect(await service.isVariantTrackable('var-1')).toBe(false);
    });

    it('should return false when variant not found', async () => {
      prisma.variant.findUnique.mockResolvedValue(null);

      expect(await service.isVariantTrackable('no-exist')).toBe(false);
    });
  });

  // ─── getVariantForSales ──────────────────────────────────

  describe('getVariantForSales', () => {
    it('should return variant with prices and product info', async () => {
      const salesVariant = {
        ...mockVariant,
        product: { id: 'prod-1', name: 'Test', slug: 'test' },
      };
      prisma.variant.findUnique.mockResolvedValue(salesVariant);

      const result = await service.getVariantForSales('var-1');
      expect(result.product).toBeDefined();
    });

    it('should throw AppNotFoundException when variant not found', async () => {
      prisma.variant.findUnique.mockResolvedValue(null);

      await expect(service.getVariantForSales('no-exist')).rejects.toThrow(
        AppNotFoundException,
      );
    });

    it('should throw when variant is soft-deleted', async () => {
      prisma.variant.findUnique.mockResolvedValue({ ...mockVariant, deleted_at: NOW });

      await expect(service.getVariantForSales('var-1')).rejects.toThrow(
        AppNotFoundException,
      );
    });
  });

  // ─── getVariantForInventory ──────────────────────────────

  describe('getVariantForInventory', () => {
    it('should return variant with physical dimensions', async () => {
      prisma.variant.findUnique.mockResolvedValue({
        id: 'var-1',
        sku: 'EST-001',
        weight: 0.01,
        height: 5,
        width: 3,
        depth: 0.1,
        track_inventory: true,
        product_id: 'prod-1',
        product: { id: 'prod-1', name: 'Test' },
      });

      const result = await service.getVariantForInventory('var-1');
      expect(result.weight).toBe(0.01);
      expect(result.product).toBeDefined();
    });

    it('should throw when variant not found', async () => {
      prisma.variant.findUnique.mockResolvedValue(null);

      await expect(service.getVariantForInventory('no-exist')).rejects.toThrow(
        AppNotFoundException,
      );
    });
  });

  // ─── resolveProductForVariant ────────────────────────────

  describe('resolveProductForVariant', () => {
    it('should return product_id for a variant', async () => {
      prisma.variant.findUnique.mockResolvedValue({ product_id: 'prod-1' });

      expect(await service.resolveProductForVariant('var-1')).toBe('prod-1');
    });

    it('should throw BusinessException when variant has no product', async () => {
      prisma.variant.findUnique.mockResolvedValue({ product_id: null });

      await expect(service.resolveProductForVariant('var-1')).rejects.toThrow(
        BusinessException,
      );
    });

    it('should throw BusinessException when variant not found', async () => {
      prisma.variant.findUnique.mockResolvedValue(null);

      await expect(service.resolveProductForVariant('no-exist')).rejects.toThrow(
        BusinessException,
      );
    });
  });

  // ─── validateVariantExists ───────────────────────────────

  describe('validateVariantExists', () => {
    it('should return true when variant exists', async () => {
      prisma.variant.findUnique.mockResolvedValue({ id: 'var-1', deleted_at: null });

      expect(await service.validateVariantExists('var-1')).toBe(true);
    });

    it('should return false when variant is deleted', async () => {
      prisma.variant.findUnique.mockResolvedValue({ id: 'var-1', deleted_at: NOW });

      expect(await service.validateVariantExists('var-1')).toBe(false);
    });

    it('should return false when variant not found', async () => {
      prisma.variant.findUnique.mockResolvedValue(null);

      expect(await service.validateVariantExists('no-exist')).toBe(false);
    });
  });
});
