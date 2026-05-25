import { Test, TestingModule } from '@nestjs/testing';
import { TaxonService } from './taxon.service';
import { PrismaService } from '../../prisma/prisma.service';
import { AppNotFoundException } from '../../core/shared';

const NOW = new Date();
const mockTaxon = {
  id: 'txn-1',
  name: 'Estampillas',
  permalink: 'estampillas',
  description: null,
  meta_title: null,
  meta_description: null,
  meta_keywords: null,
  position: 0,
  depth: 0,
  hide_from_nav: false,
  parent_id: null,
  taxonomy_id: 'tax-1',
  created_at: NOW,
  updated_at: NOW,
  children: [],
  parent: null,
};

describe('TaxonService', () => {
  let service: TaxonService;
  let prisma: {
    taxon: {
      create: jest.Mock;
      findUnique: jest.Mock;
      findFirst: jest.Mock;
      findMany: jest.Mock;
      update: jest.Mock;
      delete: jest.Mock;
    };
    productsTaxon: {
      findFirst: jest.Mock;
      findMany: jest.Mock;
      create: jest.Mock;
      delete: jest.Mock;
    };
  };

  beforeEach(async () => {
    prisma = {
      taxon: {
        create: jest.fn(),
        findUnique: jest.fn(),
        findFirst: jest.fn(),
        findMany: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
      productsTaxon: {
        findFirst: jest.fn(),
        findMany: jest.fn(),
        create: jest.fn(),
        delete: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaxonService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<TaxonService>(TaxonService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // ─── create ──────────────────────────────────────────────

  describe('create', () => {
    it('should create root taxon with depth 0', async () => {
      prisma.taxon.create.mockResolvedValue(mockTaxon);

      const result = await service.create({ name: 'Estampillas', taxonomy_id: 'tax-1' });
      expect(result).toEqual(mockTaxon);
      const data = prisma.taxon.create.mock.calls[0][0].data;
      expect(data.depth).toBe(0);
    });

    it('should calculate depth from parent', async () => {
      prisma.taxon.findUnique.mockResolvedValue({ depth: 1 });
      prisma.taxon.create.mockResolvedValue({ ...mockTaxon, depth: 2 });

      const result = await service.create({
        name: 'Sub',
        taxonomy_id: 'tax-1',
        parent_id: 'txn-parent',
      });
      const data = prisma.taxon.create.mock.calls[0][0].data;
      expect(data.depth).toBe(2);
    });

    it('should throw when parent not found', async () => {
      prisma.taxon.findUnique.mockResolvedValue(null);

      await expect(
        service.create({ name: 'X', parent_id: 'no-exist' }),
      ).rejects.toThrow(AppNotFoundException);
    });
  });

  // ─── findById ────────────────────────────────────────────

  describe('findById', () => {
    it('should return taxon', async () => {
      prisma.taxon.findUnique.mockResolvedValue(mockTaxon);

      const result = await service.findById('txn-1');
      expect(result.name).toBe('Estampillas');
    });

    it('should throw when not found', async () => {
      prisma.taxon.findUnique.mockResolvedValue(null);

      await expect(service.findById('no-exist')).rejects.toThrow(AppNotFoundException);
    });
  });

  // ─── findByTaxonomy ──────────────────────────────────────

  describe('findByTaxonomy', () => {
    it('should return taxons for taxonomy', async () => {
      prisma.taxon.findMany.mockResolvedValue([mockTaxon]);

      const result = await service.findByTaxonomy('tax-1');
      expect(result).toHaveLength(1);
    });
  });

  // ─── update ──────────────────────────────────────────────

  describe('update', () => {
    it('should update taxon', async () => {
      prisma.taxon.findUnique.mockResolvedValue(mockTaxon);
      prisma.taxon.update.mockResolvedValue({ ...mockTaxon, name: 'Updated' });

      const result = await service.update('txn-1', { id: 'txn-1', name: 'Updated' });
      expect(result.name).toBe('Updated');
    });

    it('should recalculate depth when parent changes', async () => {
      prisma.taxon.findUnique
        .mockResolvedValueOnce(mockTaxon) // findById
        .mockResolvedValueOnce({ depth: 2 }); // parent lookup
      prisma.taxon.update.mockResolvedValue({ ...mockTaxon, depth: 3 });

      await service.update('txn-1', { id: 'txn-1', parent_id: 'txn-parent' });
      const data = prisma.taxon.update.mock.calls[0][0].data;
      expect(data.depth).toBe(3);
    });

    it('should set depth 0 when parent removed', async () => {
      prisma.taxon.findUnique.mockResolvedValue(mockTaxon);
      prisma.taxon.update.mockResolvedValue({ ...mockTaxon, depth: 0 });

      await service.update('txn-1', { id: 'txn-1', parent_id: null as any });
      const data = prisma.taxon.update.mock.calls[0][0].data;
      expect(data.depth).toBe(0);
    });

    it('should throw when taxon not found', async () => {
      prisma.taxon.findUnique.mockResolvedValue(null);

      await expect(
        service.update('no-exist', { id: 'no-exist' }),
      ).rejects.toThrow(AppNotFoundException);
    });
  });

  // ─── remove ──────────────────────────────────────────────

  describe('remove', () => {
    it('should delete and return true', async () => {
      prisma.taxon.findUnique.mockResolvedValue(mockTaxon);
      prisma.taxon.delete.mockResolvedValue(mockTaxon);

      expect(await service.remove('txn-1')).toBe(true);
    });
  });

  // ─── hierarchy ───────────────────────────────────────────

  describe('getRootTaxons', () => {
    it('should return taxons without parent', async () => {
      prisma.taxon.findMany.mockResolvedValue([mockTaxon]);

      const result = await service.getRootTaxons('tax-1');
      expect(result).toHaveLength(1);
      expect(prisma.taxon.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: expect.objectContaining({ parent_id: null }) }),
      );
    });
  });

  describe('getChildren', () => {
    it('should return direct children', async () => {
      prisma.taxon.findMany.mockResolvedValue([{ ...mockTaxon, parent_id: 'txn-1' }]);

      const result = await service.getChildren('txn-1');
      expect(result).toHaveLength(1);
    });
  });

  describe('getAncestors', () => {
    it('should walk up the tree to root', async () => {
      const root = { id: 'root', parent: null };
      const mid = { id: 'mid', parent: root };
      const leaf = { id: 'leaf', parent: mid };

      prisma.taxon.findUnique
        .mockResolvedValueOnce(leaf)
        .mockResolvedValueOnce(mid)
        .mockResolvedValueOnce(root);

      const ancestors = await service.getAncestors('leaf');
      expect(ancestors).toHaveLength(2);
      expect(ancestors[0].id).toBe('root');
      expect(ancestors[1].id).toBe('mid');
    });

    it('should return empty for root taxon', async () => {
      prisma.taxon.findUnique.mockResolvedValue({ id: 'root', parent: null });

      const ancestors = await service.getAncestors('root');
      expect(ancestors).toEqual([]);
    });
  });

  describe('getDescendants', () => {
    it('should collect all descendants recursively', async () => {
      prisma.taxon.findMany
        .mockResolvedValueOnce([{ id: 'child-1' }])
        .mockResolvedValueOnce([]); // child-1 has no children

      const result = await service.getDescendants('txn-1');
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('child-1');
    });

    it('should return empty when no children', async () => {
      prisma.taxon.findMany.mockResolvedValue([]);

      const result = await service.getDescendants('txn-1');
      expect(result).toEqual([]);
    });
  });

  describe('getTree', () => {
    it('should return full tree from root', async () => {
      prisma.taxon.findMany.mockResolvedValue([mockTaxon]);

      const result = await service.getTree('tax-1');
      expect(result).toHaveLength(1);
    });
  });

  describe('getVisibleTaxons', () => {
    it('should return only navigable taxons', async () => {
      prisma.taxon.findMany.mockResolvedValue([mockTaxon]);

      const result = await service.getVisibleTaxons('tax-1');
      expect(result).toHaveLength(1);
      expect(prisma.taxon.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ hide_from_nav: false }),
        }),
      );
    });
  });

  // ─── product ↔ taxon ────────────────────────────────────

  describe('addProductToTaxon', () => {
    it('should create relation when not exists', async () => {
      const newRel = { id: 'pt-1', product_id: 'prod-1', taxon_id: 'txn-1' };
      prisma.productsTaxon.findFirst.mockResolvedValue(null);
      prisma.productsTaxon.create.mockResolvedValue(newRel);

      const result = await service.addProductToTaxon('prod-1', 'txn-1');
      expect(result).toEqual(newRel);
    });

    it('should return existing if idempotent', async () => {
      const existing = { id: 'pt-1' };
      prisma.productsTaxon.findFirst.mockResolvedValue(existing);

      const result = await service.addProductToTaxon('prod-1', 'txn-1');
      expect(result).toEqual(existing);
      expect(prisma.productsTaxon.create).not.toHaveBeenCalled();
    });
  });

  describe('removeProductFromTaxon', () => {
    it('should delete and return true', async () => {
      prisma.productsTaxon.findFirst.mockResolvedValue({ id: 'pt-1' });
      prisma.productsTaxon.delete.mockResolvedValue({});

      expect(await service.removeProductFromTaxon('prod-1', 'txn-1')).toBe(true);
    });

    it('should return false when not exists', async () => {
      prisma.productsTaxon.findFirst.mockResolvedValue(null);

      expect(await service.removeProductFromTaxon('prod-1', 'txn-1')).toBe(false);
    });
  });

  describe('getProductsByTaxon', () => {
    it('should return products for taxon', async () => {
      prisma.productsTaxon.findMany.mockResolvedValue([
        { product: { id: 'prod-1' } },
      ]);

      const result = await service.getProductsByTaxon('txn-1');
      expect(result).toHaveLength(1);
    });
  });

  describe('getTaxonsByProduct', () => {
    it('should return taxons for product', async () => {
      prisma.productsTaxon.findMany.mockResolvedValue([
        { taxon: mockTaxon },
      ]);

      const result = await service.getTaxonsByProduct('prod-1');
      expect(result).toHaveLength(1);
    });
  });

  describe('isProductInTaxon', () => {
    it('should return true when relation exists', async () => {
      prisma.productsTaxon.findFirst.mockResolvedValue({ id: 'pt-1' });

      expect(await service.isProductInTaxon('prod-1', 'txn-1')).toBe(true);
    });

    it('should return false when no relation', async () => {
      prisma.productsTaxon.findFirst.mockResolvedValue(null);

      expect(await service.isProductInTaxon('prod-1', 'txn-1')).toBe(false);
    });
  });

  describe('validateTaxonExists', () => {
    it('should return true', async () => {
      prisma.taxon.findUnique.mockResolvedValue({ id: 'txn-1' });

      expect(await service.validateTaxonExists('txn-1')).toBe(true);
    });

    it('should return false', async () => {
      prisma.taxon.findUnique.mockResolvedValue(null);

      expect(await service.validateTaxonExists('no')).toBe(false);
    });
  });
});
