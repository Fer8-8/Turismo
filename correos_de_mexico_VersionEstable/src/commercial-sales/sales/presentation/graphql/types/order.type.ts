import { ObjectType, Field, ID, Float, Int } from '@nestjs/graphql';
import { LineItemType } from './line-item.type';

@ObjectType()
export class OrderType {
  @Field(() => ID)
  id: string;

  @Field(() => String, { nullable: true })
  number: string | null;

  @Field(() => String, { nullable: true })
  state: string | null;

  @Field(() => ID, { nullable: true })
  user_id: string | null;

  @Field(() => ID, { nullable: true })
  store_id: string | null;

  @Field(() => String, { nullable: true })
  email: string | null;

  @Field(() => String, { nullable: true })
  currency: string | null;

  @Field(() => String, { nullable: true })
  channel: string;

  // ─── totales monetarios ───────────────────────────────────

  @Field(() => Float)
  item_total: number;

  @Field(() => Float)
  adjustment_total: number;

  @Field(() => Float)
  promo_total: number;

  @Field(() => Float)
  shipment_total: number;

  @Field(() => Float)
  additional_tax_total: number;

  @Field(() => Float)
  included_tax_total: number;

  @Field(() => Float)
  payment_total: number;

  @Field(() => Float)
  total: number;

  @Field(() => Int)
  item_count: number;

  // ─── referencias de dirección ────────────────────────────

  @Field(() => ID, { nullable: true })
  ship_address_id: string | null;

  @Field(() => ID, { nullable: true })
  bill_address_id: string | null;

  // ─── ciclo de vida ───────────────────────────────────────

  @Field(() => Date, { nullable: true })
  completed_at: Date | null;

  @Field(() => Date, { nullable: true })
  approved_at: Date | null;

  @Field(() => Date, { nullable: true })
  canceled_at: Date | null;

  @Field()
  created_at: Date;

  @Field()
  updated_at: Date;

  // ─── relaciones ───────────────────────────────────────────

  @Field(() => [LineItemType])
  lineItems: LineItemType[];
}

@ObjectType()
export class OrderHistoryType {
  @Field(() => [OrderType])
  items: OrderType[];

  @Field(() => Int)
  total: number;

  @Field(() => Int)
  page: number;

  @Field(() => Int)
  take: number;
}
