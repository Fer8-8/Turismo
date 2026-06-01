import { InputType, Int, Field, Float, ID } from '@nestjs/graphql';
import { Prisma } from '@prisma/client';
import { IsOptional } from 'class-validator';
import { GraphQLJSON } from 'graphql-type-json';

@InputType()
export class CreateRecommendationLogInput {
  @IsOptional()
  @Field(() => ID, { nullable: true })
    user_id?: string
    
  @IsOptional()
  @Field(() => ID, { nullable: true })
    session_id?: string 
    
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
  total_engagement_score: number | Prisma.Decimal;
}
