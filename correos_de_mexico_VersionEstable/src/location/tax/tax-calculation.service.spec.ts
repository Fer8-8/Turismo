import { Test, TestingModule } from '@nestjs/testing';
import { TaxCalculationService } from './tax-calculation.service';
import { TaxRateService } from './tax-rate.service';
import { ZoneService } from './zone.service';

const mockRate = {
  id: 'tr1',
  amount: 0.16,
  name: 'IVA 16%',
  included_in_price: false,
  show_rate_in_label: true,
};

const mockRateIncluded = {
  ...mockRate,
  id: 'tr2',
  name: 'IVA Incluido',
  included_in_price: true,
};

const mockZone = { id: 'z1', name: 'MX Zone' };

describe('TaxCalculationService', () => {
  let service: TaxCalculationService;
  let rateService: Record<string, jest.Mock>;
  let zoneService: Record<string, jest.Mock>;

  beforeEach(async () => {
    rateService = {
      findByCategoryAndZone: jest.fn().mockResolvedValue([mockRate]),
    };

    zoneService = {
      resolveZoneForState: jest.fn().mockResolvedValue(mockZone),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaxCalculationService,
        { provide: TaxRateService, useValue: rateService },
        { provide: ZoneService, useValue: zoneService },
      ],
    }).compile();

    service = module.get<TaxCalculationService>(TaxCalculationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // ─── calculateTax ────────────────────────────────────────

  describe('calculateTax', () => {
    it('returns zero tax when no category or zone', async () => {
      const r = await service.calculateTax(100);
      expect(r.additional_tax).toBe(0);
      expect(r.included_tax).toBe(0);
      expect(r.taxable_amount).toBe(100);
    });

    it('returns zero tax when no rates found', async () => {
      rateService.findByCategoryAndZone.mockResolvedValue([]);
      const r = await service.calculateTax(100, 'tc1', 'z1');
      expect(r.additional_tax).toBe(0);
    });

    it('calculates additional tax (not included in price)', async () => {
      const r = await service.calculateTax(100, 'tc1', 'z1');
      expect(r.additional_tax).toBe(16);
      expect(r.included_tax).toBe(0);
      expect(r.taxable_amount).toBe(100);
      expect(r.included_in_price).toBe(false);
      expect(r.rate_name).toBe('IVA 16%');
    });

    it('calculates included tax (included in price)', async () => {
      rateService.findByCategoryAndZone.mockResolvedValue([mockRateIncluded]);
      const r = await service.calculateTax(116, 'tc1', 'z1');
      expect(r.additional_tax).toBe(0);
      expect(r.included_tax).toBe(16);
      expect(r.taxable_amount).toBe(100);
      expect(r.included_in_price).toBe(true);
    });

    it('returns all-zero result when amount is 0', async () => {
      const r = await service.calculateTax(0, 'tc1', 'z1');
      expect(r.additional_tax).toBe(0);
      expect(r.included_tax).toBe(0);
      expect(r.taxable_amount).toBe(0);
      expect(r.rate_amount).toBe(0.16);
    });
  });

  // ─── calculateLineTax ────────────────────────────────────

  describe('calculateLineTax', () => {
    it('resolves zone from stateId', async () => {
      const r = await service.calculateLineTax(100, 'tc1', 's1');
      expect(zoneService.resolveZoneForState).toHaveBeenCalledWith('s1');
      expect(r.additional_tax).toBe(16);
    });

    it('uses provided zoneId directly', async () => {
      const r = await service.calculateLineTax(100, 'tc1', undefined, 'z1');
      expect(zoneService.resolveZoneForState).not.toHaveBeenCalled();
      expect(r.additional_tax).toBe(16);
    });

    it('returns zero when no category', async () => {
      const r = await service.calculateLineTax(100, undefined, 's1');
      expect(r.additional_tax).toBe(0);
    });
  });

  // ─── calculateShippingTax ────────────────────────────────

  describe('calculateShippingTax', () => {
    it('calculates shipping tax', async () => {
      const r = await service.calculateShippingTax(50, 'tc1', 's1');
      expect(r.additional_tax).toBe(8);
      expect(r.taxable_amount).toBe(50);
    });
  });

  // ─── calculateOrderTax ──────────────────────────────────

  describe('calculateOrderTax', () => {
    it('sums line items and shipping taxes', async () => {
      const r = await service.calculateOrderTax({
        line_items: [
          { amount: 100, tax_category_id: 'tc1' },
          { amount: 200, tax_category_id: 'tc1' },
        ],
        shipment_amount: 50,
        shipment_tax_category_id: 'tc1',
        state_id: 's1',
      });

      expect(r.line_items_tax).toBe(48); // 16 + 32
      expect(r.shipment_tax).toBe(8);
      expect(r.additional_tax_total).toBe(56); // 48 + 8
      expect(r.included_tax_total).toBe(0);
      expect(r.breakdown).toHaveLength(3); // 2 lines + 1 shipping
    });

    it('handles order without shipping', async () => {
      const r = await service.calculateOrderTax({
        line_items: [{ amount: 100, tax_category_id: 'tc1' }],
        state_id: 's1',
      });

      expect(r.line_items_tax).toBe(16);
      expect(r.shipment_tax).toBe(0);
      expect(r.additional_tax_total).toBe(16);
      expect(r.breakdown).toHaveLength(1);
    });

    it('handles included-in-price rates for order', async () => {
      rateService.findByCategoryAndZone.mockResolvedValue([mockRateIncluded]);
      const r = await service.calculateOrderTax({
        line_items: [{ amount: 116, tax_category_id: 'tc1' }],
        state_id: 's1',
      });

      expect(r.additional_tax_total).toBe(0);
      expect(r.included_tax_total).toBe(16);
    });

    it('returns zero taxes for empty lines', async () => {
      const r = await service.calculateOrderTax({
        line_items: [],
        state_id: 's1',
      });

      expect(r.additional_tax_total).toBe(0);
      expect(r.line_items_tax).toBe(0);
      expect(r.breakdown).toHaveLength(0);
    });

    it('uses zone_id directly without calling resolveZoneForState', async () => {
      const r = await service.calculateOrderTax({
        line_items: [{ amount: 100, tax_category_id: 'tc1' }],
        zone_id: 'z1',
      });
      expect(zoneService.resolveZoneForState).not.toHaveBeenCalled();
      expect(r.line_items_tax).toBe(16);
    });

    it('includes zero-tax breakdown entries for lines without tax_category_id', async () => {
      const r = await service.calculateOrderTax({
        line_items: [
          { amount: 100, tax_category_id: 'tc1' }, // taxed
          { amount: 50 },                           // no category → zero tax
        ],
        state_id: 's1',
      });
      expect(r.line_items_tax).toBe(16);
      expect(r.additional_tax_total).toBe(16);
      expect(r.breakdown).toHaveLength(2);
      expect(r.breakdown[1].additional_tax).toBe(0);
      expect(r.breakdown[1].taxable_amount).toBe(50);
    });
  });
});
