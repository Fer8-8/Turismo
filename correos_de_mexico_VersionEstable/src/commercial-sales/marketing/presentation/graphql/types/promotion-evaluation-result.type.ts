import { ObjectType, Field, ID, Float } from '@nestjs/graphql';
import { PromotionType } from './promotion.type';

@ObjectType()
export class LineAdjustmentType {
  @Field(() => ID)
  lineItemId: string;

  @Field(() => Float)
  promoTotal: number;
}

@ObjectType()
export class PromotionEvaluationResultType {
  @Field(() => Float)
  orderPromoTotal: number;

  @Field(() => [LineAdjustmentType])
  lineAdjustments: LineAdjustmentType[];

  @Field(() => Float)
  adjustmentTotal: number;

  @Field(() => [ID])
  appliedPromotionIds: string[];
}

@ObjectType()
export class PromoCodeValidationType {
  @Field(() => ID, { nullable: true })
  promotionId: string | null;

  @Field(() => String, { nullable: true })
  code: string | null;

  @Field()
  valid: boolean;

  @Field(() => String, { nullable: true })
  reason: string | null;
}

@ObjectType()
export class OrderPromotionLinkType {
  @Field(() => ID)
  id: string;

  @Field(() => ID, { nullable: true })
  order_id: string | null;

  @Field(() => ID, { nullable: true })
  promotion_id: string | null;

  @Field(() => Float)
  promo_total: number;

  @Field(() => String, { nullable: true })
  reason: string | null;

  @Field(() => String, { nullable: true })
  evaluation_snapshot: string | null;

  @Field(() => PromotionType, { nullable: true })
  promotion: PromotionType | null;

  @Field(() => Date, { nullable: true })
  created_at: Date | null;
}
