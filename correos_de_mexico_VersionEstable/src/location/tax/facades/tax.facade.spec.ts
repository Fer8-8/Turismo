import { Test, TestingModule } from '@nestjs/testing';
import { TaxFacade } from './tax.facade';
import { TaxCategoryService } from '../tax-category.service';
import { TaxRateService } from '../tax-rate.service';
import { ZoneService } from '../zone.service';
import { TaxCalculationService } from '../tax-calculation.service';

const mockCategory = { id: 'tc1', name: 'IVA General' };
const mockRate = { id: 'tr1', name: 'IVA 16%', amount: 0.16 };
const mockZone = { id: 'z1', name: 'MX Zone' };
const mockCalc = { additional_tax: 16, included_tax: 0, taxable_amount: 100, rate_amount: 0.16, included_in_price: false };
const mockOrderResult = {
  additional_tax_total: 16,
  included_tax_total: 0,
  line_items_tax: 16,
  shipment_tax: 0,
  breakdown: [mockCalc],
};

describe('TaxFacade', () => {
  let facade: TaxFacade;
  let categoryService: Record<string, jest.Mock>;
  let rateService: Record<string, jest.Mock>;
  let zoneService: Record<string, jest.Mock>;
  let calcService: Record<string, jest.Mock>;

  beforeEach(async () => {
    categoryService = {
      findById: jest.fn().mockResolvedValue(mockCategory),
      findAll: jest.fn().mockResolvedValue([mockCategory]),
      findDefault: jest.fn().mockResolvedValue(mockCategory),
      findByTaxCode: jest.fn().mockResolvedValue(mockCategory),
      validateExists: jest.fn().mockResolvedValue(true),
    };

    rateService = {
      findById: jest.fn().mockResolvedValue(mockRate),
      findAll: jest.fn().mockResolvedValue([mockRate]),
      findByZone: jest.fn().mockResolvedValue([mockRate]),
      findByCategory: jest.fn().mockResolvedValue([mockRate]),
      findByCategoryAndZone: jest.fn().mockResolvedValue([mockRate]),
    };

    zoneService = {
      findById: jest.fn().mockResolvedValue(mockZone),
      resolveZoneForState: jest.fn().mockResolvedValue(mockZone),
      validateExists: jest.fn().mockResolvedValue(true),
    };

    calcService = {
      calculateLineTax: jest.fn().mockResolvedValue(mockCalc),
      calculateShippingTax: jest.fn().mockResolvedValue(mockCalc),
      calculateOrderTax: jest.fn().mockResolvedValue(mockOrderResult),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaxFacade,
        { provide: TaxCategoryService, useValue: categoryService },
        { provide: TaxRateService, useValue: rateService },
        { provide: ZoneService, useValue: zoneService },
        { provide: TaxCalculationService, useValue: calcService },
      ],
    }).compile();

    facade = module.get<TaxFacade>(TaxFacade);
  });

  it('should be defined', () => {
    expect(facade).toBeDefined();
  });

  // ─── Categories ──────────────────────────────────────────

  describe('category delegations', () => {
    it('getCategoryById', async () => {
      expect(await facade.getCategoryById('tc1')).toEqual(mockCategory);
      expect(categoryService.findById).toHaveBeenCalledWith('tc1');
    });

    it('listCategories', async () => {
      expect(await facade.listCategories()).toEqual([mockCategory]);
    });

    it('getDefaultCategory', async () => {
      expect(await facade.getDefaultCategory()).toEqual(mockCategory);
    });

    it('getCategoryByTaxCode', async () => {
      expect(await facade.getCategoryByTaxCode('IVA_16')).toEqual(mockCategory);
      expect(categoryService.findByTaxCode).toHaveBeenCalledWith('IVA_16');
    });

    it('validateCategoryExists', async () => {
      expect(await facade.validateCategoryExists('tc1')).toBe(true);
    });
  });

  // ─── Rates ──────────────────────────────────────────────

  describe('rate delegations', () => {
    it('getRateById', async () => {
      expect(await facade.getRateById('tr1')).toEqual(mockRate);
    });

    it('listRates', async () => {
      expect(await facade.listRates()).toEqual([mockRate]);
    });

    it('getRatesByZone', async () => {
      expect(await facade.getRatesByZone('z1')).toEqual([mockRate]);
    });

    it('getRatesByCategory', async () => {
      expect(await facade.getRatesByCategory('tc1')).toEqual([mockRate]);
    });

    it('getRatesByCategoryAndZone', async () => {
      expect(await facade.getRatesByCategoryAndZone('tc1', 'z1')).toEqual([mockRate]);
      expect(rateService.findByCategoryAndZone).toHaveBeenCalledWith('tc1', 'z1');
    });
  });

  // ─── Zones ──────────────────────────────────────────────

  describe('zone delegations', () => {
    it('getZoneById', async () => {
      expect(await facade.getZoneById('z1')).toEqual(mockZone);
    });

    it('resolveZoneForState', async () => {
      expect(await facade.resolveZoneForState('s1')).toEqual(mockZone);
      expect(zoneService.resolveZoneForState).toHaveBeenCalledWith('s1');
    });

    it('validateZoneExists', async () => {
      expect(await facade.validateZoneExists('z1')).toBe(true);
    });
  });

  // ─── Calculations ──────────────────────────────────────

  describe('calculation delegations', () => {
    it('calculateLineTax', async () => {
      const r = await facade.calculateLineTax(100, 'tc1', 's1', 'z1');
      expect(r).toEqual(mockCalc);
      expect(calcService.calculateLineTax).toHaveBeenCalledWith(100, 'tc1', 's1', 'z1');
    });

    it('calculateShippingTax', async () => {
      const r = await facade.calculateShippingTax(50, 'tc1', 's1');
      expect(r).toEqual(mockCalc);
    });

    it('calculateOrderTax', async () => {
      const input = { line_items: [{ amount: 100, tax_category_id: 'tc1' }], state_id: 's1' };
      const r = await facade.calculateOrderTax(input);
      expect(r).toEqual(mockOrderResult);
      expect(calcService.calculateOrderTax).toHaveBeenCalledWith(input);
    });
  });
});
