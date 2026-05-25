import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';
import { SkipStoreContext } from '../../core/shared';
import { CountryService } from './country.service';
import { GeoStateService } from './state.service';
import { Country } from './entities/country.entity';
import { GeoState } from './entities/state.entity';
import { CreateCountryInput } from './dto/create-country.input';
import { UpdateCountryInput } from './dto/update-country.input';
import { FilterCountriesInput } from './dto/filter-countries.input';
import { CreateGeoStateInput } from './dto/create-state.input';
import { UpdateGeoStateInput } from './dto/update-state.input';
import { FilterGeoStatesInput } from './dto/filter-states.input';

@Resolver()
export class GeographyResolver {
  constructor(
    private readonly countryService: CountryService,
    private readonly stateService: GeoStateService,
  ) {}

  // ─── PAÍSES — QUERIES ────────────────────────────────────

  @Query(() => [Country], { name: 'geoCountries' })
  @AllowAnonymous()
  @SkipStoreContext()
  findAllCountries(
    @Args('filter', { type: () => FilterCountriesInput, nullable: true })
    filter?: FilterCountriesInput,
  ) {
    return this.countryService.findAll(filter);
  }

  @Query(() => Country, { name: 'geoCountry' })
  @AllowAnonymous()
  @SkipStoreContext()
  findCountry(@Args('id', { type: () => ID }) id: string) {
    return this.countryService.findById(id);
  }

  @Query(() => Country, { name: 'geoCountryByIso', nullable: true })
  @AllowAnonymous()
  @SkipStoreContext()
  findCountryByIso(@Args('iso') iso: string) {
    return this.countryService.findByIso(iso);
  }

  @Query(() => Country, { name: 'geoCountryByIso3', nullable: true })
  @AllowAnonymous()
  @SkipStoreContext()
  findCountryByIso3(@Args('iso3') iso3: string) {
    return this.countryService.findByIso3(iso3);
  }

  // ─── PAÍSES — MUTATIONS ──────────────────────────────────

  @Mutation(() => Country)
  @SkipStoreContext()
  createCountry(@Args('input') input: CreateCountryInput) {
    return this.countryService.create(input);
  }

  @Mutation(() => Country)
  @SkipStoreContext()
  updateCountry(@Args('input') input: UpdateCountryInput) {
    return this.countryService.update(input.id, input);
  }

  @Mutation(() => Boolean)
  @SkipStoreContext()
  removeCountry(@Args('id', { type: () => ID }) id: string) {
    return this.countryService.remove(id);
  }

  // ─── ESTADOS — QUERIES ───────────────────────────────────

  @Query(() => [GeoState], { name: 'geoStates' })
  @AllowAnonymous()
  @SkipStoreContext()
  findAllStates(
    @Args('filter', { type: () => FilterGeoStatesInput, nullable: true })
    filter?: FilterGeoStatesInput,
  ) {
    return this.stateService.findAll(filter);
  }

  @Query(() => GeoState, { name: 'geoState' })
  @AllowAnonymous()
  @SkipStoreContext()
  findState(@Args('id', { type: () => ID }) id: string) {
    return this.stateService.findById(id);
  }

  @Query(() => [GeoState], { name: 'geoStatesByCountry' })
  @AllowAnonymous()
  @SkipStoreContext()
  findStatesByCountry(
    @Args('countryId', { type: () => ID }) countryId: string,
  ) {
    return this.stateService.findByCountry(countryId);
  }

  @Query(() => Boolean, { name: 'geoValidateStateBelongsToCountry' })
  @AllowAnonymous()
  @SkipStoreContext()
  validateStateBelongsToCountry(
    @Args('stateId', { type: () => ID }) stateId: string,
    @Args('countryId', { type: () => ID }) countryId: string,
  ) {
    return this.stateService.validateStateBelongsToCountry(stateId, countryId);
  }

  // ─── ESTADOS — MUTATIONS ─────────────────────────────────

  @Mutation(() => GeoState)
  @SkipStoreContext()
  createGeoState(@Args('input') input: CreateGeoStateInput) {
    return this.stateService.create(input);
  }

  @Mutation(() => GeoState)
  @SkipStoreContext()
  updateGeoState(@Args('input') input: UpdateGeoStateInput) {
    return this.stateService.update(input.id, input);
  }

  @Mutation(() => Boolean)
  @SkipStoreContext()
  removeGeoState(@Args('id', { type: () => ID }) id: string) {
    return this.stateService.remove(id);
  }
}
