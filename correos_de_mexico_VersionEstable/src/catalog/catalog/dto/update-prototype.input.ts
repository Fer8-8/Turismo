import { InputType, Field, ID, PartialType } from '@nestjs/graphql';
import { CreatePrototypeInput } from './create-prototype.input';

@InputType()
export class UpdatePrototypeInput extends PartialType(CreatePrototypeInput) {
  @Field(() => ID)
  id: string;
}
