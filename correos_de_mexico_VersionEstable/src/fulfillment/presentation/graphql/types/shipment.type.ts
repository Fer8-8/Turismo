import { Field, Float, ID, ObjectType } from '@nestjs/graphql';
import { ShippingRateType } from './shipping-rate.type';

@ObjectType()
export class ShipmentType {
  @Field(() => ID)
  id: string;

  @Field(() => String, { nullable: true })
  number: string | null;

  @Field(() => String, { nullable: true })
  tracking: string | null;

  @Field(() => String, { nullable: true })
  state: string | null;

  @Field(() => ID, { nullable: true })
  order_id: string | null;

  @Field(() => ID, { nullable: true })
  address_id: string | null;

  @Field(() => ID, { nullable: true })
  stock_location_id: string | null;

  @Field(() => Float)
  cost: number;

  @Field(() => Float)
  adjustment_total: number;

  @Field(() => Float)
  additional_tax_total: number;

  @Field(() => Float)
  promo_total: number;

  @Field(() => Float)
  included_tax_total: number;

  @Field(() => Float)
  pre_tax_amount: number;

  @Field(() => Float)
  taxable_adjustment_total: number;

  @Field(() => Float)
  non_taxable_adjustment_total: number;

  @Field(() => Date, { nullable: true })
  pending_at: Date | null;

  @Field(() => Date, { nullable: true })
  ready_at: Date | null;

  @Field(() => Date, { nullable: true })
  shipped_at: Date | null;

  @Field(() => Date, { nullable: true })
  delivered_at: Date | null;

  @Field()
  created_at: Date;

  @Field()
  updated_at: Date;

  @Field(() => ID, { nullable: true })
  selected_shipping_rate_id: string | null;

  @Field(() => [ShippingRateType])
  shippingRates: ShippingRateType[];
}