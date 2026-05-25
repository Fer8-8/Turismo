import { Field, Float, ID, ObjectType } from '@nestjs/graphql';
import { ShippingMethodType } from './shipping-method.type';

@ObjectType()
export class TaxRateSummaryType {
  @Field(() => ID)
  id: string;

  @Field(() => String, { nullable: true })
  name: string | null;

  @Field(() => Float)
  amount: number;

  @Field()
  included_in_price: boolean;
}

@ObjectType()
export class ShippingRateType {
  @Field(() => ID)
  id: string;

  @Field(() => ID, { nullable: true })
  shipment_id: string | null;

  @Field(() => ID, { nullable: true })
  shipping_method_id: string | null;

  @Field()
  selected: boolean;

  @Field(() => Float)
  cost: number;

  @Field(() => ID, { nullable: true })
  tax_rate_id: string | null;

  @Field(() => Float)
  tax_amount: number;

  @Field(() => Float)
  included_tax_total: number;

  @Field(() => Float)
  additional_tax_total: number;

  @Field(() => ShippingMethodType, { nullable: true })
  shippingMethod: ShippingMethodType | null;

  @Field(() => TaxRateSummaryType, { nullable: true })
  taxRate: TaxRateSummaryType | null;

  @Field()
  created_at: Date;

  @Field()
  updated_at: Date;
}