import { ObjectType, Field, Int, ID, Float } from '@nestjs/graphql';
import { Prisma } from '@prisma/client';
import GraphQLJSON from 'graphql-type-json';
import {
  PriceLevel, EnvironmentType, DevelopmentLevel,
  CrowdLevel, BeachType, WaveType
} from '../enum/enum';
import { Place } from 'src/places/entities/place.entity';

@ObjectType()
export class PlaceAttribute {
  @Field(() => ID)
  id: string

  @Field(() => ID, { nullable: true })
  place_id: string | null

  @Field(() => String)
  municipality: string

  // @Field(() => Float)
  // latitude: number | Prisma.Decimal

  // @Field(() => Float)
  // longitude: number | Prisma.Decimal

  @Field(() => Boolean)
  is_pueblo_magico: boolean

  @Field(() => Boolean)
  is_unesco_heritage: boolean

  @Field(() => Boolean)
  is_protected_area: boolean

  @Field(() => PriceLevel)
  price_level: PriceLevel

  @Field(() => Float, { nullable: true })
  estimated_daily_cost_min: number | Prisma.Decimal | null

  @Field(() => Float, { nullable: true })
  estimated_daily_cost_max: number | Prisma.Decimal | null

  @Field(() => Int)
  accommodation_avg_cost: number

  @Field(() => Int)
  food_avg_cost: number

  @Field(() => GraphQLJSON)
  best_seasons: any

  @Field(() => GraphQLJSON)
  avoid_seasons: any

  @Field(() => GraphQLJSON)
  ideal_months: any

  @Field(() => Float, { nullable: true })
  typical_visit_hours: number | Prisma.Decimal | null

  @Field(() => Int, { nullable: true })
  recommended_days: number | null

  @Field(() => Boolean)
  has_vegan_options: boolean

  @Field(() => Boolean)
  has_vegetarian_options: boolean

  @Field(() => Boolean)
  has_gluten_free: boolean

  @Field(() => GraphQLJSON)
  cuisine_types: any

  @Field(() => String, { nullable: true })
  culinary_speciality: string | null

  @Field(() => Boolean)
  has_nightlife: boolean

  @Field(() => Boolean)
  wheelchair_accessible: boolean

  @Field(() => Boolean)
  has_parking: boolean

  @Field(() => Boolean)
  pet_friendly: boolean

  @Field(() => EnvironmentType)
  environment_type: EnvironmentType

  @Field(() => DevelopmentLevel)
  development_level: DevelopmentLevel

  @Field(() => CrowdLevel)
  crowd_level: CrowdLevel

  @Field(() => BeachType)
  beach_type: BeachType

  @Field(() => String)
  sand_color: string

  @Field(() => WaveType)
  wave_type: WaveType

  @Field(() => Boolean)
  has_reef: boolean

  @Field(() => Float)
  avg_temp_summer_celsius: number | Prisma.Decimal

  @Field(() => Float)
  avg_temp_winter_celsius: number | Prisma.Decimal

  @Field(() => Boolean)
  requires_guide: boolean

  @Field(() => Boolean)
  requires_permit: boolean

  @Field(() => Boolean, { nullable: true })
  verified: boolean | null

  @Field(() => Date, { nullable: true })
  verified_at: Date | null

  @Field(() => Date, { nullable: true })
  created_at: Date | null

  @Field(() => Date, { nullable: true })
  updated_at: Date | null

  @Field(() => Place, { nullable: true })
  Place?: Place | null

}
