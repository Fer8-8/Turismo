import { InputType, Int, Field, ID, Float } from '@nestjs/graphql';
import { IsNumber, IsOptional, IsUUID, IsInt, IsDate } from 'class-validator';
import GraphQLJSON from 'graphql-type-json';

@InputType()
export class CreateUserfeaturescacheInput {
    @IsUUID()  
    @Field(() => ID)
    user_id: string 
  
    @IsNumber()
    @IsOptional()
    @IsInt()
    @Field(() => Int, {defaultValue: 0, nullable: true})
    total_interactions?: number
  
    @IsNumber()
    @IsOptional()
    @IsInt()
    @Field(() => Int, {defaultValue: 0, nullable: true})
    total_favorites?: number 
  
    @IsNumber()
    @IsOptional()
    @IsInt()
    @Field(() => Int, {defaultValue: 0, nullable: true})
    total_views?: number 
  
    @IsNumber()
    @IsOptional()
    @IsInt()
    @Field(() => Int, {defaultValue: 0, nullable: true})
    total_booking?: number 
  
    @Field(() => GraphQLJSON)
    top_categories: any 
  
    @Field(() => GraphQLJSON)
    top_states: any 
  
    @Field(() => GraphQLJSON)
    top_activities: any 
  
    @Field(() => String)
    avg_price_level_interacted: string 
  
    @IsNumber()
    @IsInt()
    @Field(() => Int)
    avg_daily_cost_preference: number 
  
    @IsNumber()
    @IsInt()
    @Field(() => Int)
    avg_session_duration_seconds: number 
  
    @IsNumber()
    @Field(() => Float)
    favorite_ratio: number 
  
    @IsNumber()
    @Field(() => Float)
    booking_conversation_ratio: number 
  
    @IsNumber()
    @Field(() => Float)
    adventure_level_score: number 
  
    @IsNumber()
    @Field(() => Float)
    cultural_interest_score: number 
  
    @IsNumber()
    @Field(() => Float)
    beach_preference_score: number 
  
    @IsNumber()
    @Field(() => Float)
    nightlife_interest_score: number 
  
    @IsDate()
    @Field(() => Date)
    last_interaction_at: Date 
}
