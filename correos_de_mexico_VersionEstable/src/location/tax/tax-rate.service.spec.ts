import { Test, TestingModule } from '@nestjs/testing';
import { TaxRateService } from './tax-rate.service';
import { PrismaService } from '../../prisma/prisma.service';
import { AppNotFoundException } from '../../core/shared';

const mockZone = { id: 'z1', name: 'MX Zone' };
const mockCategory = { id: 'tc1', name: 'IVA General' };
const mockRate = {
  id: 'tr1',
  amount: 0.16,
  name: 'IVA 16%',
  zone_id: 'z1',
  tax_category_id: 'tc1',
  included_in_price: false,
  show_rate_in_label: true,
  deleted_at: null,
  created_at: new Date(),
  updated_at: new Date(),
  zone: mockZone,
  taxCategory: mockCategory,
};

describe('TaxRateService', () => {
  let service: TaxRateService;
  let prisma: { taxRate: Record<string, jest.Mock> };

  beforeEach(async () => {
    prisma = {
      taxRate: {
        create: jest.fn().mockResolvedValue(mockRate),
        findFirst: jest.fn().mockResolvedValue(mockRate),
        findMany: jest.fn().mockResolvedValue([mockRate]),
        update: jest.fn().mockResolvedValue(mockRate),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaxRateService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<TaxRateService>(TaxRateService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // ─── create ──────────────────────────────────────────────

  describe('create', () => {
    it('creates a tax rate with includes', async () => {
      const r = await service.create({ amount: 0.16, name: 'IVA 16%', zone_id: 'z1', tax_category_id: 'tc1' });
      expect(r).toEqual(mockRate);
      expect(prisma.taxRate.create).toHaveBeenCalledWith(
        expect.objectContaining({ include: expect.any(Object) }),
      );
    });
  });

  // ─── findById ────────────────────────────────────────────

  describe('findById', () => {
    it('returns rate when found', async () => {
      expect(await service.findById('tr1')).toEqual(mockRate);
    });

    it('throws AppNotFoundException when not found', async () => {
      prisma.taxRate.findFirst.mockResolvedValue(null);
      await expect(service.findById('no')).rejects.toThrow(AppNotFoundException);
    });
  });

  // ─── findAll ─────────────────────────────────────────────

  describe('findAll', () => {
    it('returns all rates without filter', async () => {
      expect(await service.findAll()).toEqual([mockRate]);
    });

    it('filters by zone_id', async () => {
      await service.findAll({ zone_id: 'z1' });
      const where = prisma.taxRate.findMany.mock.calls[0][0].where;
      expect(where.zone_id).toBe('z1');
    });

    it('filters by tax_category_id', async () => {
      await service.findAll({ tax_category_id: 'tc1' });
      const where = prisma.taxRate.findMany.mock.calls[0][0].where;
      expect(where.tax_category_id).toBe('tc1');
    });

    it('filters by search', async () => {
      await service.findAll({ search: 'IVA' });
      const where = prisma.taxRate.findMany.mock.calls[0][0].where;
      expect(where.name).toBeDefined();
    });
  });

  // ─── update ──────────────────────────────────────────────

  describe('update', () => {
    it('updates rate', async () => {
      const r = await service.update('tr1', { id: 'tr1', name: 'IVA Updated' });
      expect(r).toEqual(mockRate);
    });

    it('throws if rate not found', async () => {
      prisma.taxRate.findFirst.mockResolvedValue(null);
      await expect(
        service.update('no', { id: 'no', name: 'X' }),
      ).rejects.toThrow(AppNotFoundException);
    });
  });

  // ─── remove ──────────────────────────────────────────────

  describe('remove', () => {
    it('soft deletes and returns true', async () => {
      expect(await service.remove('tr1')).toBe(true);
      expect(prisma.taxRate.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'tr1' },
          data: expect.objectContaining({ deleted_at: expect.any(Date) }),
        }),
      );
    });

    it('throws if not found', async () => {
      prisma.taxRate.findFirst.mockResolvedValue(null);
      await expect(service.remove('no')).rejects.toThrow(AppNotFoundException);
    });
  });

  // ─── findByZone ──────────────────────────────────────────

  describe('findByZone', () => {
    it('returns rates for a zone', async () => {
      expect(await service.findByZone('z1')).toEqual([mockRate]);
      const where = prisma.taxRate.findMany.mock.calls[0][0].where;
      expect(where.zone_id).toBe('z1');
    });
  });

  // ─── findByCategory ──────────────────────────────────────

  describe('findByCategory', () => {
    it('returns rates for a category', async () => {
      expect(await service.findByCategory('tc1')).toEqual([mockRate]);
      const where = prisma.taxRate.findMany.mock.calls[0][0].where;
      expect(where.tax_category_id).toBe('tc1');
    });
  });

  // ─── findByCategoryAndZone ───────────────────────────────

  describe('findByCategoryAndZone', () => {
    it('returns rates matching both category and zone', async () => {
      expect(await service.findByCategoryAndZone('tc1', 'z1')).toEqual([mockRate]);
      const where = prisma.taxRate.findMany.mock.calls[0][0].where;
      expect(where.tax_category_id).toBe('tc1');
      expect(where.zone_id).toBe('z1');
    });
  });

  // ─── validateExists ──────────────────────────────────────

  describe('validateExists', () => {
    it('returns true when rate exists', async () => {
      expect(await service.validateExists('tr1')).toBe(true);
    });

    it('throws when rate does not exist', async () => {
      prisma.taxRate.findFirst.mockResolvedValue(null);
      await expect(service.validateExists('no')).rejects.toThrow(AppNotFoundException);
    });
  });
});
