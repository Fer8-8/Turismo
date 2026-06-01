import { ObjectType, Field, Int, Float, ID } from '@nestjs/graphql';
import { Prisma } from '@prisma/client';
import { TravelPartyType } from '../enum/enum';
import { Place } from '../../places/entities/place.entity';

@ObjectType()
export class Placefeaturecache {
  @Field(() => ID)
  id: string
  
  @Field(() => String, { nullable: true })
  place_id: string | null
  
  @Field(() => Int)
  total_interactions: number
  
  @Field(() => Int)
  total_favorites: number
  
  @Field(() => Int)
  total_views: number
  
  @Field(() => Int)
  total_bookings: number
  
  @Field(() => Int)
  total_reviews: number
  
  @Field(() => Float)
  avg_overral_rating: number | Prisma.Decimal
  
  @Field(() => Float)
  avg_value_rating: number | Prisma.Decimal
  
  @Field(() => Int)
  rating_count: number
  
  @Field(() => Int)
  views_last_7_days: number
  
  @Field(() => Int)
  views_last_30_days: number
  
  @Field(() => Float)
  trending_score: number | Prisma.Decimal
  
  @Field(() => String)
  avg_visitor_age_rate: string
  
  @Field(() => TravelPartyType)
  primary_travel_party_type: TravelPartyType
  
  @Field(() => Date)
  updated_at: Date
  
  @Field(() => Date)
  created_at: Date
  
  @Field(() => Place, { nullable: true })
  Place?: Place | null
  
}
