import { Resolver, Query, Mutation, Args, Int, ID } from '@nestjs/graphql';
import { PlaceAttributesService } from './place-attributes.service';
import { PlaceAttribute } from './entities/place-attribute.entity';
import { CreatePlaceAttributeInput } from './dto/create-place-attribute.input';
import { UpdatePlaceAttributeInput } from './dto/update-place-attribute.input';

@Resolver(() => PlaceAttribute)
export class PlaceAttributesResolver {
  constructor(private readonly placeAttributesService: PlaceAttributesService) {}

  @Mutation(() => PlaceAttribute)
  createPlaceAttribute(@Args('createPlaceAttributeInput') createPlaceAttributeInput: CreatePlaceAttributeInput) {
    return this.placeAttributesService.create(createPlaceAttributeInput);
  }

  @Query(() => [PlaceAttribute], { name: 'placeAttributes' })
  findAll() {
    return this.placeAttributesService.findAll();
  }

  @Query(() => PlaceAttribute, { name: 'placeAttribute' })
  findOne(@Args('id', { type: () => ID }) id: string) {
    return this.placeAttributesService.findOne(id);
  }

  @Mutation(() => PlaceAttribute)
  updatePlaceAttribute(@Args('updatePlaceAttributeInput') updatePlaceAttributeInput: UpdatePlaceAttributeInput) {
    return this.placeAttributesService.update(updatePlaceAttributeInput.id, updatePlaceAttributeInput);
  }

  // @Mutation(() => PlaceAttribute)
  // removePlaceAttribute(@Args('id', { type: () => ID }) id: string) {
  //   return this.placeAttributesService.remove(id);
  // }
}
