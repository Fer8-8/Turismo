import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Place } from 'src/places/entities/place.entity';
import { Planner } from 'src/planner/entities/planner.entity';

@ObjectType()
export class ActivitiesPlanner {
  @Field(() => ID)
  id: string;

  @Field(() => Date, { nullable: true })
  day: Date | null;

  @Field(() => String, { nullable: true })
  id_planner: string | null;

  @Field(() => Planner, { nullable: true })
  planner: Planner | null;

  @Field(() => [Place], { nullable: true })
  places: Place[] | null;
}
