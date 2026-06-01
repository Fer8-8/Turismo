import { Resolver, Query, Mutation, Args, ID, Int } from '@nestjs/graphql';
import { PlacefeaturecacheService } from './placefeaturecache.service';
import { Placefeaturecache } from './entities/placefeaturecache.entity';
import { CreatePlacefeaturecacheInput } from './dto/create-placefeaturecache.input';
import { UpdatePlacefeaturecacheInput } from './dto/update-placefeaturecache.input';

@Resolver(() => Placefeaturecache)
export class PlacefeaturecacheResolver {
  constructor(private readonly placefeaturecacheService: PlacefeaturecacheService) {}

  @Mutation(() => Placefeaturecache)
  createPlacefeaturecache(@Args('createPlacefeaturecacheInput') createPlacefeaturecacheInput: CreatePlacefeaturecacheInput) {
    return this.placefeaturecacheService.create(createPlacefeaturecacheInput);
  }

  @Query(() => [Placefeaturecache], { name: 'allplacefeaturecache' })
  findAll(
    @Args('categoryId', { type: () => String, nullable: true }) categoryId?: string,
    @Args('stateId', { type: () => String, nullable: true }) stateId?: string,
    @Args('page', { type: () => Int, nullable: true, defaultValue: 1 }) page: number = 1,
    @Args('limit', { type: () => Int, nullable: true, defaultValue: 10 }) limit: number = 10,
  ) {
    return this.placefeaturecacheService.findAll(categoryId, stateId, page, limit);
  }

  @Query(() => Placefeaturecache, { name: 'placefeaturecache' })
  findOne(@Args('id', { type: () => ID }) id: string) {
    return this.placefeaturecacheService.findOne(id);
  }

  @Mutation(() => Placefeaturecache)
  updatePlacefeaturecache(@Args('updatePlacefeaturecacheInput') updatePlacefeaturecacheInput: UpdatePlacefeaturecacheInput) {
    return this.placefeaturecacheService.update(updatePlacefeaturecacheInput.id, updatePlacefeaturecacheInput);
  }

  // @Mutation(() => Placefeaturecache)
  // removePlacefeaturecache(@Args('id', { type: () => ID }) id: string) {
  //   return this.placefeaturecacheService.remove(id);
  // }
}
