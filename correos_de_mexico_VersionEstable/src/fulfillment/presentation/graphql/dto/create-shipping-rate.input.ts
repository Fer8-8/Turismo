import { Field, Float, ID, InputType } from '@nestjs/graphql';
import { IsBoolean, IsNumber, IsOptional, IsUUID, Min } from 'class-validator';

@InputType()
export class CreateShippingRateInput {
  @Field(() => ID)
  @IsUUID()
  shipmentId: string;

  @Field(() => ID)
  @IsUUID()
  shippingMethodId: string;

  @Field(() => Float)
  @IsNumber()
  @Min(0)
  cost: number;

  @Field(() => ID, { nullable: true })
  @IsOptional()
  @IsUUID()
  taxRateId?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  selected?: boolean;
}