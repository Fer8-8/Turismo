import { InputType, Field } from '@nestjs/graphql';
import { IsString, MinLength, MaxLength, IsOptional, IsBoolean, IsUUID, IsDate } from 'class-validator';
import { Type } from 'class-transformer';

@InputType()
export class CreateProductInput {
  @Field(() => String)
  @IsString()
  @MinLength(3, { message: 'nombre debe tener mínimo 3 caracteres' })
  @MaxLength(255, { message: 'nombre no puede exceder 255 caracteres' })
  name: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(2000, { message: 'descripción no puede exceder 2000 caracteres' })
  description?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(255, { message: 'slug no puede exceder 255 caracteres' })
  slug?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(255, { message: 'meta_title no puede exceder 255 caracteres' })
  meta_title?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(500, { message: 'meta_description no puede exceder 500 caracteres' })
  meta_description?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(255, { message: 'meta_keywords no puede exceder 255 caracteres' })
  meta_keywords?: string;

  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  @IsBoolean()
  promotionable?: boolean;

  @Field(() => Date, { nullable: true })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  available_on?: Date;

  @Field(() => Date, { nullable: true })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  discontinue_on?: Date;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsUUID(undefined, { message: 'tax_category_id debe ser UUID válido' })
  tax_category_id?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsUUID(undefined, { message: 'shipping_category_id debe ser UUID válido' })
  shipping_category_id?: string;
}
