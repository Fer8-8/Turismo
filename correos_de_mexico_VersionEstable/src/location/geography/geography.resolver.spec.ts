import { Test, TestingModule } from '@nestjs/testing';
import { GeographyResolver } from './geography.resolver';
import { CountryService } from './country.service';
import { GeoStateService } from './state.service';

jest.mock('@thallesp/nestjs-better-auth', () => ({
  AllowAnonymous: () => () => {},
}));

const mockCountry = { id: 'c1', name: 'México', iso: 'MX', iso3: 'MEX' };
const mockState = { id: 's1', name: 'Jalisco', abbr: 'JAL', country_id: 'c1' };

describe('GeographyResolver', () => {
  let resolver: GeographyResolver;
  let countryService: Record<string, jest.Mock>;
  let stateService: Record<string, jest.Mock>;

  beforeEach(async () => {
    countryService = {
      findAll: jest.fn().mockResolvedValue([mockCountry]),
      findById: jest.fn().mockResolvedValue(mockCountry),
      findByIso: jest.fn().mockResolvedValue(mockCountry),
      findByIso3: jest.fn().mockResolvedValue(mockCountry),
      create: jest.fn().mockResolvedValue(mockCountry),
      update: jest.fn().mockResolvedValue(mockCountry),
      remove: jest.fn().mockResolvedValue(true),
    };

    stateService = {
      findAll: jest.fn().mockResolvedValue([mockState]),
      findById: jest.fn().mockResolvedValue(mockState),
      findByCountry: jest.fn().mockResolvedValue([mockState]),
      validateStateBelongsToCountry: jest.fn().mockResolvedValue(true),
      create: jest.fn().mockResolvedValue(mockState),
      update: jest.fn().mockResolvedValue(mockState),
      remove: jest.fn().mockResolvedValue(true),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GeographyResolver,
        { provide: CountryService, useValue: countryService },
        { provide: GeoStateService, useValue: stateService },
      ],
    }).compile();

    resolver = module.get<GeographyResolver>(GeographyResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  // ─── Country queries ─────────────────────────────────────

  describe('country queries', () => {
    it('findAllCountries', async () => {
      expect(await resolver.findAllCountries()).toEqual([mockCountry]);
    });

    it('findAllCountries with filter', async () => {
      await resolver.findAllCountries({ iso: 'MX' });
      expect(countryService.findAll).toHaveBeenCalledWith({ iso: 'MX' });
    });

    it('findCountry', async () => {
      expect(await resolver.findCountry('c1')).toEqual(mockCountry);
    });

    it('findCountryByIso', async () => {
      expect(await resolver.findCountryByIso('MX')).toEqual(mockCountry);
    });

    it('findCountryByIso3', async () => {
      expect(await resolver.findCountryByIso3('MEX')).toEqual(mockCountry);
    });
  });

  // ─── Country mutations ───────────────────────────────────

  describe('country mutations', () => {
    it('createCountry', async () => {
      const r = await resolver.createCountry({
        iso_name: 'Mexico',
        iso: 'MX',
        iso3: 'MEX',
        name: 'México',
      });
      expect(r).toEqual(mockCountry);
    });

    it('updateCountry', async () => {
      await resolver.updateCountry({ id: 'c1', name: 'México Updated' });
      expect(countryService.update).toHaveBeenCalledWith('c1', expect.any(Object));
    });

    it('removeCountry', async () => {
      expect(await resolver.removeCountry('c1')).toBe(true);
    });
  });

  // ─── State queries ───────────────────────────────────────

  describe('state queries', () => {
    it('findAllStates', async () => {
      expect(await resolver.findAllStates()).toEqual([mockState]);
    });

    it('findState', async () => {
      expect(await resolver.findState('s1')).toEqual(mockState);
    });

    it('findStatesByCountry', async () => {
      expect(await resolver.findStatesByCountry('c1')).toEqual([mockState]);
    });

    it('validateStateBelongsToCountry', async () => {
      expect(await resolver.validateStateBelongsToCountry('s1', 'c1')).toBe(true);
    });
  });

  // ─── State mutations ─────────────────────────────────────

  describe('state mutations', () => {
    it('createGeoState', async () => {
      expect(
        await resolver.createGeoState({ name: 'Jalisco', abbr: 'JAL', country_id: 'c1' }),
      ).toEqual(mockState);
    });

    it('updateGeoState', async () => {
      await resolver.updateGeoState({ id: 's1', name: 'Jalisco Updated' });
      expect(stateService.update).toHaveBeenCalledWith('s1', expect.any(Object));
    });

    it('removeGeoState', async () => {
      expect(await resolver.removeGeoState('s1')).toBe(true);
    });
  });
});
