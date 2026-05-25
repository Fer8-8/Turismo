import { Field, Float, ID, InputType } from '@nestjs/graphql';
import { IsOptional, IsPositive, IsUUID } from 'class-validator';

@InputType()
export class RequestRefundForReimbursementInput {
  @Field(() => ID)
  @IsUUID()
  reimbursementId: string;

  @Field(() => ID)
  @IsUUID()
  refundReasonId: string;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsPositive()
  amount?: number;
}
