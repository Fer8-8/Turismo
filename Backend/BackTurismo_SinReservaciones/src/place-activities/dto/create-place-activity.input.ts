import { InputType, Int, Field, ID, Float } from '@nestjs/graphql';
import { Prisma } from '@prisma/client';
import GraphQLJSON from 'graphql-type-json';
import { DifficultyLevel } from '../enum/enum';

@InputType()
export class CreatePlaceActivityInput {
  @Field(() => ID, { nullable: true })
  place_id?: string

  @Field(() => String)
  activity_name: string

  @Field(() => DifficultyLevel)
  difficulty_level: DifficultyLevel

  @Field(() => Int)
  min_age: number

  @Field(() => Boolean)
  requires_equipment: boolean

  @Field(() => Float)
  additional_cost: number | Prisma.Decimal

  @Field(() => GraphQLJSON)
  available_months: any
}
