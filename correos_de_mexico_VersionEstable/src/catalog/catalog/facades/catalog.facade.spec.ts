import { Test, TestingModule } from '@nestjs/testing';
import { CatalogFacade } from './catalog.facade';
import { TaxonomyService } from '../taxonomy.service';
import { TaxonService } from '../taxon.service';
import { PropertyService } from '../property.service';
import { PrototypeService } from '../prototype.service';

const mockTaxonomy = { id: 'tax-1', name: 'Cat' };
const mockTaxon = { id: 'txn-1', name: 'Sub' };
const mockProperty = { id: 'prop-1', name: 'Color' };
const mockPrototype = { id: 'proto-1', name: 'Template' };

describe('CatalogFacade', () => {
  let facade: CatalogFacade;
  let taxonomyService: Record<string, jest.Mock>;
  let taxonService: Record<string, jest.Mock>;
  let propertyService: Record<string, jest.Mock>;
  let prototypeService: Record<string, jest.Mock>;

  beforeEach(async () => {
    taxonomyService = {
      findOne: jest.fn().mockResolvedValue(mockTaxonomy),
      findAll: jest.fn().mockResolvedValue([mockTaxonomy]),
      findByStore: jest.fn().mockResolvedValue([mockTaxonomy]),
      validateTaxonomyExists: jest.fn().mockResolvedValue(true),
    };

    taxonService = {
      findById: jest.fn().mockResolvedValue(mockTaxon),
      findByTaxonomy: jest.fn().mockResolvedValue([mockTaxon]),
      getTree: jest.fn().mockResolvedValue([mockTaxon]),
      getVisibleTaxons: jest.fn().mockResolvedValue([mockTaxon]),
      validateTaxonExists: jest.fn().mockResolvedValue(true),
      getProductsByTaxon: jest.fn().mockResolvedValue([]),
      getTaxonsByProduct: jest.fn().mockResolvedValue([mockTaxon]),
      isProductInTaxon: jest.fn().mockResolvedValue(true),
    };

    propertyService = {
      getPropertiesByProduct: jest.fn().mockResolvedValue([]),
      getVisiblePropertiesByProduct: jest.fn().mockResolvedValue([]),
      getFilterableProperties: jest.fn().mockResolvedValue([mockProperty]),
      validatePropertyExists: jest.fn().mockResolvedValue(true),
    };

    prototypeService = {
      findById: jest.fn().mockResolvedValue(mockPrototype),
      getPropertiesByPrototype: jest.fn().mockResolvedValue([mockProperty]),
      getOptionTypesByPrototype: jest.fn().mockResolvedValue([]),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CatalogFacade,
        { provide: TaxonomyService, useValue: taxonomyService },
        { provide: TaxonService, useValue: taxonService },
        { provide: PropertyService, useValue: propertyService },
        { provide: PrototypeService, useValue: prototypeService },
      ],
    }).compile();

    facade = module.get<CatalogFacade>(CatalogFacade);
  });

  it('should be defined', () => {
    expect(facade).toBeDefined();
  });

  describe('taxonomy delegations', () => {
    it('getTaxonomyById', async () => {
      const r = await facade.getTaxonomyById('tax-1');
      expect(taxonomyService.findOne).toHaveBeenCalledWith('tax-1');
      expect(r).toEqual(mockTaxonomy);
    });

    it('getTaxonomies', async () => {
      expect(await facade.getTaxonomies()).toEqual([mockTaxonomy]);
    });

    it('getTaxonomiesByStore', async () => {
      expect(await facade.getTaxonomiesByStore('store-1')).toEqual([mockTaxonomy]);
    });

    it('validateTaxonomyExists', async () => {
      expect(await facade.validateTaxonomyExists('tax-1')).toBe(true);
    });
  });

  describe('taxon delegations', () => {
    it('getTaxonById', async () => {
      expect(await facade.getTaxonById('txn-1')).toEqual(mockTaxon);
    });

    it('getTaxonsByTaxonomy', async () => {
      expect(await facade.getTaxonsByTaxonomy('tax-1')).toEqual([mockTaxon]);
    });

    it('getTaxonTree', async () => {
      expect(await facade.getTaxonTree('tax-1')).toEqual([mockTaxon]);
    });

    it('getVisibleTaxons', async () => {
      expect(await facade.getVisibleTaxons('tax-1')).toEqual([mockTaxon]);
    });

    it('validateTaxonExists', async () => {
      expect(await facade.validateTaxonExists('txn-1')).toBe(true);
    });
  });

  describe('product-taxon delegations', () => {
    it('getProductsByTaxon', async () => {
      await facade.getProductsByTaxon('txn-1');
      expect(taxonService.getProductsByTaxon).toHaveBeenCalledWith('txn-1');
    });

    it('getTaxonsByProduct', async () => {
      expect(await facade.getTaxonsByProduct('prod-1')).toEqual([mockTaxon]);
    });

    it('isProductInTaxon', async () => {
      expect(await facade.isProductInTaxon('prod-1', 'txn-1')).toBe(true);
    });
  });

  describe('property delegations', () => {
    it('getPropertiesByProduct', async () => {
      await facade.getPropertiesByProduct('prod-1');
      expect(propertyService.getPropertiesByProduct).toHaveBeenCalledWith('prod-1');
    });

    it('getVisiblePropertiesByProduct', async () => {
      await facade.getVisiblePropertiesByProduct('prod-1');
      expect(propertyService.getVisiblePropertiesByProduct).toHaveBeenCalledWith('prod-1');
    });

    it('getFilterableProperties', async () => {
      expect(await facade.getFilterableProperties()).toEqual([mockProperty]);
    });

    it('validatePropertyExists', async () => {
      expect(await facade.validatePropertyExists('prop-1')).toBe(true);
    });
  });

  describe('prototype delegations', () => {
    it('getPrototypeById', async () => {
      expect(await facade.getPrototypeById('proto-1')).toEqual(mockPrototype);
    });

    it('getPropertiesByPrototype', async () => {
      expect(await facade.getPropertiesByPrototype('proto-1')).toEqual([mockProperty]);
    });

    it('getOptionTypesByPrototype', async () => {
      await facade.getOptionTypesByPrototype('proto-1');
      expect(prototypeService.getOptionTypesByPrototype).toHaveBeenCalledWith('proto-1');
    });
  });
});
