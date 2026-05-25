import { InputType, Field, ID, ArgsType } from '@nestjs/graphql';
import { IsOptional, IsString, IsUUID } from 'class-validator';

@ArgsType()
export class FilterTaxCategoriesInput {
  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  search?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  tax_code?: string;
}

@ArgsType()
export class FilterTaxRatesInput {
  @Field(() => ID, { nullable: true })
  @IsUUID()
  @IsOptional()
  zone_id?: string;

  @Field(() => ID, { nullable: true })
  @IsUUID()
  @IsOptional()
  tax_category_id?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  search?: string;
}

@ArgsType()
export class FilterZonesInput {
  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  search?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  kind?: string;
}
