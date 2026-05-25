import { AssetFacade } from './asset.facade';

describe('AssetFacade', () => {
  let facade: AssetFacade;
  let assetService: {
    findById: jest.Mock;
    findByEntity: jest.Mock;
    findPrimary: jest.Mock;
    create: jest.Mock;
    update: jest.Mock;
    hasAssets: jest.Mock;
    validateAssetExists: jest.Mock;
    reorder: jest.Mock;
  };
  let slugService: {
    create: jest.Mock;
    findBySlug: jest.Mock;
    findPrimaryBySluggable: jest.Mock;
    findBySluggable: jest.Mock;
    slugExists: jest.Mock;
  };

  beforeEach(() => {
    assetService = {
      findById: jest.fn(),
      findByEntity: jest.fn(),
      findPrimary: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      hasAssets: jest.fn(),
      validateAssetExists: jest.fn(),
      reorder: jest.fn(),
    };

    slugService = {
      create: jest.fn(),
      findBySlug: jest.fn(),
      findPrimaryBySluggable: jest.fn(),
      findBySluggable: jest.fn(),
      slugExists: jest.fn(),
    };

    facade = new AssetFacade(assetService as any, slugService as any);
  });

  it('delegates primary-asset lookup for cross-domain cover images', async () => {
    const asset = { id: 'asset-1', position: 0 };
    assetService.findPrimary.mockResolvedValue(asset);

    await expect(
      facade.getPrimaryAsset('product', 'prod-1'),
    ).resolves.toEqual(asset);
    expect(assetService.findPrimary).toHaveBeenCalledWith('product', 'prod-1');
  });

  it('delegates asset reordering preserving entity scope and ordered ids', async () => {
    const reordered = [
      { id: 'asset-1', position: 0 },
      { id: 'asset-2', position: 1 },
    ];
    assetService.reorder.mockResolvedValue(reordered);

    await expect(
      facade.reorderAssets('product', 'prod-1', ['asset-1', 'asset-2']),
    ).resolves.toEqual(reordered);
    expect(assetService.reorder).toHaveBeenCalledWith(
      'product',
      'prod-1',
      ['asset-1', 'asset-2'],
    );
  });

  it('delegates slug resolution with optional scope for public URLs', async () => {
    const slug = {
      id: 'slug-1',
      slug: 'mi-producto',
      sluggable_type: 'product',
      sluggable_id: 'prod-1',
      scope: 'store-1',
    };
    slugService.findBySlug.mockResolvedValue(slug);

    await expect(
      facade.resolveEntityBySlug('mi-producto', 'store-1'),
    ).resolves.toEqual(slug);
    expect(slugService.findBySlug).toHaveBeenCalledWith('mi-producto', 'store-1');
  });

  it('delegates primary slug lookup for an entity', async () => {
    const primarySlug = { id: 'slug-1', slug: 'mi-producto', is_primary: true };
    slugService.findPrimaryBySluggable.mockResolvedValue(primarySlug);

    await expect(
      facade.getPrimarySlug('product', 'prod-1'),
    ).resolves.toEqual(primarySlug);
    expect(slugService.findPrimaryBySluggable).toHaveBeenCalledWith(
      'product',
      'prod-1',
    );
  });
});