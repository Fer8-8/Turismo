import { ObjectType, Field, ID, Int } from '@nestjs/graphql';

// país (tabla cdm_countries), usado por state y address
@ObjectType()
export class Country {
  @Field(() => ID)
  id: string;

  @Field()
  iso_name: string;

  @Field()
  iso: string;

  @Field()
  iso3: string;

  @Field()
  name: string;

  @Field(() => Int)
  numcode: number;

  // indica si este país requiere seleccionar un estado
  @Field()
  states_required: boolean;

  // indica si este país requiere código postal
  @Field()
  zipcode_required: boolean;

  @Field()
  created_at: Date;

  @Field()
  updated_at: Date;
}
