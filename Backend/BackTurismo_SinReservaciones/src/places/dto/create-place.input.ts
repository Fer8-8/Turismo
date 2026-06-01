import { InputType, Field, ID, Float } from '@nestjs/graphql';
import GraphQLJSON from 'graphql-type-json';
import { IsString, IsUUID, IsOptional, IsJSON, IsNumber, Max, Min } from 'class-validator';

@InputType()
export class CreatePlaceInput {
    @IsString()
    @Field(() => String)
    name: string

    @IsString()
    @IsOptional()
    @Field(() => String, { nullable: true })
    description?: string

    @IsString()
    @IsOptional()
    @Field(() => String, { nullable: true })
    address?: string

    @IsNumber()
    @IsOptional()
    @Field(() => Float, { nullable: true })
    @Max(90) @Min(-90)
    latitude?: number;

    @IsNumber()
    @IsOptional()
    @Max(180) @Min(-180)
    @Field(() => Float, { nullable: true })
    longitude?: number;

    @IsUUID()
    @IsOptional()
    @Field(() => ID, { nullable: true })
    state_id?: string

    @IsUUID()
    @IsOptional()
    @Field(() => ID, { nullable: true })
    id_category?: string

    @IsJSON()
    @IsOptional()
    @Field(() => GraphQLJSON, { nullable: true })
    details?: any

    @IsUUID()
    @IsOptional()
    @Field(() => ID, { nullable: true })
    contactDetails_id?: string

    @IsJSON()
    @IsOptional()
    @Field(() => GraphQLJSON, { nullable: true })
    languages_details?: any

    @IsUUID()
    @IsOptional()
    @Field(() => ID, { nullable: true })
    city_id?: string
}
