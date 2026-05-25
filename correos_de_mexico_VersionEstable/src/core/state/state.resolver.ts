import { Resolver, Query, Mutation, Args, ID, ResolveField, Parent } from '@nestjs/graphql';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';
import { StateService } from './state.service';
import { State } from './entities/state.entity';
import { Country } from './entities/country.entity';
import { CreateStateInput } from './dto/create-state.input';
import { UpdateStateInput } from './dto/update-state.input';
import { FilterStatesInput } from './dto/filter-states.input';
import { SkipStoreContext } from '../shared/decorators';
import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
class StateDeleteResult {
  @Field()
  success: boolean;
}

// api graphql estados y países públicos
@Resolver(() => State)
export class StateResolver {
  constructor(private readonly stateService: StateService) {}

  // ─── consultas de estados ───────────────────────────────────────────────────

  @Query(() => [State], { name: 'states' })
  @AllowAnonymous()
  @SkipStoreContext()
  findAll(
    @Args('filter', { type: () => FilterStatesInput, nullable: true }) filter?: FilterStatesInput,
  ) {
    return this.stateService.findAll(filter);
  }

  @Query(() => State, { name: 'state' })
  @AllowAnonymous()
  @SkipStoreContext()
  findById(@Args('id', { type: () => ID }) id: string) {
    return this.stateService.findById(id);
  }

  @Query(() => [State], { name: 'statesByCountry' })
  @AllowAnonymous()
  @SkipStoreContext()
  getStatesByCountry(@Args('countryId', { type: () => ID }) countryId: string) {
    return this.stateService.getStatesByCountry(countryId);
  }

  // ─── mutaciones de estados ──────────────────────────────────────────────────

  @Mutation(() => State, { name: 'createState' })
  @SkipStoreContext()
  createState(@Args('input') input: CreateStateInput) {
    return this.stateService.create(input);
  }

  @Mutation(() => State, { name: 'updateState' })
  @SkipStoreContext()
  updateState(@Args('input') input: UpdateStateInput) {
    return this.stateService.update(input);
  }

  @Mutation(() => StateDeleteResult, { name: 'deleteState' })
  @SkipStoreContext()
  deleteState(@Args('id', { type: () => ID }) id: string) {
    return this.stateService.remove(id);
  }

  // ─── consultas de países ───────────────────────────────────────────────────

  @Query(() => [Country], { name: 'countries' })
  @AllowAnonymous()
  @SkipStoreContext()
  findAllCountries() {
    return this.stateService.findAllCountries();
  }

  @Query(() => Country, { name: 'country' })
  @AllowAnonymous()
  @SkipStoreContext()
  findCountryById(@Args('id', { type: () => ID }) id: string) {
    return this.stateService.findCountryById(id);
  }

  @Query(() => Country, { name: 'countryByIso', nullable: true })
  @AllowAnonymous()
  @SkipStoreContext()
  findCountryByIso(@Args('iso') iso: string) {
    return this.stateService.findCountryByIso(iso);
  }

  // ─── campos resueltos ────────────────────────────────────────────────────

  // resuelve el país de un estado
  @ResolveField(() => Country, { name: 'country', nullable: true })
  async resolveCountry(@Parent() state: State) {
    if (!state.country_id) return null;
    return this.stateService.getStateCountry(state.country_id);
  }
}

