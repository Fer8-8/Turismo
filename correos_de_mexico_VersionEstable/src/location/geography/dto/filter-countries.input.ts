import { InputType, Field, ArgsType } from '@nestjs/graphql';
import { IsOptional, IsString } from 'class-validator';

@ArgsType()
export class FilterCountriesInput {
  /** Filtrar por código ISO de 2 letras. */
  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  iso?: string;

  /** Búsqueda por nombre o iso_name (case-insensitive). */
  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  search?: string;
}
