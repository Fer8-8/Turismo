import { Field, Float, ID, InputType } from '@nestjs/graphql';
import { IsBoolean, IsNumber, IsOptional, IsUUID, Min } from 'class-validator';

@InputType()
export class UpdateShippingRateInput {
  @Field(() => ID)
  @IsUUID()
  rateId: string;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0)
  cost?: number;

  @Field(() => ID, { nullable: true })
  @IsOptional()
  @IsUUID()
  taxRateId?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  selected?: boolean;
}