import { Test, TestingModule } from '@nestjs/testing';
import { AssetService } from './asset.service';
import { PrismaService } from '../../prisma/prisma.service';
import { AssetKind } from './enums/asset-kind.enum';
import { AppNotFoundException } from '../../core/shared';

const mockAsset = {
  id: 'asset-1',
  attachment_file_name: 'photo.jpg',
  attachment_content_type: 'image/jpeg',
  attachment_file_size: 12345,
  attachment_width: 800,
  attachment_height: 600,
  alt: 'Una foto',
  position: 0,
  viewable_type: 'product',
  viewable_id: 'prod-1',
  type: 'image',
  deleted_at: null,
  attachment_updated_at: null,
  created_at: new Date(),
  updated_at: new Date(),
};

describe('AssetService', () => {
  let service: AssetService;
  let prisma: {
    asset: {
      create: jest.Mock;
      findFirst: jest.Mock;
      findUnique: jest.Mock;
      findMany: jest.Mock;
      update: jest.Mock;
      updateMany: jest.Mock;
      delete: jest.Mock;
      count: jest.Mock;
    };
    $transaction: jest.Mock;
  };

  beforeEach(async () => {
    prisma = {
      asset: {
        create: jest.fn(),
        findFirst: jest.fn(),
        findUnique: jest.fn(),
        findMany: jest.fn(),
        update: jest.fn(),
        updateMany: jest.fn(),
        delete: jest.fn(),
        count: jest.fn(),
      },
      $transaction: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AssetService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<AssetService>(AssetService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create an asset with all provided metadata', async () => {
      prisma.asset.create.mockResolvedValue(mockAsset);

      const result = await service.create({
        attachment_file_name: 'photo.jpg',
        attachment_content_type: 'image/jpeg',
        attachment_file_size: 12345,
        attachment_width: 800,
        attachment_height: 600,
        alt: 'Una foto',
        position: 0,
        viewable_type: 'product',
        viewable_id: 'prod-1',
        type: AssetKind.IMAGE,
      });

      expect(prisma.asset.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          attachment_file_name: 'photo.jpg',
          viewable_type: 'product',
          viewable_id: 'prod-1',
          position: 0,
        }),
      });
      expect(result).toEqual(mockAsset);
    });

    it('should default position to 0 when not provided', async () => {
      prisma.asset.create.mockResolvedValue(mockAsset);

      await service.create({ attachment_file_name: 'file.pdf' });

      expect(prisma.asset.create).toHaveBeenCalledWith({
        data: expect.objectContaining({ position: 0 }),
      });
    });
  });

  describe('findById', () => {
    it('should return the asset when found and not deleted', async () => {
      prisma.asset.findFirst.mockResolvedValue(mockAsset);

      const result = await service.findById('asset-1');
      expect(result).toEqual(mockAsset);
      expect(prisma.asset.findFirst).toHaveBeenCalledWith({
        where: { id: 'asset-1', deleted_at: null },
      });
    });

    it('should throw NotFoundException when asset is not found', async () => {
      prisma.asset.findFirst.mockResolvedValue(null);
      await expect(service.findById('bad-id')).rejects.toThrow(AppNotFoundException);
    });
  });

  describe('findByEntity', () => {
    it('should return assets for the entity ordered by position', async () => {
      prisma.asset.findMany.mockResolvedValue([mockAsset]);

      const result = await service.findByEntity('product', 'prod-1');

      expect(prisma.asset.findMany).toHaveBeenCalledWith({
        where: { viewable_type: 'product', viewable_id: 'prod-1', deleted_at: null },
        orderBy: { position: 'asc' },
      });
      expect(result).toHaveLength(1);
    });
  });

  describe('findPrimary', () => {
    it('should return the first asset by position', async () => {
      prisma.asset.findFirst.mockResolvedValue(mockAsset);

      const result = await service.findPrimary('product', 'prod-1');

      expect(prisma.asset.findFirst).toHaveBeenCalledWith({
        where: { viewable_type: 'product', viewable_id: 'prod-1', deleted_at: null },
        orderBy: { position: 'asc' },
      });
      expect(result).toEqual(mockAsset);
    });
  });

  describe('update', () => {
    it('should update asset metadata and set attachment_updated_at', async () => {
      prisma.asset.findFirst.mockResolvedValue(mockAsset);
      prisma.asset.update.mockResolvedValue({ ...mockAsset, alt: 'Nuevo alt' });

      const result = await service.update('asset-1', {
        id: 'asset-1',
        alt: 'Nuevo alt',
      });

      expect(prisma.asset.update).toHaveBeenCalledWith({
        where: { id: 'asset-1' },
        data: expect.objectContaining({
          alt: 'Nuevo alt',
          attachment_updated_at: expect.any(Date),
        }),
      });
      expect(result.alt).toBe('Nuevo alt');
    });

    it('should throw NotFoundException when asset does not exist', async () => {
      prisma.asset.findFirst.mockResolvedValue(null);
      await expect(service.update('bad-id', { id: 'bad-id' })).rejects.toThrow(AppNotFoundException);
    });
  });

  describe('softDelete', () => {
    it('should set deleted_at and return true', async () => {
      prisma.asset.findFirst.mockResolvedValue(mockAsset);
      prisma.asset.update.mockResolvedValue({ ...mockAsset, deleted_at: new Date() });

      expect(await service.softDelete('asset-1')).toBe(true);
      expect(prisma.asset.update).toHaveBeenCalledWith({
        where: { id: 'asset-1' },
        data: { deleted_at: expect.any(Date) },
      });
    });

    it('should throw NotFoundException when asset not found', async () => {
      prisma.asset.findFirst.mockResolvedValue(null);
      await expect(service.softDelete('bad-id')).rejects.toThrow(AppNotFoundException);
    });
  });

  describe('restore', () => {
    it('should clear deleted_at and return true', async () => {
      prisma.asset.findUnique.mockResolvedValue({ ...mockAsset, deleted_at: new Date() });
      prisma.asset.update.mockResolvedValue(mockAsset);

      expect(await service.restore('asset-1')).toBe(true);
      expect(prisma.asset.update).toHaveBeenCalledWith({
        where: { id: 'asset-1' },
        data: { deleted_at: null },
      });
    });

    it('should throw NotFoundException when asset not found', async () => {
      prisma.asset.findUnique.mockResolvedValue(null);
      await expect(service.restore('bad-id')).rejects.toThrow(AppNotFoundException);
    });
  });

  describe('hardDelete', () => {
    it('should permanently delete the asset and return true', async () => {
      prisma.asset.findUnique.mockResolvedValue(mockAsset);
      prisma.asset.delete.mockResolvedValue(mockAsset);

      expect(await service.hardDelete('asset-1')).toBe(true);
      expect(prisma.asset.delete).toHaveBeenCalledWith({ where: { id: 'asset-1' } });
    });

    it('should throw NotFoundException when asset not found', async () => {
      prisma.asset.findUnique.mockResolvedValue(null);
      await expect(service.hardDelete('bad-id')).rejects.toThrow(AppNotFoundException);
    });
  });

  describe('reorder', () => {
    it('should set position for each id in order and return updated list', async () => {
      prisma.asset.updateMany.mockResolvedValue({ count: 1 });
      prisma.$transaction.mockImplementation((ops: unknown[]) => Promise.all(ops));
      prisma.asset.findMany.mockResolvedValue([
        { ...mockAsset, id: 'asset-1', position: 0 },
        { ...mockAsset, id: 'asset-2', position: 1 },
      ]);

      const result = await service.reorder('product', 'prod-1', ['asset-1', 'asset-2']);

      expect(result).toHaveLength(2);
      expect(prisma.$transaction).toHaveBeenCalled();
    });
  });

  describe('hasAssets', () => {
    it('should return true when entity has active assets', async () => {
      prisma.asset.count.mockResolvedValue(3);
      expect(await service.hasAssets('product', 'prod-1')).toBe(true);
    });

    it('should return false when entity has no active assets', async () => {
      prisma.asset.count.mockResolvedValue(0);
      expect(await service.hasAssets('product', 'prod-1')).toBe(false);
    });
  });

  describe('validateAssetExists', () => {
    it('should return true when asset exists', async () => {
      prisma.asset.findFirst.mockResolvedValue(mockAsset);
      expect(await service.validateAssetExists('asset-1')).toBe(true);
    });

    it('should throw NotFoundException when asset not found', async () => {
      prisma.asset.findFirst.mockResolvedValue(null);
      await expect(service.validateAssetExists('bad-id')).rejects.toThrow(AppNotFoundException);
    });
  });
});
