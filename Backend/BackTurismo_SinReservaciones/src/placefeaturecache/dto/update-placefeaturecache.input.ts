import { CreatePlacefeaturecacheInput } from './create-placefeaturecache.input';
import { InputType, Field, Int, PartialType, ID } from '@nestjs/graphql';

@InputType()
export class UpdatePlacefeaturecacheInput extends PartialType(CreatePlacefeaturecacheInput) {
  @Field(() => ID)
  id: string;
}
