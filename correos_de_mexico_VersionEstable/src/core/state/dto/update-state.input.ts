import { CreateStateInput } from './create-state.input';
import { InputType, Field, ID, PartialType } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';

@InputType()
export class UpdateStateInput extends PartialType(CreateStateInput) {
  @Field(() => ID)
  @IsUUID()
  id: string;
}

