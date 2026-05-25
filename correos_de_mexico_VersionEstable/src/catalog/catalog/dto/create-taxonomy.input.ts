import { InputType, Field, Int } from '@nestjs/graphql';
import { IsString, MinLength, MaxLength, IsOptional, IsInt, Min, IsUUID } from 'class-validator';

@InputType()
export class CreateTaxonomyInput {
  @Field(() => String)
  @IsString()
  @MinLength(2, { message: 'nombre debe tener mínimo 2 caracteres' })
  @MaxLength(255, { message: 'nombre no puede exceder 255 caracteres' })
  name: string;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsInt()
  @Min(0)
  position?: number;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsUUID('4', { message: 'store_id debe ser un UUID válido' })
  store_id?: string;
}
