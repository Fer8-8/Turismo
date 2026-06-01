import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { PlacesService } from './places.service';
import { Place } from './entities/place.entity';
import { CreatePlaceInput } from './dto/create-place.input';
import { UpdatePlaceInput } from './dto/update-place.input';
import { PaginationArgs } from '../common/pagination/args/pagination.args';
import { PlacesFilterArgs } from './args/places-filter.args';
import { PlacesResponse } from './dto/places-response.dto';
import { ValidRegionsArgs } from 'src/states/args/regions.arg';
import { AllowAnonymous, AuthGuard } from '@thallesp/nestjs-better-auth';
import { ValidLocationArgs } from './args/location.args';
import { UseGuards } from '@nestjs/common';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Role } from '@prisma/client';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { Roles } from 'src/common/decorators/roles.decorator';

@Resolver(() => Place)
@UseGuards(AuthGuard, RolesGuard)
export class PlacesResolver {
  constructor(private readonly placesService: PlacesService) { }

  @Roles(Role.admin, Role.adminState)
  @Mutation(() => Place)
  createPlace(
    @CurrentUser() user: User,
    @Args('createPlaceInput') createPlaceInput: CreatePlaceInput
  ) {
    return this.placesService.create(user, createPlaceInput);
  }

  @AllowAnonymous()
  @Query(() => PlacesResponse, { name: 'places' })
  findAll(
    @Args() placesFilterArgs: PlacesFilterArgs,
    @Args() paginationArgs: PaginationArgs,
    @Args() validRegionsArgs: ValidRegionsArgs,
    @Args('limit', { type: () => Int, nullable: true }) limit?: number,
    @Args('isRandom', { type: () => Boolean, nullable: true }) isRandom?: boolean,
    @Args('seed', { type: () => Int, nullable: true }) seed?: number,
  ) {
    return this.placesService.findAll(placesFilterArgs, paginationArgs, validRegionsArgs, limit, isRandom, seed);
  }

  @AllowAnonymous()
  @Query(() => Place, { name: 'place' })
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.placesService.findOne(id);
  }

  @AllowAnonymous()
  @Query(() => PlacesResponse, { name: 'nearbyPlaces' })
  findNearby(
    @Args() validLocationArgs: ValidLocationArgs,
    @Args() paginationArgs: PaginationArgs,
    @Args() placesFilterArgs: PlacesFilterArgs,
    @Args('limit', { type: () => Int, nullable: true }) limit?: number,
  ) {
    return this.placesService.findNearby(validLocationArgs, paginationArgs, placesFilterArgs, limit);
  }

  @AllowAnonymous()
  @Query(() => [Place], { name: 'cities' })
  findCities(
    @Args('state_id', { type: () => String, nullable: true }) state_id?: string,
  ) {
    return this.placesService.findCities(state_id);
  }

  @Roles(Role.admin, Role.adminState)
  @Mutation(() => Place)
  updatePlace(
    @CurrentUser() user: User,
    @Args('updatePlaceInput') updatePlaceInput: UpdatePlaceInput) {
    return this.placesService.update(user, updatePlaceInput.id, updatePlaceInput);
  }

  @Roles(Role.admin)
  @Mutation(() => Place)
  removePlace(@Args('id', { type: () => String }) id: string) {
    return this.placesService.remove(id);
  }
}
