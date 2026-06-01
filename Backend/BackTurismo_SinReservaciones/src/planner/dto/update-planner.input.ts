import { CreatePlannerInput } from './create-planner.input';
import { InputType, Field, PartialType } from '@nestjs/graphql';
import { IsString } from 'class-validator';

@InputType()
export class UpdatePlannerInput extends PartialType(CreatePlannerInput) {
  @Field(() => String)
  @IsString()
  id: string;
}
