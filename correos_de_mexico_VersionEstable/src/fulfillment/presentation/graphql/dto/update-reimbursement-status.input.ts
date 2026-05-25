import { Field, ID, InputType } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';
import { ReimbursementStatus } from '../../../domain/enums/reimbursement-status.enum';

@InputType()
export class UpdateReimbursementStatusInput {
  @Field(() => ID)
  @IsUUID()
  reimbursementId: string;

  @Field(() => ReimbursementStatus)
  status: ReimbursementStatus;
}
