import { InputType, Field } from '@nestjs/graphql';
import { IsString, IsBoolean, IsOptional, Length } from 'class-validator';

@InputType()
export class CreateTaxCategoryInput {
  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  @Length(1, 255)
  name?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  description?: string;

  @Field({ nullable: true, defaultValue: false })
  @IsBoolean()
  @IsOptional()
  is_default?: boolean;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  @Length(1, 100)
  tax_code?: string;
}
