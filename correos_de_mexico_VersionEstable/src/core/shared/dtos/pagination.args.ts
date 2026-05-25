import { ArgsType, Field, Int } from '@nestjs/graphql';
import { Min, Max, IsOptional } from 'class-validator';

// argumentos graphql para paginación offset-limit
@ArgsType()
export class PaginationArgs {
  @Field(() => Int, { defaultValue: 0 })
  @Min(0)
  @IsOptional()
  offset: number = 0;

  @Field(() => Int, { defaultValue: 20 })
  @Min(1)
  @Max(100)
  @IsOptional()
  limit: number = 20;
}
