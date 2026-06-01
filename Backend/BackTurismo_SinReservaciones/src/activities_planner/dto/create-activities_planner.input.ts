import { InputType, ID, Field } from '@nestjs/graphql';

@InputType()
export class CreateActivitiesPlannerInput {
  @Field(() => Date)
  day: Date;

  @Field(() => ID, { nullable: true })
  id_planner?: string;
  
  @Field(() => [ID], { nullable: true })
  id_places?: string[];
}
