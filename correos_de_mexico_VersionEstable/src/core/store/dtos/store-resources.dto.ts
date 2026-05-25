import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class StoreProductsDto {
  @Field(() => ID)
  store_id: string;

  @Field(() => [String])
  product_ids: string[];

  @Field()
  product_count: number;
}

@ObjectType()
export class StorePromotionsDto {
  @Field(() => ID)
  store_id: string;

  @Field(() => [String])
  promotion_ids: string[];

  @Field()
  promotion_count: number;
}

@ObjectType()
export class StorePaymentMethodsDto {
  @Field(() => ID)
  store_id: string;

  @Field(() => [String])
  payment_method_ids: string[];

  @Field()
  payment_method_count: number;
}

@ObjectType()
export class StoreTaxonomiesDto {
  @Field(() => ID)
  store_id: string;

  @Field(() => [String])
  taxonomy_ids: string[];

  @Field()
  taxonomy_count: number;
}

@ObjectType()
export class StoreResourcesDto {
  @Field()
  enabledProducts: StoreProductsDto;

  @Field()
  enabledPromotions: StorePromotionsDto;

  @Field()
  enabledPaymentMethods: StorePaymentMethodsDto;

  @Field()
  enabledTaxonomies: StoreTaxonomiesDto;
}

@ObjectType()
export class StoreConfigurationDto {
  @Field(() => ID)
  store_id: string;

  @Field(() => String, { nullable: true })
  name?: string | null;

  @Field(() => String, { nullable: true })
  code?: string | null;

  @Field()
  is_active: boolean;

  @Field(() => String, { nullable: true })
  default_currency?: string | null;

  @Field(() => String, { nullable: true })
  default_locale?: string | null;

  @Field(() => String, { nullable: true })
  default_country_id?: string | null;

  @Field(() => String, { nullable: true })
  checkout_zone_id?: string | null;

  @Field(() => String, { nullable: true })
  customer_support_email?: string | null;

  @Field()
  created_at: Date;

  @Field()
  updated_at: Date;
}
