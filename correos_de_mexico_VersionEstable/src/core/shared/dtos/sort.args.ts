import { ArgsType, Field, registerEnumType } from '@nestjs/graphql';
import { IsOptional, IsString } from 'class-validator';

export enum SortDirection {
  ASC = 'ASC',
  DESC = 'DESC',
}

registerEnumType(SortDirection, {
  name: 'SortDirection',
  description: 'Direction to sort results',
});

// argumentos graphql para ordenamiento resultados
@ArgsType()
export class SortArgs {
  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  sortBy?: string;

  @Field(() => SortDirection, { defaultValue: SortDirection.DESC, nullable: true })
  @IsOptional()
  sortDirection?: SortDirection = SortDirection.DESC;
}
