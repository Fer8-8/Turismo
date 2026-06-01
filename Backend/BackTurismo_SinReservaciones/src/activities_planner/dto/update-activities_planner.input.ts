import { CreateActivitiesPlannerInput } from './create-activities_planner.input';
import { InputType, Field, ID, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateActivitiesPlannerInput extends PartialType(CreateActivitiesPlannerInput) {
  @Field(() => ID)
  id: string;
}
