import { Injectable } from '@nestjs/common';
import { CountryService } from '../country.service';
import { GeoStateService } from '../state.service';
import { FilterCountriesInput } from '../dto/filter-countries.input';
import { FilterGeoStatesInput } from '../dto/filter-states.input';

// punto de acceso público para resolver y validar referencias geográficas
@Injectable()
export class GeographyFacade {
  constructor(
    private readonly countryService: CountryService,
    private readonly stateService: GeoStateService,
  ) {}

  // ─── PAÍSES ──────────────────────────────────────────────

  getCountryById(id: string) {
    return this.countryService.findById(id);
  }

  getCountryByIso(iso: string) {
    return this.countryService.findByIso(iso);
  }

  getCountryByIso3(iso3: string) {
    return this.countryService.findByIso3(iso3);
  }

  listCountries(filter?: FilterCountriesInput) {
    return this.countryService.findAll(filter);
  }

  validateCountryExists(id: string): Promise<boolean> {
    return this.countryService.validateCountryExists(id);
  }

  validateCountryExistsByIso(iso: string): Promise<boolean> {
    return this.countryService.validateCountryExistsByIso(iso);
  }

  // ─── ESTADOS ─────────────────────────────────────────────

  getStateById(id: string) {
    return this.stateService.findById(id);
  }

  listStatesByCountry(countryId: string) {
    return this.stateService.findByCountry(countryId);
  }

  listStates(filter?: FilterGeoStatesInput) {
    return this.stateService.findAll(filter);
  }

  validateStateExists(id: string): Promise<boolean> {
    return this.stateService.validateStateExists(id);
  }

  validateStateBelongsToCountry(
    stateId: string,
    countryId: string,
  ): Promise<boolean> {
    return this.stateService.validateStateBelongsToCountry(stateId, countryId);
  }
}
