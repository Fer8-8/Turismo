import { Resolver, Query, Mutation, Args, Int, ID } from '@nestjs/graphql';
import { PlaceActivitiesService } from './place-activities.service';
import { PlaceActivity } from './entities/place-activity.entity';
import { CreatePlaceActivityInput } from './dto/create-place-activity.input';
import { UpdatePlaceActivityInput } from './dto/update-place-activity.input';
import { PaginationArgs } from 'src/common/pagination/args/pagination.args';
import { PlaceActivitiesResponse } from './dto/place-activities-response.dto';
import { PlaceActivitiesFilterArgs } from './args/place-activities-filter.args';

@Resolver(() => PlaceActivity)
export class PlaceActivitiesResolver {
  constructor(private readonly placeActivitiesService: PlaceActivitiesService) {}

  @Mutation(() => PlaceActivity)
  createPlaceActivity(@Args('createPlaceActivityInput') createPlaceActivityInput: CreatePlaceActivityInput) {
    return this.placeActivitiesService.create(createPlaceActivityInput);
  }

  @Query(() => PlaceActivitiesResponse, { name: 'placeActivities' })
  findAll(
    @Args() paginationArgs: PaginationArgs,
    @Args() filterArgs: PlaceActivitiesFilterArgs,
  ) {
    return this.placeActivitiesService.findAll(paginationArgs, filterArgs);
  }

  @Query(() => PlaceActivity, { name: 'placeActivity' })
  findOne(@Args('id', { type: () => ID }) id: string) {
    return this.placeActivitiesService.findOne(id);
  }

  @Query(() => PlaceActivitiesResponse, { name: 'placeActivitiesByPlaceId' })
  findByPlaceId(
    @Args('placeId', { type: () => ID }) placeId: string,
    @Args() paginationArgs: PaginationArgs,
    @Args() filterArgs: PlaceActivitiesFilterArgs,
  ) {
    return this.placeActivitiesService.findByPlaceId(placeId, paginationArgs, filterArgs);
  }

  @Mutation(() => PlaceActivity)
  updatePlaceActivity(@Args('updatePlaceActivityInput') updatePlaceActivityInput: UpdatePlaceActivityInput) {
    return this.placeActivitiesService.update(updatePlaceActivityInput.id, updatePlaceActivityInput);
  }

  @Mutation(() => PlaceActivity)
  removePlaceActivity(@Args('id', { type: () => ID }) id: string) {
    return this.placeActivitiesService.remove(id);
  }
}
