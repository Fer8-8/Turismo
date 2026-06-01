import { ObjectType, Field, Int, Float, ID } from '@nestjs/graphql';
import { Prisma } from '@prisma/client';
import GraphQLJSON from 'graphql-type-json';
import { DifficultyLevel } from '../enum/enum';
import { Place } from 'src/places/entities/place.entity';
import { Media } from 'src/media/entities/media.entity';

@ObjectType()
export class PlaceActivity {
  @Field(() => ID)
  id: string

  @Field(() => ID, { nullable: true })
  place_id: string | null

  @Field(() => String)
  activity_name: string

  @Field(() => DifficultyLevel)
  difficulty_level: DifficultyLevel //enum

  @Field(() => Int)
  min_age: number

  @Field(() => Boolean)
  requires_equipment: boolean

  @Field(() => Float)
  additional_cost: number | Prisma.Decimal

  @Field(() => GraphQLJSON)
  available_months: any

  @Field(() => Date)
  created_at: Date

  @Field(() => Date)
  updated_at: Date

  @Field(() => Place, { nullable: true })
  Place?: Place | null

  @Field(() => [Media], { nullable: true })
  media?: Media[] | null
}

