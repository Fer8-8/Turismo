import { CreatePlaceActivityInput } from './create-place-activity.input';
import { InputType, Field, PartialType, ID } from '@nestjs/graphql';

@InputType()
export class UpdatePlaceActivityInput extends PartialType(CreatePlaceActivityInput) {
  @Field(() => ID)
  id: string;
}
