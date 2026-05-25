import { InputType, Field, ID, PartialType, OmitType } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';
import { CreatePriceInput } from './create-price.input';

@InputType()
export class UpdatePriceInput extends PartialType(OmitType(CreatePriceInput, ['variant_id'] as const)) {
  @Field(() => ID)
  @IsUUID()
  id: string;
}
