import { Field, ID, InputType } from '@nestjs/graphql';
import { IsOptional, IsString, IsUUID } from 'class-validator';

@InputType()
export class CreateReturnAuthorizationInput {
  @Field(() => ID)
  @IsUUID()
  orderId: string;

  @Field(() => ID, { nullable: true })
  @IsOptional()
  @IsUUID()
  reasonId?: string;

  @Field(() => ID, { nullable: true })
  @IsOptional()
  @IsUUID()
  stockLocationId?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  memo?: string;
}