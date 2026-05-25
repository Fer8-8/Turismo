import { InputType, Field, ID, Float, Int } from '@nestjs/graphql';
import {
  IsOptional,
  IsString,
  IsArray,
  IsUUID,
  IsNumber,
  IsInt,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

@InputType()
export class EvaluationLineInput {
  @Field(() => ID)
  @IsUUID()
  lineItemId: string;

  @Field(() => ID, { nullable: true })
  @IsOptional()
  @IsUUID()
  variantId?: string;

  @Field(() => ID, { nullable: true })
  @IsOptional()
  @IsUUID()
  productId?: string;

  @Field(() => Int)
  @IsInt()
  @Min(1)
  quantity: number;

  @Field(() => Float)
  @IsNumber()
  @Min(0)
  unitPrice: number;

  @Field(() => Float)
  @IsNumber()
  @Min(0)
  lineSubtotal: number;
}

@InputType()
export class EvaluateOrderPromotionsInput {
  @Field(() => ID)
  @IsUUID()
  orderId: string;

  @Field(() => ID, { nullable: true })
  @IsOptional()
  @IsUUID()
  userId?: string;

  @Field(() => ID, { nullable: true })
  @IsOptional()
  @IsUUID()
  storeId?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  currency?: string;

  @Field(() => Float)
  @IsNumber()
  @Min(0)
  itemTotal: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  promoCode?: string;

  @Field(() => [EvaluationLineInput])
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EvaluationLineInput)
  lineItems: EvaluationLineInput[];
}
