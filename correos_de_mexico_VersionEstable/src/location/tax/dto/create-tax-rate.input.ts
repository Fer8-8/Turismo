import { InputType, Field, ID, Float } from '@nestjs/graphql';
import {
  IsString,
  IsBoolean,
  IsOptional,
  IsUUID,
  IsNumber,
  Min,
  Length,
} from 'class-validator';

@InputType()
export class CreateTaxRateInput {
  @Field(() => Float, { nullable: true })
  @IsNumber()
  @IsOptional()
  @Min(0)
  amount?: number;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  @Length(1, 255)
  name?: string;

  @Field(() => ID, { nullable: true })
  @IsUUID()
  @IsOptional()
  zone_id?: string;

  @Field(() => ID, { nullable: true })
  @IsUUID()
  @IsOptional()
  tax_category_id?: string;

  @Field({ nullable: true, defaultValue: false })
  @IsBoolean()
  @IsOptional()
  included_in_price?: boolean;

  @Field({ nullable: true, defaultValue: true })
  @IsBoolean()
  @IsOptional()
  show_rate_in_label?: boolean;
}
