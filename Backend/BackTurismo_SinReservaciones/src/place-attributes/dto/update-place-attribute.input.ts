import { CreatePlaceAttributeInput } from './create-place-attribute.input';
import { InputType, Field, ID, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdatePlaceAttributeInput extends PartialType(CreatePlaceAttributeInput) {
  @Field(() => ID)
  id: string;
}
