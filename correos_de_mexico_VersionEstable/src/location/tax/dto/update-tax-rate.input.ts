import { InputType, Field, ID, PartialType } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';
import { CreateTaxRateInput } from './create-tax-rate.input';

@InputType()
export class UpdateTaxRateInput extends PartialType(CreateTaxRateInput) {
  @Field(() => ID)
  @IsUUID()
  id: string;
}
