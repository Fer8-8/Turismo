import { ObjectType, Field, ID, Float, Int } from '@nestjs/graphql';
import { Prisma } from '@prisma/client';
import { GraphQLJSON } from 'graphql-type-json';
import { User } from 'src/users/entities/user.entity';

@ObjectType()
export class RecommendationLog {
  @Field(() => ID)
  id: string
  
  @Field(() => ID, { nullable: true })
  user_id: string | null
  
  @Field(() => ID, { nullable: true })
  session_id: string | null
  
  @Field(() => GraphQLJSON)
  request_context: any
  
  @Field(() => String)
  algorithm_version: string
  
  @Field(() => String)
  model_version: string
  
  @Field(() => GraphQLJSON)
  recommended_places: any
  
  @Field(() => GraphQLJSON)
  places_clicked: any
  
  @Field(() => GraphQLJSON)
  places_favorited: any
  
  @Field(() => Int)
  time_to_first_click_seconds: number
  
  @Field(() => Float)
  total_engagement_score: number | Prisma.Decimal
  
  @Field(() => Date)
  created_at: Date

  @Field(() => User, { nullable: true })
  User?: User | null

}
