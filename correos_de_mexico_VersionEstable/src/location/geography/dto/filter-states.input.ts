import { InputType, Field, ID, ArgsType } from '@nestjs/graphql';
import { IsOptional, IsString, IsUUID } from 'class-validator';

@ArgsType()
export class FilterGeoStatesInput {
  /** Filtrar estados por país. */
  @Field(() => ID, { nullable: true })
  @IsUUID()
  @IsOptional()
  countryId?: string;

  /** Búsqueda por nombre (case-insensitive). */
  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  search?: string;
}
