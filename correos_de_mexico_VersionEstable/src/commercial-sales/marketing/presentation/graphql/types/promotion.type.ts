import { ObjectType, Field, ID, Int } from '@nestjs/graphql';
import { PromotionCategoryType } from './promotion-category.type';
import { PromotionRuleType } from './promotion-rule.type';
import { PromotionActionType } from './promotion-action.type';

@ObjectType()
export class PromotionStoreType {
  @Field(() => ID)
  id!: string;

  @Field(() => ID, { nullable: true })
  store_id?: string | null;
}

@ObjectType()
export class PromotionType {
  @Field(() => ID)
  id!: string;

  @Field(() => String, { nullable: true })
  name?: string | null;

  @Field(() => String, { nullable: true })
  description?: string | null;

  @Field(() => String, { nullable: true })
  type?: string | null;

  @Field(() => String, { nullable: true })
  code?: string | null;

  @Field()
  match_policy!: string;

  @Field()
  active!: boolean;

  @Field()
  advertise!: boolean;

  @Field(() => Int, { nullable: true })
  usage_limit?: number | null;

  @Field(() => Int)
  usage_count!: number;

  @Field(() => Date, { nullable: true })
  starts_at?: Date | null;

  @Field(() => Date, { nullable: true })
  expires_at?: Date | null;

  @Field(() => String, { nullable: true })
  path?: string | null;

  @Field(() => PromotionCategoryType, { nullable: true })
  promotionCategory?: PromotionCategoryType | null;

  @Field()
  is_global!: boolean;

  @Field(() => Int, { nullable: true })
  remaining_usage?: number | null;

  @Field()
  created_at!: Date;

  @Field()
  updated_at!: Date;

  @Field(() => [PromotionStoreType])
  promotionsStores!: PromotionStoreType[];

  @Field(() => [PromotionRuleType])
  promotionRules!: PromotionRuleType[];

  @Field(() => [PromotionActionType])
  promotionActions!: PromotionActionType[];
}