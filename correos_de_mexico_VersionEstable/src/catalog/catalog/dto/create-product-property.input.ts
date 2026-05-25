import { InputType, Field, Int } from '@nestjs/graphql';
import { IsString, IsOptional, IsUUID, IsBoolean, IsInt, Min, MaxLength } from 'class-validator';

@InputType()
export class CreateProductPropertyInput {
  @Field(() => String)
  @IsUUID('4', { message: 'product_id debe ser un UUID válido' })
  product_id: string;

  @Field(() => String)
  @IsUUID('4', { message: 'property_id debe ser un UUID válido' })
  property_id: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  value?: string;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  @Min(0)
  position?: number;

  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  @IsBoolean()
  show_property?: boolean;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  filter_param?: string;
}
