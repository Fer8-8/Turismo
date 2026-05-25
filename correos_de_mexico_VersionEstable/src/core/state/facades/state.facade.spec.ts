import { StateFacade } from './state.facade';

describe('StateFacade', () => {
  let facade: StateFacade;
  let stateService: {
    getStatesByCountry: jest.Mock;
    findById: jest.Mock;
    findCountryById: jest.Mock;
    findCountryByIso: jest.Mock;
    findAllCountries: jest.Mock;
  };

  beforeEach(() => {
    stateService = {
      getStatesByCountry: jest.fn(),
      findById: jest.fn(),
      findCountryById: jest.fn(),
      findCountryByIso: jest.fn(),
      findAllCountries: jest.fn(),
    };

    facade = new StateFacade(stateService as any);
  });

  it('delegates ISO country lookups', async () => {
    const country = { id: 'mx', iso: 'MX' };
    stateService.findCountryByIso.mockResolvedValue(country);

    await expect(facade.getCountryByIso('MX')).resolves.toEqual(country);
    expect(stateService.findCountryByIso).toHaveBeenCalledWith('MX');
  });

  it('delegates all-country queries', async () => {
    const countries = [{ id: 'mx' }, { id: 'us' }];
    stateService.findAllCountries.mockResolvedValue(countries);

    await expect(facade.getAllCountries()).resolves.toEqual(countries);
    expect(stateService.findAllCountries).toHaveBeenCalled();
  });
});