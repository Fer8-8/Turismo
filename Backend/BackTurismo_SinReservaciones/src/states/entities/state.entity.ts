import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { Place } from '../../places/entities/place.entity';

@ObjectType()
export class State {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  name: string;

  @Field(() => String, { nullable: true })
  extension: string | null;

  @Field(() => Int, { nullable: true })
  population: number | null;

  @Field(() => String, { nullable: true })
  description: string | null;

  @Field(() => String)
  region: string;

  @Field(() => Date)
  created_at: Date;

  @Field(() => Date)
  updated_at: Date;

  @Field(() => [Place], { nullable: true })
  places?: Place[];

  // !TODO: Relaciones
  // events
  // reviews
  // planners
  // users
}
