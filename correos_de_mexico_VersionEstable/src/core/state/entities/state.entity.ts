import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Country } from './country.entity';

// estado/provincia (tabla cdm_states), referenciado por address
@ObjectType()
export class State {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  abbr: string;

  @Field(() => ID, { nullable: true })
  country_id?: string | null;

  // país al que pertenece este estado
  @Field(() => Country, { nullable: true })
  country?: Country;

  @Field()
  updated_at: Date;

  @Field()
  created_at: Date;
}

