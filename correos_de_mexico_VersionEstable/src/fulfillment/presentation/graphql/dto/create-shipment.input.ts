import { Field, Float, ID, InputType } from '@nestjs/graphql';
import { IsNumber, IsOptional, IsString, IsUUID, Min } from 'class-validator';

@InputType()
export class CreateShipmentInput {
  @Field(() => ID)
  @IsUUID()
  orderId: string;

  @Field(() => ID, { nullable: true })
  @IsOptional()
  @IsUUID()
  addressId?: string;

  @Field(() => ID, { nullable: true })
  @IsOptional()
  @IsUUID()
  stockLocationId?: string;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0)
  baseCost?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  tracking?: string;
}