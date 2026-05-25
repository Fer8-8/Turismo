import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class ProductPromotionRuleType {
  @Field(() => ID)
  id: string;

  @Field(() => ID, { nullable: true })
  product_id: string | null;
}

@ObjectType()
export class PromotionRuleUserType {
  @Field(() => ID)
  id: string;

  @Field(() => ID, { nullable: true })
  user_id: string | null;
}

@ObjectType()
export class PromotionRuleType {
  @Field(() => ID)
  id: string;

  @Field(() => ID, { nullable: true })
  promotion_id: string | null;

  @Field(() => String, { nullable: true })
  type: string | null;

  @Field(() => String, { nullable: true })
  code: string | null;

  @Field(() => String, { nullable: true })
  preferences: string | null;

  @Field()
  created_at: Date;

  @Field()
  updated_at: Date;

  @Field(() => [ProductPromotionRuleType])
  productPromotionRules: ProductPromotionRuleType[];

  @Field(() => [PromotionRuleUserType])
  promotionRuleUsers: PromotionRuleUserType[];
}
