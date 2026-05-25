import { Test, TestingModule } from '@nestjs/testing';
import { GeographyFacade } from './geography.facade';
import { CountryService } from '../country.service';
import { GeoStateService } from '../state.service';

const mockCountry = { id: 'c1', name: 'México', iso: 'MX' };
const mockState = { id: 's1', name: 'Jalisco', abbr: 'JAL', country_id: 'c1' };

describe('GeographyFacade', () => {
  let facade: GeographyFacade;
  let countryService: Record<string, jest.Mock>;
  let stateService: Record<string, jest.Mock>;

  beforeEach(async () => {
    countryService = {
      findById: jest.fn().mockResolvedValue(mockCountry),
      findByIso: jest.fn().mockResolvedValue(mockCountry),
      findByIso3: jest.fn().mockResolvedValue(mockCountry),
      findAll: jest.fn().mockResolvedValue([mockCountry]),
      validateCountryExists: jest.fn().mockResolvedValue(true),
      validateCountryExistsByIso: jest.fn().mockResolvedValue(true),
    };

    stateService = {
      findById: jest.fn().mockResolvedValue(mockState),
      findByCountry: jest.fn().mockResolvedValue([mockState]),
      findAll: jest.fn().mockResolvedValue([mockState]),
      validateStateExists: jest.fn().mockResolvedValue(true),
      validateStateBelongsToCountry: jest.fn().mockResolvedValue(true),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GeographyFacade,
        { provide: CountryService, useValue: countryService },
        { provide: GeoStateService, useValue: stateService },
      ],
    }).compile();

    facade = module.get<GeographyFacade>(GeographyFacade);
  });

  it('should be defined', () => {
    expect(facade).toBeDefined();
  });

  describe('country delegations', () => {
    it('getCountryById', async () => {
      expect(await facade.getCountryById('c1')).toEqual(mockCountry);
      expect(countryService.findById).toHaveBeenCalledWith('c1');
    });

    it('getCountryByIso', async () => {
      expect(await facade.getCountryByIso('MX')).toEqual(mockCountry);
    });

    it('getCountryByIso3', async () => {
      expect(await facade.getCountryByIso3('MEX')).toEqual(mockCountry);
    });

    it('listCountries', async () => {
      expect(await facade.listCountries()).toEqual([mockCountry]);
    });

    it('validateCountryExists', async () => {
      expect(await facade.validateCountryExists('c1')).toBe(true);
    });

    it('validateCountryExistsByIso', async () => {
      expect(await facade.validateCountryExistsByIso('MX')).toBe(true);
    });
  });

  describe('state delegations', () => {
    it('getStateById', async () => {
      expect(await facade.getStateById('s1')).toEqual(mockState);
    });

    it('listStatesByCountry', async () => {
      expect(await facade.listStatesByCountry('c1')).toEqual([mockState]);
    });

    it('listStates', async () => {
      expect(await facade.listStates()).toEqual([mockState]);
    });

    it('validateStateExists', async () => {
      expect(await facade.validateStateExists('s1')).toBe(true);
    });

    it('validateStateBelongsToCountry', async () => {
      expect(await facade.validateStateBelongsToCountry('s1', 'c1')).toBe(true);
      expect(stateService.validateStateBelongsToCountry).toHaveBeenCalledWith('s1', 'c1');
    });
  });
});
