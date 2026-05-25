import { Injectable } from '@nestjs/common';
import { StateService } from '../state.service';

// api pública estados otros módulos
@Injectable()
export class StateFacade {
  constructor(private readonly stateService: StateService) {}

  // devuelve estados de un país, ordenados alfabéticamente
  getStatesByCountry(countryId: string) {
    return this.stateService.getStatesByCountry(countryId);
  }

  // busca un estado por id
  getStateById(id: string) {
    return this.stateService.findById(id);
  }

  // busca un país por id
  getCountryById(id: string) {
    return this.stateService.findCountryById(id);
  }

  // busca un país por código iso de 2 letras
  getCountryByIso(iso: string) {
    return this.stateService.findCountryByIso(iso);
  }

  // devuelve todos los países
  getAllCountries() {
    return this.stateService.findAllCountries();
  }
}
