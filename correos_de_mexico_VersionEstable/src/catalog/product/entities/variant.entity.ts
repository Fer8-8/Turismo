import { ObjectType, Field, ID, Int } from '@nestjs/graphql';
import { Price } from './price.entity';
import { TaxCategoryRef } from './tax-category-ref.entity';

@ObjectType()
export class Variant {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  sku: string;

  @Field(() => String, { nullable: true })
  product_id?: string;

  @Field(() => String, { nullable: true })
  weight?: string;

  @Field(() => String, { nullable: true })
  height?: string;

  @Field(() => String, { nullable: true })
  width?: string;

  @Field(() => String, { nullable: true })
  depth?: string;

  @Field(() => Boolean)
  is_master: boolean;

  @Field(() => String, { nullable: true })
  cost_price?: string;

  @Field(() => String, { nullable: true })
  cost_currency?: string;

  @Field(() => Boolean)
  track_inventory: boolean;

  @Field(() => Int, { nullable: true })
  position?: number;

  @Field(() => String, { nullable: true })
  tax_category_id?: string;

  @Field(() => TaxCategoryRef, { nullable: true })
  taxCategory?: TaxCategoryRef;

  @Field(() => Date, { nullable: true })
  deleted_at?: Date;

  @Field(() => Date, { nullable: true })
  discontinue_on?: Date;

  @Field(() => [Price], { nullable: true })
  prices?: Price[];

  @Field(() => Date)
  created_at: Date;

  @Field(() => Date)
  updated_at: Date;
}
