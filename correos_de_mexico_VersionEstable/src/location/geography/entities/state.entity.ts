import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Country } from './country.entity';

@ObjectType()
export class GeoState {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  abbr: string;

  @Field(() => ID, { nullable: true })
  country_id?: string | null;

  @Field(() => Country, { nullable: true })
  country?: Country;

  @Field()
  created_at: Date;

  @Field()
  updated_at: Date;
}
