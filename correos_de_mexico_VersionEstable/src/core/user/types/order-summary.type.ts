import { ObjectType, Field, ID, Float } from '@nestjs/graphql';

@ObjectType()
export class UserOrderSummaryType {
  @Field(() => ID)
  id: string;

  @Field(() => String, { nullable: true })
  number?: string | null;

  @Field(() => String, { nullable: true })
  state?: string | null;

  @Field(() => Float)
  total: number;

  @Field(() => Float)
  item_total: number;

  @Field(() => Date, { nullable: true })
  completed_at?: Date | null;

  @Field(() => String, { nullable: true })
  shipment_state?: string | null;

  @Field(() => String, { nullable: true })
  payment_state?: string | null;

  @Field()
  created_at: Date;
}
