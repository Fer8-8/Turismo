import { InputType, PartialType, OmitType, Field, ID } from '@nestjs/graphql';
import { CreatePromotionInput } from './create-promotion.input';
import { IsUUID } from 'class-validator';

@InputType()
export class UpdatePromotionInput extends PartialType(
  OmitType(CreatePromotionInput, ['store_ids'] as const),
) {
  @Field(() => ID)
  @IsUUID()
  id: string;
}