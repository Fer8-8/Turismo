import { Field, Float, ID, InputType } from '@nestjs/graphql';
import { IsOptional, IsUUID } from 'class-validator';

@InputType()
export class CreateReimbursementInput {
  @Field(() => ID)
  @IsUUID()
  orderId: string;

  @Field(() => ID, { nullable: true })
  @IsOptional()
  @IsUUID()
  customerReturnId?: string;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  total?: number;
}
