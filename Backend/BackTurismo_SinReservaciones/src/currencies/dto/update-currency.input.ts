import { CreateCurrencyInput } from './create-currency.input';
import { InputType, Field, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateCurrencyInput extends PartialType(CreateCurrencyInput) {
  @Field(() => String)
  id: string;
}
