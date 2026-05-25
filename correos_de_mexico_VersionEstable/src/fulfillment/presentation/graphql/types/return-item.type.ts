import { Field, Float, ID, ObjectType } from '@nestjs/graphql';
import { CustomerReturnType } from './customer-return.type';

@ObjectType()
export class ReturnItemAuthorizationSummaryType {
  @Field(() => ID)
  id: string;

  @Field(() => String, { nullable: true })
  number: string | null;

  @Field(() => String, { nullable: true })
  state: string | null;

  @Field(() => ID, { nullable: true })
  order_id: string | null;
}

@ObjectType()
export class ReturnItemType {
  @Field(() => ID)
  id: string;

  @Field(() => ID, { nullable: true })
  return_authorization_id: string | null;

  @Field(() => ID, { nullable: true })
  inventory_unit_id: string | null;

  @Field(() => ID, { nullable: true })
  exchange_variant_id: string | null;

  @Field(() => Float)
  pre_tax_amount: number;

  @Field(() => Float)
  included_tax_total: number;

  @Field(() => Float)
  additional_tax_total: number;

  @Field(() => String, { nullable: true })
  reception_status: string | null;

  @Field(() => String, { nullable: true })
  acceptance_status: string | null;

  @Field(() => String, { nullable: true })
  acceptance_status_errors: string | null;

  @Field(() => ID, { nullable: true })
  customer_return_id: string | null;

  @Field()
  resellable: boolean;

  @Field()
  created_at: Date;

  @Field()
  updated_at: Date;

  @Field(() => CustomerReturnType, { nullable: true })
  customerReturn: CustomerReturnType | null;

  @Field(() => ReturnItemAuthorizationSummaryType, { nullable: true })
  returnAuthorization: ReturnItemAuthorizationSummaryType | null;
}