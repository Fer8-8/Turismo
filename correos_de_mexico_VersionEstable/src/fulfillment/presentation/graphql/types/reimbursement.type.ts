import { Field, Float, ID, ObjectType } from '@nestjs/graphql';
import { ReimbursementStatus } from '../../../domain/enums/reimbursement-status.enum';

@ObjectType()
export class ReimbursementRefundSummaryType {
  @Field(() => ID)
  id: string;

  @Field(() => Float)
  amount: number;

  @Field(() => String, { nullable: true })
  state: string | null;

  @Field(() => String, { nullable: true })
  transaction_id: string | null;

  @Field(() => Date, { nullable: true })
  created_at: Date | null;
}

@ObjectType()
export class ReimbursementOrderSummaryType {
  @Field(() => ID)
  id: string;

  @Field(() => String, { nullable: true })
  number: string | null;
}

@ObjectType()
export class ReimbursementCustomerReturnSummaryType {
  @Field(() => ID)
  id: string;

  @Field(() => String, { nullable: true })
  number: string | null;
}

@ObjectType()
export class ReimbursementTypeSummaryType {
  @Field(() => ID)
  id: string;

  @Field(() => String, { nullable: true })
  name: string | null;

  @Field(() => String, { nullable: true })
  type: string | null;
}

@ObjectType()
export class ReimbursementItemSummaryType {
  @Field(() => ID)
  id: string;

  @Field(() => ID, { nullable: true })
  return_authorization_id: string | null;

  @Field(() => ID, { nullable: true })
  inventory_unit_id: string | null;

  @Field(() => ID, { nullable: true })
  customer_return_id: string | null;

  @Field(() => ID, { nullable: true })
  reimbursement_id: string | null;

  @Field(() => String, { nullable: true })
  acceptance_status: string | null;

  @Field(() => String, { nullable: true })
  reception_status: string | null;

  @Field(() => Float)
  pre_tax_amount: number;

  @Field(() => Float)
  included_tax_total: number;

  @Field(() => Float)
  additional_tax_total: number;

  @Field()
  resellable: boolean;

  @Field(() => ID, { nullable: true })
  preferred_reimbursement_type_id: string | null;

  @Field(() => ID, { nullable: true })
  override_reimbursement_type_id: string | null;

  @Field(() => ID, { nullable: true })
  effectiveReimbursementTypeId: string | null;

  @Field(() => ReimbursementTypeSummaryType, { nullable: true })
  preferredReimbursementType: ReimbursementTypeSummaryType | null;

  @Field(() => ReimbursementTypeSummaryType, { nullable: true })
  overrideReimbursementType: ReimbursementTypeSummaryType | null;

  @Field()
  created_at: Date;

  @Field()
  updated_at: Date;
}

@ObjectType()
export class ReimbursementCreditSummaryType {
  @Field(() => ID)
  id: string;

  @Field(() => Float)
  amount: number;

  @Field(() => ID, { nullable: true })
  reimbursement_id: string | null;

  @Field(() => ID, { nullable: true })
  creditable_id: string | null;

  @Field(() => String, { nullable: true })
  creditable_type: string | null;

  @Field(() => Date, { nullable: true })
  created_at: Date | null;

  @Field(() => Date, { nullable: true })
  updated_at: Date | null;
}

@ObjectType()
export class ReimbursementType {
  @Field(() => ID)
  id: string;

  @Field(() => String, { nullable: true })
  number: string | null;

  @Field(() => ReimbursementStatus, { nullable: true })
  reimbursement_status: ReimbursementStatus | null;

  @Field(() => ID, { nullable: true })
  order_id: string | null;

  @Field(() => ID, { nullable: true })
  customer_return_id: string | null;

  @Field(() => Float)
  total: number;

  @Field()
  created_at: Date;

  @Field()
  updated_at: Date;

  @Field(() => ReimbursementOrderSummaryType, { nullable: true })
  order: ReimbursementOrderSummaryType | null;

  @Field(() => ReimbursementCustomerReturnSummaryType, { nullable: true })
  customerReturn: ReimbursementCustomerReturnSummaryType | null;

  @Field(() => [ReimbursementItemSummaryType])
  returnItems: ReimbursementItemSummaryType[];

  @Field(() => [ReimbursementCreditSummaryType])
  reimbursementCredits: ReimbursementCreditSummaryType[];

  @Field(() => [ReimbursementRefundSummaryType])
  refunds: ReimbursementRefundSummaryType[];
}
