import { Test, TestingModule } from '@nestjs/testing';
import { CatalogResolver } from './catalog.resolver';
import { TaxonomyService } from './taxonomy.service';
import { TaxonService } from './taxon.service';
import { PropertyService } from './property.service';
import { PrototypeService } from './prototype.service';

jest.mock('@thallesp/nestjs-better-auth', () => ({
  AllowAnonymous: () => () => {},
}));

const mockTaxonomy = { id: 'tax-1', name: 'Cat', taxons: [] };
const mockTaxon = { id: 'txn-1', name: 'Sub' };
const mockProperty = { id: 'prop-1', name: 'Color' };
const mockPP = { id: 'pp-1', value: 'Rojo', property: mockProperty };
const mockPrototype = { id: 'proto-1', name: 'Template' };
const mockPT = { id: 'pt-1' };

describe('CatalogResolver', () => {
  let resolver: CatalogResolver;
  let taxonomyService: Record<string, jest.Mock>;
  let taxonService: Record<string, jest.Mock>;
  let propertyService: Record<string, jest.Mock>;
  let prototypeService: Record<string, jest.Mock>;

  beforeEach(async () => {
    taxonomyService = {
      create: jest.fn().mockResolvedValue(mockTaxonomy),
      findAll: jest.fn().mockResolvedValue([mockTaxonomy]),
      findOne: jest.fn().mockResolvedValue(mockTaxonomy),
      findByStore: jest.fn().mockResolvedValue([mockTaxonomy]),
      update: jest.fn().mockResolvedValue(mockTaxonomy),
      remove: jest.fn().mockResolvedValue(true),
    };

    taxonService = {
      create: jest.fn().mockResolvedValue(mockTaxon),
      findById: jest.fn().mockResolvedValue(mockTaxon),
      findByTaxonomy: jest.fn().mockResolvedValue([mockTaxon]),
      getTree: jest.fn().mockResolvedValue([mockTaxon]),
      getChildren: jest.fn().mockResolvedValue([mockTaxon]),
      getAncestors: jest.fn().mockResolvedValue([mockTaxon]),
      getDescendants: jest.fn().mockResolvedValue([mockTaxon]),
      getVisibleTaxons: jest.fn().mockResolvedValue([mockTaxon]),
      update: jest.fn().mockResolvedValue(mockTaxon),
      remove: jest.fn().mockResolvedValue(true),
      addProductToTaxon: jest.fn().mockResolvedValue(mockPT),
      removeProductFromTaxon: jest.fn().mockResolvedValue(true),
      getTaxonsByProduct: jest.fn().mockResolvedValue([mockTaxon]),
      isProductInTaxon: jest.fn().mockResolvedValue(true),
    };

    propertyService = {
      create: jest.fn().mockResolvedValue(mockProperty),
      findAll: jest.fn().mockResolvedValue([mockProperty]),
      findById: jest.fn().mockResolvedValue(mockProperty),
      getFilterableProperties: jest.fn().mockResolvedValue([mockProperty]),
      update: jest.fn().mockResolvedValue(mockProperty),
      remove: jest.fn().mockResolvedValue(true),
      createProductProperty: jest.fn().mockResolvedValue(mockPP),
      getPropertiesByProduct: jest.fn().mockResolvedValue([mockPP]),
      getVisiblePropertiesByProduct: jest.fn().mockResolvedValue([mockPP]),
      updateProductProperty: jest.fn().mockResolvedValue(mockPP),
      removeProductProperty: jest.fn().mockResolvedValue(true),
    };

    prototypeService = {
      create: jest.fn().mockResolvedValue(mockPrototype),
      findAll: jest.fn().mockResolvedValue([mockPrototype]),
      findById: jest.fn().mockResolvedValue(mockPrototype),
      update: jest.fn().mockResolvedValue(mockPrototype),
      remove: jest.fn().mockResolvedValue(true),
      addPropertyToPrototype: jest.fn().mockResolvedValue({ id: 'pp-1' }),
      removePropertyFromPrototype: jest.fn().mockResolvedValue(true),
      getPropertiesByPrototype: jest.fn().mockResolvedValue([mockProperty]),
      addOptionTypeToPrototype: jest.fn().mockResolvedValue({ id: 'otp-1' }),
      removeOptionTypeFromPrototype: jest.fn().mockResolvedValue(true),
      getOptionTypesByPrototype: jest.fn().mockResolvedValue([]),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CatalogResolver,
        { provide: TaxonomyService, useValue: taxonomyService },
        { provide: TaxonService, useValue: taxonService },
        { provide: PropertyService, useValue: propertyService },
        { provide: PrototypeService, useValue: prototypeService },
      ],
    }).compile();

    resolver = module.get<CatalogResolver>(CatalogResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  // ─── Taxonomy ────────────────────────────────────────────

  describe('taxonomy operations', () => {
    it('createTaxonomy', async () => {
      const r = await resolver.createTaxonomy({ name: 'Cat' } as any);
      expect(r).toEqual(mockTaxonomy);
    });

    it('findAllTaxonomies', async () => {
      expect(await resolver.findAllTaxonomies()).toEqual([mockTaxonomy]);
    });

    it('findTaxonomy', async () => {
      expect(await resolver.findTaxonomy('tax-1')).toEqual(mockTaxonomy);
    });

    it('findTaxonomiesByStore', async () => {
      expect(await resolver.findTaxonomiesByStore('store-1')).toEqual([mockTaxonomy]);
    });

    it('updateTaxonomy', async () => {
      await resolver.updateTaxonomy({ id: 'tax-1', name: 'Up' } as any);
      expect(taxonomyService.update).toHaveBeenCalledWith('tax-1', expect.any(Object));
    });

    it('removeTaxonomy', async () => {
      expect(await resolver.removeTaxonomy('tax-1')).toBe(true);
    });
  });

  // ─── Taxon ──────────────────────────────────────────────

  describe('taxon operations', () => {
    it('createTaxon', async () => {
      expect(await resolver.createTaxon({ name: 'Sub' } as any)).toEqual(mockTaxon);
    });

    it('findTaxon', async () => {
      expect(await resolver.findTaxon('txn-1')).toEqual(mockTaxon);
    });

    it('findTaxonsByTaxonomy', async () => {
      expect(await resolver.findTaxonsByTaxonomy('tax-1')).toEqual([mockTaxon]);
    });

    it('findTaxonTree', async () => {
      expect(await resolver.findTaxonTree('tax-1')).toEqual([mockTaxon]);
    });

    it('findTaxonChildren', async () => {
      expect(await resolver.findTaxonChildren('txn-1')).toEqual([mockTaxon]);
    });

    it('findTaxonAncestors', async () => {
      expect(await resolver.findTaxonAncestors('txn-1')).toEqual([mockTaxon]);
    });

    it('findTaxonDescendants', async () => {
      expect(await resolver.findTaxonDescendants('txn-1')).toEqual([mockTaxon]);
    });

    it('findVisibleTaxons', async () => {
      expect(await resolver.findVisibleTaxons('tax-1')).toEqual([mockTaxon]);
    });

    it('updateTaxon', async () => {
      await resolver.updateTaxon({ id: 'txn-1', name: 'Up' } as any);
      expect(taxonService.update).toHaveBeenCalled();
    });

    it('removeTaxon', async () => {
      expect(await resolver.removeTaxon('txn-1')).toBe(true);
    });
  });

  // ─── Product ↔ Taxon ───────────────────────────────────

  describe('product-taxon operations', () => {
    it('addProductToTaxon', async () => {
      const r = await resolver.addProductToTaxon('prod-1', 'txn-1');
      expect(r).toEqual(mockPT);
    });

    it('removeProductFromTaxon', async () => {
      expect(await resolver.removeProductFromTaxon('prod-1', 'txn-1')).toBe(true);
    });

    it('findTaxonsByProduct', async () => {
      expect(await resolver.findTaxonsByProduct('prod-1')).toEqual([mockTaxon]);
    });

    it('isProductInTaxon', async () => {
      expect(await resolver.isProductInTaxon('prod-1', 'txn-1')).toBe(true);
    });
  });

  // ─── Property ───────────────────────────────────────────

  describe('property operations', () => {
    it('createProperty', async () => {
      expect(await resolver.createProperty({ presentation: 'Color' } as any)).toEqual(
        mockProperty,
      );
    });

    it('findAllProperties', async () => {
      expect(await resolver.findAllProperties()).toEqual([mockProperty]);
    });

    it('findProperty', async () => {
      expect(await resolver.findProperty('prop-1')).toEqual(mockProperty);
    });

    it('findFilterableProperties', async () => {
      expect(await resolver.findFilterableProperties()).toEqual([mockProperty]);
    });

    it('updateProperty', async () => {
      await resolver.updateProperty({ id: 'prop-1' } as any);
      expect(propertyService.update).toHaveBeenCalled();
    });

    it('removeProperty', async () => {
      expect(await resolver.removeProperty('prop-1')).toBe(true);
    });
  });

  // ─── Product ↔ Property ────────────────────────────────

  describe('product-property operations', () => {
    it('createProductProperty', async () => {
      expect(
        await resolver.createProductProperty({
          product_id: 'prod-1',
          property_id: 'prop-1',
        } as any),
      ).toEqual(mockPP);
    });

    it('findPropertiesByProduct', async () => {
      expect(await resolver.findPropertiesByProduct('prod-1')).toEqual([mockPP]);
    });

    it('findVisiblePropertiesByProduct', async () => {
      expect(await resolver.findVisiblePropertiesByProduct('prod-1')).toEqual([mockPP]);
    });

    it('updateProductProperty', async () => {
      await resolver.updateProductProperty({ id: 'pp-1' } as any);
      expect(propertyService.updateProductProperty).toHaveBeenCalled();
    });

    it('removeProductProperty', async () => {
      expect(await resolver.removeProductProperty('pp-1')).toBe(true);
    });
  });

  // ─── Prototype ──────────────────────────────────────────

  describe('prototype operations', () => {
    it('createPrototype', async () => {
      expect(await resolver.createPrototype({ name: 'T' } as any)).toEqual(mockPrototype);
    });

    it('findAllPrototypes', async () => {
      expect(await resolver.findAllPrototypes()).toEqual([mockPrototype]);
    });

    it('findPrototype', async () => {
      expect(await resolver.findPrototype('proto-1')).toEqual(mockPrototype);
    });

    it('updatePrototype', async () => {
      await resolver.updatePrototype({ id: 'proto-1' } as any);
      expect(prototypeService.update).toHaveBeenCalled();
    });

    it('removePrototype', async () => {
      expect(await resolver.removePrototype('proto-1')).toBe(true);
    });
  });

  // ─── Prototype ↔ Property ─────────────────────────────

  describe('prototype-property operations', () => {
    it('addPropertyToPrototype', async () => {
      expect(await resolver.addPropertyToPrototype('proto-1', 'prop-1')).toBe(true);
    });

    it('removePropertyFromPrototype', async () => {
      expect(await resolver.removePropertyFromPrototype('proto-1', 'prop-1')).toBe(true);
    });

    it('findPropertiesByPrototype', async () => {
      expect(await resolver.findPropertiesByPrototype('proto-1')).toEqual([mockProperty]);
    });
  });

  // ─── Prototype ↔ OptionType ────────────────────────────

  describe('prototype-optionType operations', () => {
    it('addOptionTypeToPrototype', async () => {
      expect(await resolver.addOptionTypeToPrototype('proto-1', 'ot-1')).toBe(true);
    });

    it('removeOptionTypeFromPrototype', async () => {
      expect(await resolver.removeOptionTypeFromPrototype('proto-1', 'ot-1')).toBe(true);
    });

    it('findOptionTypesByPrototype', async () => {
      await resolver.findOptionTypesByPrototype('proto-1');
      expect(prototypeService.getOptionTypesByPrototype).toHaveBeenCalledWith('proto-1');
    });
  });
});
