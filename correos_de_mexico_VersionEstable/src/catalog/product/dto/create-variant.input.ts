import { InputType, Field, ID, Int, Float } from '@nestjs/graphql';
import { IsString, IsOptional, IsBoolean, IsInt, Min, IsUUID, IsDate } from 'class-validator';
import { Type } from 'class-transformer';

@InputType()
export class CreateVariantInput {
  @Field(() => ID)
  @IsUUID(undefined, { message: 'product_id debe ser UUID válido' })
  product_id: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  sku?: string;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  weight?: number;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  height?: number;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  width?: number;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  depth?: number;

  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  @IsBoolean()
  is_master?: boolean;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  cost_price?: number;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  cost_currency?: string;

  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  @IsBoolean()
  track_inventory?: boolean;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  @Min(0)
  position?: number;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsUUID(undefined, { message: 'tax_category_id debe ser UUID válido' })
  tax_category_id?: string;

  @Field(() => Date, { nullable: true })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  discontinue_on?: Date;
}
