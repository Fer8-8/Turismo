import { InputType, Field, Int } from '@nestjs/graphql';
import { IsOptional, IsString, IsInt, Min, Max, IsBoolean } from 'class-validator';

@InputType()
export class FilterProductsInput {
  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  @Min(1, { message: 'página debe ser mínimo 1' })
  page?: number = 1;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  @Min(1, { message: 'límite debe ser mínimo 1' })
  @Max(100, { message: 'límite no puede exceder 100' })
  limit?: number = 10;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  search?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  slug?: string;

  @Field(() => String, { nullable: true, description: 'buscar por SKU de variante' })
  @IsOptional()
  @IsString()
  sku?: string;

  @Field(() => Boolean, { nullable: true, description: 'filtrar por disponibilidad comercial' })
  @IsOptional()
  @IsBoolean()
  available?: boolean;
}
