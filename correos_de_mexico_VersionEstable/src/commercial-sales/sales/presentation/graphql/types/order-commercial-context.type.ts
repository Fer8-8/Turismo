import { Field, Float, ID, Int, ObjectType } from '@nestjs/graphql';
import { LineItemType } from './line-item.type';

@ObjectType()
export class OrderPaymentContextType {
  @Field(() => ID)
  orderId: string;

  @Field(() => String, { nullable: true })
  state: string | null;

  @Field(() => ID, { nullable: true })
  storeId: string | null;

  @Field(() => String, { nullable: true })
  currency: string | null;

  @Field(() => Float)
  total: number;

  @Field(() => Float)
  paymentTotal: number;

  @Field(() => Float)
  outstandingBalance: number;

  @Field()
  payable: boolean;
}

@ObjectType()
export class OrderFulfillmentContextType {
  @Field(() => ID)
  orderId: string;

  @Field(() => String, { nullable: true })
  state: string | null;

  @Field(() => ID, { nullable: true })
  storeId: string | null;

  @Field(() => ID, { nullable: true })
  shipAddressId: string | null;

  @Field(() => ID, { nullable: true })
  billAddressId: string | null;

  @Field()
  fulfillable: boolean;

  @Field(() => [LineItemType])
  lineItems: LineItemType[];
}

@ObjectType()
export class OrderCommercialContextType {
  @Field(() => ID)
  orderId: string;

  @Field(() => String, { nullable: true })
  number: string | null;

  @Field(() => String, { nullable: true })
  state: string | null;

  @Field(() => ID, { nullable: true })
  storeId: string | null;

  @Field(() => ID, { nullable: true })
  userId: string | null;

  @Field(() => Float)
  total: number;

  @Field(() => Float)
  paymentTotal: number;

  @Field(() => Float)
  outstandingBalance: number;

  @Field()
  payable: boolean;

  @Field()
  fulfillable: boolean;

  @Field(() => Int)
  itemCount: number;

  @Field(() => Date, { nullable: true })
  approvedAt: Date | null;

  @Field(() => Date, { nullable: true })
  canceledAt: Date | null;
}
