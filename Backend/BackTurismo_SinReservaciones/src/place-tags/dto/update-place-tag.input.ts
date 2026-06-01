import { CreatePlaceTagInput } from './create-place-tag.input';
import { InputType, Field, PartialType, ID } from '@nestjs/graphql';

@InputType()
export class UpdatePlaceTagInput extends PartialType(CreatePlaceTagInput) {
  @Field(() => ID)
  id: string;
}
