import { Field, ID, InputType, PartialType } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';
import { CreatePromotionCategoryInput } from './create-promotion-category.input';

@InputType()
export class UpdatePromotionCategoryInput extends PartialType(
  CreatePromotionCategoryInput,
) {
  @Field(() => ID)
  @IsUUID()
  id: string;
}
