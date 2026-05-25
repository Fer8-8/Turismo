import { ObjectType, Field, ID, Float } from '@nestjs/graphql';

@ObjectType()
export class RefundReasonType {
  @Field(() => ID)
  id: string;

  @Field(() => String, { nullable: true })
  name: string | null;

  @Field()
  active: boolean;

  @Field()
  mutable: boolean;

  @Field()
  created_at: Date;

  @Field()
  updated_at: Date;
}

@ObjectType()
export class RefundType {
  @Field(() => ID)
  id: string;

  @Field(() => ID, { nullable: true })
  payment_id: string | null;

  @Field(() => Float)
  amount: number;

  @Field(() => String, { nullable: true })
  transaction_id: string | null;

  @Field(() => String, { nullable: true })
  state: string | null;

  @Field(() => String, { nullable: true })
  response_code: string | null;

  @Field(() => String, { nullable: true })
  gateway_code: string | null;

  @Field(() => ID, { nullable: true })
  refund_reason_id: string | null;

  @Field(() => RefundReasonType, { nullable: true })
  refundReason: RefundReasonType | null;

  @Field()
  created_at: Date;

  @Field()
  updated_at: Date;
}

@ObjectType()
export class PaymentMethodType {
  @Field(() => ID)
  id: string;

  @Field(() => String, { nullable: true })
  type: string | null;

  @Field(() => String, { nullable: true })
  name: string | null;

  @Field(() => String, { nullable: true })
  description: string | null;

  @Field()
  active: boolean;

  @Field(() => String, { nullable: true })
  display_on: string;

  @Field(() => Boolean, { nullable: true })
  auto_capture: boolean | null;

  @Field(() => Float)
  position: number;

  @Field()
  created_at: Date;

  @Field()
  updated_at: Date;
}

@ObjectType()
export class PaymentCaptureEventType {
  @Field(() => ID)
  id: string;

  @Field(() => Float)
  amount: number;

  @Field(() => ID, { nullable: true })
  payment_id: string | null;

  @Field()
  created_at: Date;
}

@ObjectType()
export class PaymentType {
  @Field(() => ID)
  id: string;

  @Field(() => Float)
  amount: number;

  @Field(() => ID, { nullable: true })
  order_id: string | null;

  @Field(() => ID, { nullable: true })
  payment_method_id: string | null;

  @Field(() => String, { nullable: true })
  state: string | null;

  @Field(() => String, { nullable: true })
  response_code: string | null;

  @Field(() => String, { nullable: true })
  number: string | null;

  @Field(() => String, { nullable: true })
  gateway_code: string | null;

  @Field(() => String, { nullable: true })
  payment_intent_id: string | null;

  @Field(() => Float)
  captured_amount: number;

  @Field()
  created_at: Date;

  @Field()
  updated_at: Date;

  @Field(() => PaymentMethodType, { nullable: true })
  paymentMethod: PaymentMethodType | null;

  @Field(() => [PaymentCaptureEventType])
  paymentCaptureEvents: PaymentCaptureEventType[];

  @Field(() => [RefundType])
  refunds: RefundType[];
}

@ObjectType()
export class OrderPaymentSummaryType {
  @Field(() => ID)
  orderId: string;

  @Field(() => Float)
  totalPaid: number;

  @Field(() => Float)
  outstandingBalance: number;

  @Field(() => [PaymentSummaryItemType])
  payments: PaymentSummaryItemType[];
}

@ObjectType()
export class PaymentSummaryItemType {
  @Field(() => ID)
  id: string;

  @Field(() => Float)
  amount: number;

  @Field(() => String, { nullable: true })
  state: string | null;

  @Field()
  createdAt: Date;
}

@ObjectType()
export class GatewayConfigType {
  @Field()
  code: string;

  @Field()
  active: boolean;

  @Field()
  label: string;
}
