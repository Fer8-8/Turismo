import { Field, Float, ID, InputType } from '@nestjs/graphql';
import { IsOptional, IsPositive, IsString, IsUUID } from 'class-validator';

@InputType()
export class CreateReimbursementCreditInput {
  @Field(() => ID)
  @IsUUID()
  reimbursementId: string;

  @Field(() => Float)
  @IsPositive()
  amount: number;

  @Field(() => ID, { nullable: true })
  @IsOptional()
  @IsUUID()
  creditableId?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  creditableType?: string;
}
