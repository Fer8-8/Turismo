import { InputType, Field, PartialType, OmitType, ID } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';
import { CreatePromotionRuleInput } from './create-promotion-rule.input';

@InputType()
export class UpdatePromotionRuleInput extends PartialType(
  OmitType(CreatePromotionRuleInput, ['promotionId', 'product_ids', 'user_ids'] as const),
) {
  @Field(() => ID)
  @IsUUID()
  id: string;
}
