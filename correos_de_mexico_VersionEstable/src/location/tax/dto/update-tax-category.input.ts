import { InputType, Field, ID, PartialType } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';
import { CreateTaxCategoryInput } from './create-tax-category.input';

@InputType()
export class UpdateTaxCategoryInput extends PartialType(CreateTaxCategoryInput) {
  @Field(() => ID)
  @IsUUID()
  id: string;
}
