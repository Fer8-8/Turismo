import { ObjectType, Field, Int, ID, Float } from '@nestjs/graphql';
import { Prisma } from '@prisma/client';
import GraphQLJSON from 'graphql-type-json';
import { User } from 'src/users/entities/user.entity';

@ObjectType()
export class Userfeaturescache {

  @Field(() => ID)
  id: string 

  @Field(() => ID, { nullable: true })
  user_id: string | null

  @Field(() => Int, {defaultValue: 0, nullable: true})
  total_interactions: number | null

  @Field(() => Int, {defaultValue: 0, nullable: true})
  total_favorites: number | null 

  @Field(() => Int, {defaultValue: 0, nullable: true})
  total_views: number | null 

  @Field(() => Int, {defaultValue: 0, nullable: true})
  total_booking: number | null 

  @Field(() => GraphQLJSON)
  top_categories: any 

  @Field(() => GraphQLJSON)
  top_states: any 

  @Field(() => GraphQLJSON)
  top_activities: any 

  @Field(() => String)
  avg_price_level_interacted: string 

  @Field(() => Int)
  avg_daily_cost_preference: number 

  @Field(() => Int)
  avg_session_duration_seconds: number 

  @Field(() => Float)
  favorite_ratio: number | Prisma.Decimal

  @Field(() => Float)
  booking_conversation_ratio: number | Prisma.Decimal

  @Field(() => Float)
  adventure_level_score: number | Prisma.Decimal

  @Field(() => Float)
  cultural_interest_score: number | Prisma.Decimal

  @Field(() => Float)
  beach_preference_score: number | Prisma.Decimal

  @Field(() => Float)
  nightlife_interest_score: number | Prisma.Decimal

  @Field(() => Date)
  last_interaction_at: Date 

  @Field(() => Date)
  created_at: Date

  @Field(() => Date)
  updated_at: Date 

  @Field(() => User, { nullable: true })
  User?: User | null;
}
