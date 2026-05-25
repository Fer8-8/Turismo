import { InputType, Field, ID, PartialType } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';
import { CreateGeoStateInput } from './create-state.input';

@InputType()
export class UpdateGeoStateInput extends PartialType(CreateGeoStateInput) {
  @Field(() => ID)
  @IsUUID()
  id: string;
}
