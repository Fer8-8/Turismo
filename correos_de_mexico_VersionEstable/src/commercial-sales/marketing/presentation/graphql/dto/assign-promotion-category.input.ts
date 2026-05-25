import { Field, ID, InputType } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';

@InputType()
export class AssignPromotionCategoryInput {
  @Field(() => ID)
  @IsUUID()
  promotionId: string;

  @Field(() => ID)
  @IsUUID()
  categoryId: string;
}
