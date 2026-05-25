import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Variant } from './variant.entity';
import { TaxCategoryRef } from './tax-category-ref.entity';
import { ShippingCategoryRef } from './shipping-category-ref.entity';

@ObjectType()
export class Product {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  name: string;

  @Field(() => String, { nullable: true })
  description?: string;

  @Field(() => String, { nullable: true })
  slug?: string;

  @Field(() => String, { nullable: true })
  meta_title?: string;

  @Field(() => String, { nullable: true })
  meta_description?: string;

  @Field(() => String, { nullable: true })
  meta_keywords?: string;

  @Field(() => Boolean)
  promotionable: boolean;

  @Field(() => Date, { nullable: true })
  available_on?: Date;

  @Field(() => Date, { nullable: true })
  discontinue_on?: Date;

  @Field(() => Date, { nullable: true })
  deleted_at?: Date;

  @Field(() => String, { nullable: true })
  tax_category_id?: string;

  @Field(() => String, { nullable: true })
  shipping_category_id?: string;

  @Field(() => TaxCategoryRef, { nullable: true })
  taxCategory?: TaxCategoryRef;

  @Field(() => ShippingCategoryRef, { nullable: true })
  shippingCategory?: ShippingCategoryRef;

  @Field(() => [Variant], { nullable: true })
  variants?: Variant[];

  @Field(() => Date)
  created_at: Date;

  @Field(() => Date)
  updated_at: Date;
}
