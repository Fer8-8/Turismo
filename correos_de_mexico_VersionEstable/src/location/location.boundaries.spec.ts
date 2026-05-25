import { GeographyFacade } from './geography/facades/geography.facade';
import { TaxFacade } from './tax/facades/tax.facade';
import { TaxCalculationService } from './tax/tax-calculation.service';
import { ZoneService } from './tax/zone.service';

/**
 * Boundary tests for the location domain.
 *
 * These tests verify the contract at the geography ↔ tax boundary:
 *   - GeographyFacade exposes only geographic operations (no fiscal methods)
 *   - TaxFacade exposes only fiscal operations (no geographic CRUD methods)
 *   - ZoneService.resolveZoneForState uses the stateId as an opaque ID reference,
 *     with no dependency on CountryService or GeoStateService
 *   - TaxCalculationService depends solely on TaxRateService + ZoneService;
 *     no geography services are needed
 */

describe('Location domain boundaries', () => {
  // ─── GeographyFacade API surface ─────────────────────────────────

  describe('GeographyFacade exposes no fiscal methods', () => {
    let facade: GeographyFacade;

    beforeEach(() => {
      const countryService = {
        findById: jest.fn(),
        findByIso: jest.fn(),
        findByIso3: jest.fn(),
        findAll: jest.fn(),
        validateCountryExists: jest.fn(),
        validateCountryExistsByIso: jest.fn(),
      };
      const stateService = {
        findById: jest.fn(),
        findByCountry: jest.fn(),
        findAll: jest.fn(),
        validateStateExists: jest.fn(),
        validateStateBelongsToCountry: jest.fn(),
      };
      facade = new GeographyFacade(countryService as any, stateService as any);
    });

    it('does not expose calculateLineTax', () => {
      expect((facade as any).calculateLineTax).toBeUndefined();
    });

    it('does not expose calculateOrderTax', () => {
      expect((facade as any).calculateOrderTax).toBeUndefined();
    });

    it('does not expose getRatesByZone', () => {
      expect((facade as any).getRatesByZone).toBeUndefined();
    });

    it('does not expose resolveZoneForState', () => {
      expect((facade as any).resolveZoneForState).toBeUndefined();
    });
  });

  // ─── TaxFacade API surface ────────────────────────────────────────

  describe('TaxFacade exposes no geographic CRUD methods', () => {
    let facade: TaxFacade;

    beforeEach(() => {
      const categoryService = {
        findById: jest.fn(),
        findAll: jest.fn(),
        findDefault: jest.fn(),
        findByTaxCode: jest.fn(),
        validateExists: jest.fn(),
      };
      const rateService = {
        findById: jest.fn(),
        findAll: jest.fn(),
        findByZone: jest.fn(),
        findByCategory: jest.fn(),
        findByCategoryAndZone: jest.fn(),
      };
      const zoneService = {
        findById: jest.fn(),
        resolveZoneForState: jest.fn(),
        validateExists: jest.fn(),
      };
      const calcService = {
        calculateLineTax: jest.fn(),
        calculateShippingTax: jest.fn(),
        calculateOrderTax: jest.fn(),
      };
      facade = new TaxFacade(
        categoryService as any,
        rateService as any,
        zoneService as any,
        calcService as any,
      );
    });

    it('does not expose getCountryById', () => {
      expect((facade as any).getCountryById).toBeUndefined();
    });

    it('does not expose getStateById', () => {
      expect((facade as any).getStateById).toBeUndefined();
    });

    it('does not expose validateStateBelongsToCountry', () => {
      expect((facade as any).validateStateBelongsToCountry).toBeUndefined();
    });

    it('does not expose listStatesByCountry', () => {
      expect((facade as any).listStatesByCountry).toBeUndefined();
    });
  });

  // ─── ZoneService: state as opaque ID reference ───────────────────

  describe('ZoneService uses stateId as opaque ID — no geography dependency', () => {
    let prisma: { zoneMember: Record<string, jest.Mock>; zone: Record<string, jest.Mock> };
    let service: ZoneService;

    beforeEach(() => {
      prisma = {
        zoneMember: { findFirst: jest.fn().mockResolvedValue(null) },
        zone: { findFirst: jest.fn().mockResolvedValue(null) },
      };
      service = new ZoneService(prisma as any);
    });

    it('queries ZoneMember with stateId as opaque key, no geography service needed', async () => {
      await service.resolveZoneForState('geo-state-uuid');
      const call = prisma.zoneMember.findFirst.mock.calls[0][0];
      expect(call.where.zoneable_type).toBe('GeoState');
      expect(call.where.zoneable_id).toBe('geo-state-uuid');
    });

    it('falls back to default_tax zone without any geography service', async () => {
      const defaultZone = { id: 'z-default', name: 'Default', default_tax: true };
      prisma.zone.findFirst.mockResolvedValue(defaultZone);
      const result = await service.resolveZoneForState('unregistered-state');
      expect(result).toEqual(defaultZone);
    });
  });

  // ─── TaxCalculationService has no geography dependency ───────────

  describe('TaxCalculationService depends only on TaxRateService + ZoneService', () => {
    let rateService: { findByCategoryAndZone: jest.Mock };
    let zoneService: { resolveZoneForState: jest.Mock };

    beforeEach(() => {
      rateService = {
        findByCategoryAndZone: jest.fn().mockResolvedValue([
          { id: 'tr1', amount: 0.16, name: 'IVA', included_in_price: false },
        ]),
      };
      zoneService = {
        resolveZoneForState: jest.fn().mockResolvedValue({ id: 'z1' }),
      };
    });

    it('calculateLineTax resolves zone through ZoneService without geography services', async () => {
      const calc = new TaxCalculationService(rateService as any, zoneService as any);
      const result = await calc.calculateLineTax(100, 'tc1', 's1');
      expect(zoneService.resolveZoneForState).toHaveBeenCalledWith('s1');
      expect(result.additional_tax).toBe(16);
    });

    it('calculateShippingTax routes state resolution through ZoneService only', async () => {
      const calc = new TaxCalculationService(rateService as any, zoneService as any);
      const result = await calc.calculateShippingTax(50, 'tc-ship', 's1');
      expect(zoneService.resolveZoneForState).toHaveBeenCalledWith('s1');
      expect(result.additional_tax).toBe(8);
    });
  });
});
