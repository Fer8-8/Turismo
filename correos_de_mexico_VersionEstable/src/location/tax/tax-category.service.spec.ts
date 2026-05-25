import { Test, TestingModule } from '@nestjs/testing';
import { TaxCategoryService } from './tax-category.service';
import { PrismaService } from '../../prisma/prisma.service';
import { AppNotFoundException, AppConflictException } from '../../core/shared';

const mockCategory = {
  id: 'tc1',
  name: 'IVA General',
  description: 'Impuesto al valor agregado',
  is_default: true,
  tax_code: 'IVA_16',
  deleted_at: null,
  created_at: new Date(),
  updated_at: new Date(),
};

describe('TaxCategoryService', () => {
  let service: TaxCategoryService;
  let prisma: { taxCategory: Record<string, jest.Mock> };

  beforeEach(async () => {
    prisma = {
      taxCategory: {
        create: jest.fn().mockResolvedValue(mockCategory),
        findFirst: jest.fn().mockResolvedValue(null),
        findMany: jest.fn().mockResolvedValue([mockCategory]),
        update: jest.fn().mockResolvedValue(mockCategory),
        updateMany: jest.fn().mockResolvedValue({ count: 1 }),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaxCategoryService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<TaxCategoryService>(TaxCategoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // ─── create ──────────────────────────────────────────────

  describe('create', () => {
    it('creates a tax category', async () => {
      const r = await service.create({ name: 'IVA General', tax_code: 'IVA_16' });
      expect(r).toEqual(mockCategory);
      expect(prisma.taxCategory.create).toHaveBeenCalled();
    });

    it('throws AppConflictException if tax_code exists', async () => {
      prisma.taxCategory.findFirst.mockResolvedValue(mockCategory);
      await expect(
        service.create({ name: 'Otro', tax_code: 'IVA_16' }),
      ).rejects.toThrow(AppConflictException);
    });

    it('clears existing default when is_default is true', async () => {
      prisma.taxCategory.findFirst.mockResolvedValue(null);
      await service.create({ name: 'New Default', is_default: true });
      expect(prisma.taxCategory.updateMany).toHaveBeenCalledWith({
        where: { is_default: true },
        data: { is_default: false },
      });
    });

    it('creates without tax_code skipping uniqueness check', async () => {
      await service.create({ name: 'Simple' });
      expect(prisma.taxCategory.findFirst).not.toHaveBeenCalled();
      expect(prisma.taxCategory.create).toHaveBeenCalled();
    });
  });

  // ─── findById ────────────────────────────────────────────

  describe('findById', () => {
    it('returns tax category when found', async () => {
      prisma.taxCategory.findFirst.mockResolvedValue(mockCategory);
      expect(await service.findById('tc1')).toEqual(mockCategory);
    });

    it('throws AppNotFoundException when not found', async () => {
      prisma.taxCategory.findFirst.mockResolvedValue(null);
      await expect(service.findById('no')).rejects.toThrow(AppNotFoundException);
    });
  });

  // ─── findAll ─────────────────────────────────────────────

  describe('findAll', () => {
    it('returns all categories without filter', async () => {
      expect(await service.findAll()).toEqual([mockCategory]);
    });

    it('filters by search', async () => {
      await service.findAll({ search: 'IVA' });
      const where = prisma.taxCategory.findMany.mock.calls[0][0].where;
      expect(where.OR).toBeDefined();
    });

    it('filters by tax_code', async () => {
      await service.findAll({ tax_code: 'IVA_16' });
      const where = prisma.taxCategory.findMany.mock.calls[0][0].where;
      expect(where.tax_code).toBeDefined();
    });
  });

  // ─── update ──────────────────────────────────────────────

  describe('update', () => {
    it('updates tax category', async () => {
      prisma.taxCategory.findFirst.mockResolvedValueOnce(mockCategory);
      const r = await service.update('tc1', { id: 'tc1', name: 'Updated' });
      expect(r).toEqual(mockCategory);
    });

    it('throws AppConflictException if tax_code conflicts', async () => {
      prisma.taxCategory.findFirst
        .mockResolvedValueOnce(mockCategory) // findById
        .mockResolvedValueOnce({ id: 'other' }); // conflict check
      await expect(
        service.update('tc1', { id: 'tc1', tax_code: 'USED' }),
      ).rejects.toThrow(AppConflictException);
    });

    it('clears default before setting new default', async () => {
      prisma.taxCategory.findFirst.mockResolvedValueOnce(mockCategory);
      prisma.taxCategory.findFirst.mockResolvedValueOnce(null);
      await service.update('tc1', { id: 'tc1', is_default: true });
      expect(prisma.taxCategory.updateMany).toHaveBeenCalled();
    });
  });

  // ─── remove ──────────────────────────────────────────────

  describe('remove', () => {
    it('soft deletes and returns true', async () => {
      prisma.taxCategory.findFirst.mockResolvedValue(mockCategory);
      expect(await service.remove('tc1')).toBe(true);
      expect(prisma.taxCategory.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'tc1' },
          data: expect.objectContaining({ deleted_at: expect.any(Date) }),
        }),
      );
    });

    it('throws AppNotFoundException if not found', async () => {
      prisma.taxCategory.findFirst.mockResolvedValue(null);
      await expect(service.remove('no')).rejects.toThrow(AppNotFoundException);
    });
  });

  // ─── findDefault ─────────────────────────────────────────

  describe('findDefault', () => {
    it('returns default category', async () => {
      prisma.taxCategory.findFirst.mockResolvedValue(mockCategory);
      const r = await service.findDefault();
      expect(r).toEqual(mockCategory);
    });

    it('returns null if no default', async () => {
      prisma.taxCategory.findFirst.mockResolvedValue(null);
      const r = await service.findDefault();
      expect(r).toBeNull();
    });
  });

  // ─── findByTaxCode ───────────────────────────────────────

  describe('findByTaxCode', () => {
    it('returns category by tax_code', async () => {
      prisma.taxCategory.findFirst.mockResolvedValue(mockCategory);
      expect(await service.findByTaxCode('IVA_16')).toEqual(mockCategory);
    });

    it('throws when not found', async () => {
      prisma.taxCategory.findFirst.mockResolvedValue(null);
      await expect(service.findByTaxCode('XXX')).rejects.toThrow(AppNotFoundException);
    });
  });

  // ─── validateExists ──────────────────────────────────────

  describe('validateExists', () => {
    it('returns true when exists', async () => {
      prisma.taxCategory.findFirst.mockResolvedValue(mockCategory);
      expect(await service.validateExists('tc1')).toBe(true);
    });

    it('throws when does not exist', async () => {
      prisma.taxCategory.findFirst.mockResolvedValue(null);
      await expect(service.validateExists('no')).rejects.toThrow(AppNotFoundException);
    });
  });
});
