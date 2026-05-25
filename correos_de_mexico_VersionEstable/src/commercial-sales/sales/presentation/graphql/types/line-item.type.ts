import { ObjectType, Field, ID, Float, Int } from '@nestjs/graphql';

@ObjectType()
export class LineItemType {
  @Field(() => ID)
  id: string;

  @Field(() => ID, { nullable: true })
  order_id: string | null;

  @Field(() => ID, { nullable: true })
  variant_id: string | null;

  @Field(() => Float)
  price: number;

  @Field(() => Int)
  quantity: number;

  @Field(() => String, { nullable: true })
  currency: string | null;

  @Field(() => Float, { nullable: true })
  cost_price: number | null;

  @Field(() => Float)
  adjustment_total: number;

  @Field(() => Float)
  promo_total: number;

  @Field(() => Float)
  additional_tax_total: number;

  @Field(() => Float)
  included_tax_total: number;

  @Field(() => Float)
  pre_tax_amount: number;

  @Field(() => ID, { nullable: true })
  tax_category_id: string | null;

  @Field()
  created_at: Date;

  @Field()
  updated_at: Date;
}
