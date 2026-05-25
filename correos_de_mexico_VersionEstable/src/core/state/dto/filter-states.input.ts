import { Field, ID, ArgsType } from '@nestjs/graphql';

@ArgsType()
export class FilterStatesInput {
  // filtra estados por país
  @Field(() => ID, { nullable: true })
  countryId?: string;

  // búsqueda por nombre
  @Field(() => String, { nullable: true })
  search?: string;
}
