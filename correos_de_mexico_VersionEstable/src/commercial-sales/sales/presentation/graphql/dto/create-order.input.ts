import { InputType, Field, ID, Int } from '@nestjs/graphql';
import { IsUUID, IsArray, ArrayMinSize, ValidateNested, IsInt, Min, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

@InputType()
export class LineItemInput {
  @Field(() => ID)
  @IsUUID()
  variantId: string;

  @Field(() => Int)
  @IsInt()
  @Min(1)
  quantity: number;
}

@InputType()
export class CreateOrderInput {
  @Field(() => ID)
  @IsUUID()
  userId: string;

  @Field(() => ID)
  @IsUUID()
  storeId: string;

  @Field(() => [LineItemInput])
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => LineItemInput)
  lineItems: LineItemInput[];

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  currency?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  channel?: string;
}
