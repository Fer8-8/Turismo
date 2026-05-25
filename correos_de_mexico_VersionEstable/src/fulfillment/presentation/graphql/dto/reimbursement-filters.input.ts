import { Field, ID, InputType, Int } from '@nestjs/graphql';
import { IsInt, IsOptional, IsUUID, Min } from 'class-validator';
import { ReimbursementStatus } from '../../../domain/enums/reimbursement-status.enum';

@InputType()
export class ReimbursementFiltersInput {
  @Field(() => ID, { nullable: true })
  @IsOptional()
  @IsUUID()
  orderId?: string;

  @Field(() => ID, { nullable: true })
  @IsOptional()
  @IsUUID()
  customerReturnId?: string;

  @Field(() => ReimbursementStatus, { nullable: true })
  @IsOptional()
  status?: ReimbursementStatus;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  @Min(0)
  take?: number;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  @Min(0)
  skip?: number;
}
