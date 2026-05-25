import { InputType, Field, ID, PartialType } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';
import { CreateCountryInput } from './create-country.input';

@InputType()
export class UpdateCountryInput extends PartialType(CreateCountryInput) {
  @Field(() => ID)
  @IsUUID()
  id: string;
}
