import { Test, TestingModule } from '@nestjs/testing';
import { TaxResolver } from './tax.resolver';
import { TaxCategoryService } from './tax-category.service';
import { TaxRateService } from './tax-rate.service';
import { ZoneService } from './zone.service';

jest.mock('@thallesp/nestjs-better-auth', () => ({
  AllowAnonymous: () => () => {},
}));

const mockCategory = { id: 'tc1', name: 'IVA General', is_default: true };
const mockRate = { id: 'tr1', name: 'IVA 16%', amount: 0.16, zone_id: 'z1', tax_category_id: 'tc1' };
const mockZone = { id: 'z1', name: 'MX Zone', kind: 'state', zoneMembers: [] };
const mockMember = { id: 'zm1', zone_id: 'z1', zoneable_type: 'GeoState', zoneable_id: 's1' };

describe('TaxResolver', () => {
  let resolver: TaxResolver;
  let categoryService: Record<string, jest.Mock>;
  let rateService: Record<string, jest.Mock>;
  let zoneService: Record<string, jest.Mock>;

  beforeEach(async () => {
    categoryService = {
      findAll: jest.fn().mockResolvedValue([mockCategory]),
      findById: jest.fn().mockResolvedValue(mockCategory),
      findDefault: jest.fn().mockResolvedValue(mockCategory),
      create: jest.fn().mockResolvedValue(mockCategory),
      update: jest.fn().mockResolvedValue(mockCategory),
      remove: jest.fn().mockResolvedValue(true),
    };

    rateService = {
      findAll: jest.fn().mockResolvedValue([mockRate]),
      findById: jest.fn().mockResolvedValue(mockRate),
      findByZone: jest.fn().mockResolvedValue([mockRate]),
      findByCategory: jest.fn().mockResolvedValue([mockRate]),
      create: jest.fn().mockResolvedValue(mockRate),
      update: jest.fn().mockResolvedValue(mockRate),
      remove: jest.fn().mockResolvedValue(true),
    };

    zoneService = {
      findAll: jest.fn().mockResolvedValue([mockZone]),
      findById: jest.fn().mockResolvedValue(mockZone),
      getMembersByZone: jest.fn().mockResolvedValue([mockMember]),
      create: jest.fn().mockResolvedValue(mockZone),
      update: jest.fn().mockResolvedValue(mockZone),
      remove: jest.fn().mockResolvedValue(true),
      addMember: jest.fn().mockResolvedValue(mockMember),
      removeMember: jest.fn().mockResolvedValue(true),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaxResolver,
        { provide: TaxCategoryService, useValue: categoryService },
        { provide: TaxRateService, useValue: rateService },
        { provide: ZoneService, useValue: zoneService },
      ],
    }).compile();

    resolver = module.get<TaxResolver>(TaxResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  // ─── TaxCategory queries ────────────────────────────────

  describe('tax category queries', () => {
    it('findAllTaxCategories', async () => {
      expect(await resolver.findAllTaxCategories()).toEqual([mockCategory]);
    });

    it('findAllTaxCategories with filter', async () => {
      await resolver.findAllTaxCategories({ search: 'IVA' });
      expect(categoryService.findAll).toHaveBeenCalledWith({ search: 'IVA' });
    });

    it('findTaxCategory', async () => {
      expect(await resolver.findTaxCategory('tc1')).toEqual(mockCategory);
    });

    it('findDefaultTaxCategory', async () => {
      expect(await resolver.findDefaultTaxCategory()).toEqual(mockCategory);
    });
  });

  // ─── TaxCategory mutations ──────────────────────────────

  describe('tax category mutations', () => {
    it('createTaxCategory', async () => {
      const r = await resolver.createTaxCategory({ name: 'IVA', tax_code: 'IVA_16' });
      expect(r).toEqual(mockCategory);
    });

    it('updateTaxCategory', async () => {
      await resolver.updateTaxCategory({ id: 'tc1', name: 'Updated' });
      expect(categoryService.update).toHaveBeenCalledWith('tc1', expect.any(Object));
    });

    it('removeTaxCategory', async () => {
      expect(await resolver.removeTaxCategory('tc1')).toBe(true);
    });
  });

  // ─── TaxRate queries ─────────────────────────────────────

  describe('tax rate queries', () => {
    it('findAllTaxRates', async () => {
      expect(await resolver.findAllTaxRates()).toEqual([mockRate]);
    });

    it('findAllTaxRates with filter', async () => {
      await resolver.findAllTaxRates({ zone_id: 'z1' });
      expect(rateService.findAll).toHaveBeenCalledWith({ zone_id: 'z1' });
    });

    it('findTaxRate', async () => {
      expect(await resolver.findTaxRate('tr1')).toEqual(mockRate);
    });

    it('findTaxRatesByZone', async () => {
      expect(await resolver.findTaxRatesByZone('z1')).toEqual([mockRate]);
    });

    it('findTaxRatesByCategory', async () => {
      expect(await resolver.findTaxRatesByCategory('tc1')).toEqual([mockRate]);
    });
  });

  // ─── TaxRate mutations ───────────────────────────────────

  describe('tax rate mutations', () => {
    it('createTaxRate', async () => {
      const r = await resolver.createTaxRate({ amount: 0.16, name: 'IVA 16%' });
      expect(r).toEqual(mockRate);
    });

    it('updateTaxRate', async () => {
      await resolver.updateTaxRate({ id: 'tr1', name: 'Updated' });
      expect(rateService.update).toHaveBeenCalledWith('tr1', expect.any(Object));
    });

    it('removeTaxRate', async () => {
      expect(await resolver.removeTaxRate('tr1')).toBe(true);
    });
  });

  // ─── Zone queries ────────────────────────────────────────

  describe('zone queries', () => {
    it('findAllZones', async () => {
      expect(await resolver.findAllZones()).toEqual([mockZone]);
    });

    it('findAllZones with filter', async () => {
      await resolver.findAllZones({ kind: 'state' });
      expect(zoneService.findAll).toHaveBeenCalledWith({ kind: 'state' });
    });

    it('findZone', async () => {
      expect(await resolver.findZone('z1')).toEqual(mockZone);
    });

    it('findZoneMembers', async () => {
      expect(await resolver.findZoneMembers('z1')).toEqual([mockMember]);
    });
  });

  // ─── Zone mutations ──────────────────────────────────────

  describe('zone mutations', () => {
    it('createTaxZone', async () => {
      const r = await resolver.createTaxZone({ name: 'New Zone' });
      expect(r).toEqual(mockZone);
    });

    it('updateTaxZone', async () => {
      await resolver.updateTaxZone({ id: 'z1', name: 'Updated' });
      expect(zoneService.update).toHaveBeenCalledWith('z1', expect.any(Object));
    });

    it('removeTaxZone', async () => {
      expect(await resolver.removeTaxZone('z1')).toBe(true);
    });

    it('addTaxZoneMember', async () => {
      const r = await resolver.addTaxZoneMember({
        zone_id: 'z1',
        zoneable_type: 'GeoState',
        zoneable_id: 's1',
      });
      expect(r).toEqual(mockMember);
    });

    it('removeTaxZoneMember', async () => {
      expect(await resolver.removeTaxZoneMember('zm1')).toBe(true);
    });
  });
});
