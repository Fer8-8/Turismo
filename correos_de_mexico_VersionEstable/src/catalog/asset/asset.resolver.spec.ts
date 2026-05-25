import { Test, TestingModule } from '@nestjs/testing';
import { AssetResolver } from './asset.resolver';
import { AssetService } from './asset.service';
import { SlugService } from './slug.service';

jest.mock('@thallesp/nestjs-better-auth', () => ({
  AllowAnonymous: () => () => {},
}));

const mockAsset = {
  id: 'asset-1',
  attachment_file_name: 'photo.jpg',
  viewable_type: 'product',
  viewable_id: 'prod-1',
  position: 0,
};

const mockSlug = {
  id: 'slug-1',
  slug: 'mi-producto',
  sluggable_type: 'product',
  sluggable_id: 'prod-1',
  scope: 'store-1',
  is_primary: true,
};

describe('AssetResolver', () => {
  let resolver: AssetResolver;
  let assetService: Record<string, jest.Mock>;
  let slugService: Record<string, jest.Mock>;

  beforeEach(async () => {
    assetService = {
      create: jest.fn().mockResolvedValue(mockAsset),
      findById: jest.fn().mockResolvedValue(mockAsset),
      findAll: jest.fn().mockResolvedValue([mockAsset]),
      findByEntity: jest.fn().mockResolvedValue([mockAsset]),
      findPrimary: jest.fn().mockResolvedValue(mockAsset),
      update: jest.fn().mockResolvedValue({ ...mockAsset, alt: 'nuevo alt' }),
      softDelete: jest.fn().mockResolvedValue(true),
      restore: jest.fn().mockResolvedValue(true),
      hardDelete: jest.fn().mockResolvedValue(true),
      reorder: jest.fn().mockResolvedValue([mockAsset]),
      hasAssets: jest.fn().mockResolvedValue(true),
    };

    slugService = {
      create: jest.fn().mockResolvedValue(mockSlug),
      findBySlug: jest.fn().mockResolvedValue(mockSlug),
      findBySluggable: jest.fn().mockResolvedValue([mockSlug]),
      findPrimaryBySluggable: jest.fn().mockResolvedValue(mockSlug),
      update: jest.fn().mockResolvedValue({ ...mockSlug, slug: 'nuevo-slug' }),
      delete: jest.fn().mockResolvedValue(true),
      slugExists: jest.fn().mockResolvedValue(true),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AssetResolver,
        { provide: AssetService, useValue: assetService },
        { provide: SlugService, useValue: slugService },
      ],
    }).compile();

    resolver = module.get<AssetResolver>(AssetResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('asset queries and mutations', () => {
    it('findAssetsByEntity delegates the public entity gallery contract', async () => {
      await expect(
        resolver.findAssetsByEntity('product', 'prod-1'),
      ).resolves.toEqual([mockAsset]);
      expect(assetService.findByEntity).toHaveBeenCalledWith('product', 'prod-1');
    });

    it('findPrimaryAsset delegates primary image resolution', async () => {
      await expect(
        resolver.findPrimaryAsset('product', 'prod-1'),
      ).resolves.toEqual(mockAsset);
      expect(assetService.findPrimary).toHaveBeenCalledWith('product', 'prod-1');
    });

    it('updateAsset forwards id and input without resolver logic', async () => {
      const input = { id: 'asset-1', alt: 'nuevo alt' };

      await expect(resolver.updateAsset(input as any)).resolves.toEqual({
        ...mockAsset,
        alt: 'nuevo alt',
      });
      expect(assetService.update).toHaveBeenCalledWith('asset-1', input);
    });

    it('reorderAssets delegates ordered ids and entity scope', async () => {
      await expect(
        resolver.reorderAssets('product', 'prod-1', ['asset-1', 'asset-2']),
      ).resolves.toEqual([mockAsset]);
      expect(assetService.reorder).toHaveBeenCalledWith(
        'product',
        'prod-1',
        ['asset-1', 'asset-2'],
      );
    });

    it('entityHasAssets delegates boolean availability of assets', async () => {
      await expect(resolver.entityHasAssets('product', 'prod-1')).resolves.toBe(true);
      expect(assetService.hasAssets).toHaveBeenCalledWith('product', 'prod-1');
    });
  });

  describe('slug queries and mutations', () => {
    it('findBySlug forwards slug and scope for URL resolution', async () => {
      await expect(resolver.findBySlug('mi-producto', 'store-1')).resolves.toEqual(mockSlug);
      expect(slugService.findBySlug).toHaveBeenCalledWith('mi-producto', 'store-1');
    });

    it('findPrimarySlug delegates primary slug lookup', async () => {
      await expect(
        resolver.findPrimarySlug('product', 'prod-1'),
      ).resolves.toEqual(mockSlug);
      expect(slugService.findPrimaryBySluggable).toHaveBeenCalledWith(
        'product',
        'prod-1',
      );
    });

    it('updateSlug forwards id and input', async () => {
      const input = { id: 'slug-1', slug: 'nuevo-slug' };

      await expect(resolver.updateSlug(input as any)).resolves.toEqual({
        ...mockSlug,
        slug: 'nuevo-slug',
      });
      expect(slugService.update).toHaveBeenCalledWith('slug-1', input);
    });

    it('slugExists delegates uniqueness checks for UI/public flows', async () => {
      await expect(resolver.slugExists('mi-producto', 'store-1')).resolves.toBe(true);
      expect(slugService.slugExists).toHaveBeenCalledWith('mi-producto', 'store-1');
    });
  });
});