import { Test, TestingModule } from '@nestjs/testing';
import { TaxonomyService } from './taxonomy.service';
import { PrismaService } from '../../prisma/prisma.service';
import { AppNotFoundException } from '../../core/shared';

const NOW = new Date();
const mockTaxonomy = {
  id: 'tax-1',
  name: 'Categorías',
  position: 0,
  store_id: null,
  created_at: NOW,
  updated_at: NOW,
  taxons: [],
};

describe('TaxonomyService', () => {
  let service: TaxonomyService;
  let prisma: {
    taxonomy: {
      create: jest.Mock;
      findUnique: jest.Mock;
      findMany: jest.Mock;
      update: jest.Mock;
      delete: jest.Mock;
    };
  };

  beforeEach(async () => {
    prisma = {
      taxonomy: {
        create: jest.fn(),
        findUnique: jest.fn(),
        findMany: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaxonomyService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<TaxonomyService>(TaxonomyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a taxonomy', async () => {
      prisma.taxonomy.create.mockResolvedValue(mockTaxonomy);

      const result = await service.create({ name: 'Categorías' });
      expect(result).toEqual(mockTaxonomy);
      expect(prisma.taxonomy.create).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return all taxonomies ordered by position', async () => {
      prisma.taxonomy.findMany.mockResolvedValue([mockTaxonomy]);

      const result = await service.findAll();
      expect(result).toHaveLength(1);
    });
  });

  describe('findOne', () => {
    it('should return taxonomy by id', async () => {
      prisma.taxonomy.findUnique.mockResolvedValue(mockTaxonomy);

      const result = await service.findOne('tax-1');
      expect(result.id).toBe('tax-1');
    });

    it('should throw AppNotFoundException when not found', async () => {
      prisma.taxonomy.findUnique.mockResolvedValue(null);

      await expect(service.findOne('no-exist')).rejects.toThrow(AppNotFoundException);
    });
  });

  describe('update', () => {
    it('should update taxonomy', async () => {
      prisma.taxonomy.findUnique.mockResolvedValue(mockTaxonomy);
      prisma.taxonomy.update.mockResolvedValue({ ...mockTaxonomy, name: 'Updated' });

      const result = await service.update('tax-1', { id: 'tax-1', name: 'Updated' });
      expect(result.name).toBe('Updated');
    });

    it('should throw when taxonomy not found', async () => {
      prisma.taxonomy.findUnique.mockResolvedValue(null);

      await expect(
        service.update('no-exist', { id: 'no-exist', name: 'X' }),
      ).rejects.toThrow(AppNotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete taxonomy and return true', async () => {
      prisma.taxonomy.findUnique.mockResolvedValue(mockTaxonomy);
      prisma.taxonomy.delete.mockResolvedValue(mockTaxonomy);

      expect(await service.remove('tax-1')).toBe(true);
    });

    it('should throw when taxonomy not found', async () => {
      prisma.taxonomy.findUnique.mockResolvedValue(null);

      await expect(service.remove('no-exist')).rejects.toThrow(AppNotFoundException);
    });
  });

  describe('findByStore', () => {
    it('should return taxonomies for a store', async () => {
      prisma.taxonomy.findMany.mockResolvedValue([mockTaxonomy]);

      const result = await service.findByStore('store-1');
      expect(result).toHaveLength(1);
      expect(prisma.taxonomy.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: { store_id: 'store-1' } }),
      );
    });
  });

  describe('validateTaxonomyExists', () => {
    it('should return true when exists', async () => {
      prisma.taxonomy.findUnique.mockResolvedValue({ id: 'tax-1' });

      expect(await service.validateTaxonomyExists('tax-1')).toBe(true);
    });

    it('should return false when not exists', async () => {
      prisma.taxonomy.findUnique.mockResolvedValue(null);

      expect(await service.validateTaxonomyExists('no-exist')).toBe(false);
    });
  });
});
