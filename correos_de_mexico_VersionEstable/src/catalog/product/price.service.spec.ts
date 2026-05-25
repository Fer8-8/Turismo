import { Test, TestingModule } from '@nestjs/testing';
import { PriceService } from './price.service';
import { PrismaService } from '../../prisma/prisma.service';
import { AppNotFoundException } from '../../core/shared';

const NOW = new Date();

const mockPrice = {
  id: 'price-1',
  variant_id: 'var-1',
  amount: 150.5,
  currency: 'MXN',
  compare_at_amount: null,
  deleted_at: null,
  created_at: NOW,
  updated_at: NOW,
};

const mockVariant = {
  id: 'var-1',
  deleted_at: null,
};

describe('PriceService', () => {
  let service: PriceService;
  let prisma: {
    price: {
      create: jest.Mock;
      findUnique: jest.Mock;
      findFirst: jest.Mock;
      findMany: jest.Mock;
      update: jest.Mock;
    };
    variant: {
      findUnique: jest.Mock;
    };
  };

  beforeEach(async () => {
    prisma = {
      price: {
        create: jest.fn(),
        findUnique: jest.fn(),
        findFirst: jest.fn(),
        findMany: jest.fn(),
        update: jest.fn(),
      },
      variant: {
        findUnique: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PriceService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<PriceService>(PriceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // ─── create ──────────────────────────────────────────────

  describe('create', () => {
    const input = { variant_id: 'var-1', amount: 150.5, currency: 'MXN' };

    it('should create price when variant exists', async () => {
      prisma.variant.findUnique.mockResolvedValue(mockVariant);
      prisma.price.create.mockResolvedValue(mockPrice);

      const result = await service.create(input);
      expect(result).toEqual(mockPrice);
    });

    it('should throw AppNotFoundException when variant does not exist', async () => {
      prisma.variant.findUnique.mockResolvedValue(null);

      await expect(service.create(input)).rejects.toThrow(AppNotFoundException);
    });

    it('should throw AppNotFoundException when variant is soft-deleted', async () => {
      prisma.variant.findUnique.mockResolvedValue({ id: 'var-1', deleted_at: NOW });

      await expect(service.create(input)).rejects.toThrow(AppNotFoundException);
    });
  });

  // ─── findById ────────────────────────────────────────────

  describe('findById', () => {
    it('should return price when found', async () => {
      prisma.price.findUnique.mockResolvedValue(mockPrice);

      const result = await service.findById('price-1');
      expect(result.id).toBe('price-1');
    });

    it('should throw AppNotFoundException when price not found', async () => {
      prisma.price.findUnique.mockResolvedValue(null);

      await expect(service.findById('no-exist')).rejects.toThrow(AppNotFoundException);
    });

    it('should throw AppNotFoundException when price is soft-deleted', async () => {
      prisma.price.findUnique.mockResolvedValue({ ...mockPrice, deleted_at: NOW });

      await expect(service.findById('price-1')).rejects.toThrow(AppNotFoundException);
    });
  });

  // ─── findByVariantId ─────────────────────────────────────

  describe('findByVariantId', () => {
    it('should return prices for variant', async () => {
      prisma.price.findMany.mockResolvedValue([mockPrice]);

      const result = await service.findByVariantId('var-1');
      expect(result).toHaveLength(1);
    });

    it('should return empty array when no prices', async () => {
      prisma.price.findMany.mockResolvedValue([]);

      const result = await service.findByVariantId('var-1');
      expect(result).toEqual([]);
    });
  });

  // ─── getBasePrice ────────────────────────────────────────

  describe('getBasePrice', () => {
    it('should return oldest active price', async () => {
      prisma.price.findFirst.mockResolvedValue(mockPrice);

      const result = await service.getBasePrice('var-1');
      expect(result).toEqual(mockPrice);
    });

    it('should return null when no prices exist', async () => {
      prisma.price.findFirst.mockResolvedValue(null);

      const result = await service.getBasePrice('var-1');
      expect(result).toBeNull();
    });
  });

  // ─── update ──────────────────────────────────────────────

  describe('update', () => {
    it('should update price with partial data', async () => {
      prisma.price.findUnique.mockResolvedValue(mockPrice);
      prisma.price.update.mockResolvedValue({ ...mockPrice, amount: 200 });

      const result = await service.update('price-1', { id: 'price-1', amount: 200 });
      expect(result.amount).toBe(200);
    });

    it('should throw when price does not exist', async () => {
      prisma.price.findUnique.mockResolvedValue(null);

      await expect(service.update('no-exist', { id: 'no-exist' })).rejects.toThrow(
        AppNotFoundException,
      );
    });
  });

  // ─── remove ──────────────────────────────────────────────

  describe('remove', () => {
    it('should soft-delete price and return true', async () => {
      prisma.price.findUnique.mockResolvedValue(mockPrice);
      prisma.price.update.mockResolvedValue({ ...mockPrice, deleted_at: NOW });

      const result = await service.remove('price-1');
      expect(result).toBe(true);
    });

    it('should throw when price does not exist', async () => {
      prisma.price.findUnique.mockResolvedValue(null);

      await expect(service.remove('no-exist')).rejects.toThrow(AppNotFoundException);
    });
  });
});
