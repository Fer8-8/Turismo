import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { PlaceTagsService } from './place-tags.service';
import { PlaceTag } from './entities/place-tag.entity';
import { CreatePlaceTagInput } from './dto/create-place-tag.input';
import { UpdatePlaceTagInput } from './dto/update-place-tag.input';

@Resolver(() => PlaceTag)
export class PlaceTagsResolver {
  constructor(private readonly placeTagsService: PlaceTagsService) {}

  @Mutation(() => PlaceTag)
  createPlaceTag(@Args('createPlaceTagInput') createPlaceTagInput: CreatePlaceTagInput) {
    return this.placeTagsService.create(createPlaceTagInput);
  }

  @Query(() => [PlaceTag], { name: 'placeTags' })
  findAll() {
    return this.placeTagsService.findAll();
  }

  @Query(() => PlaceTag, { name: 'placeTag' })
  findOne(@Args('id', { type: () => ID }) id: string) {
    return this.placeTagsService.findOne(id);
  }

  @Mutation(() => PlaceTag)
  updatePlaceTag(@Args('updatePlaceTagInput') updatePlaceTagInput: UpdatePlaceTagInput) {
    return this.placeTagsService.update(updatePlaceTagInput.id, updatePlaceTagInput);
  }

  @Mutation(() => PlaceTag)
  removePlaceTag(@Args('id', { type: () => ID }) id: string) {
    return this.placeTagsService.remove(id);
  }
}
