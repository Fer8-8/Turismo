import { InputType, Int, Field, ID, Float } from '@nestjs/graphql';
import GraphQLJSON from 'graphql-type-json';
import { PriceLevel, EnvironmentType, DevelopmentLevel,
         CrowdLevel, BeachType, WaveType } from '../enum/enum';
import { IsNumber, Max, Min } from 'class-validator';

@InputType()
export class CreatePlaceAttributeInput {
    @Field(() => ID, { nullable: true })
    place_id?: string

    @Field(() => String)
    municipality: string

    // @IsNumber()
    // @Field(() => Float)
    // @Max(90) @Min(-90)
    // latitude: number;

    // @IsNumber()
    // @Max(180) @Min(-180)
    // @Field(() => Float)
    // longitude: number;
    
    @Field(() => Boolean)
    is_pueblo_magico: boolean
    
    @Field(() => Boolean)
    is_unesco_heritage: boolean
    
    @Field(() => Boolean)
    is_protected_area: boolean
    
    @Field(() => PriceLevel)
    price_level: PriceLevel
    
    @Field(() => Float)
    estimated_daily_cost_min: number
    
    @Field(() => Float)
    estimated_daily_cost_max: number
    
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
    
    @Field(() => Float)
    typical_visit_hours: number
    
    @Field(() => Int)
    recommended_days: number
    
    @Field(() => Boolean)
    has_vegan_options: boolean
    
    @Field(() => Boolean)
    has_vegetarian_options: boolean
    
    @Field(() => Boolean)
    has_gluten_free: boolean
    
    @Field(() => GraphQLJSON)
    cuisine_types: any
    
    @Field(() => String)
    culinary_speciality: string
    
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
    avg_temp_summer_celsius: number
    
    @Field(() => Float)
    avg_temp_winter_celsius: number
    
    @Field(() => Boolean)
    requires_guide: boolean
    
    @Field(() => Boolean)
    requires_permit: boolean
    
    @Field(() => Boolean, { nullable: true })
    verified?: boolean
    
    @Field(() => Date, { nullable: true })
    verified_at?: Date
}
