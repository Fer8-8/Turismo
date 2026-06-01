import { Field, Float, ID, ObjectType } from "@nestjs/graphql"
import GraphQLJSON from "graphql-type-json"

@ObjectType()
export class PlaceDraft {
    @Field(() => String)
    name: string

    @Field(() => String)
    description: string

    @Field(() => String)
    address: string

    @Field(() => Float)
    latitude: number

    @Field(() => Float)
    longitude: number
    
    @Field(() => ID, { nullable: true })
    id_category?: string
    
    @Field(() => GraphQLJSON, { nullable: true })
    details?: any
    
    @Field(() => ID, { nullable: true })
    contactDetails_id?: string
    
    @Field(() => GraphQLJSON, { nullable: true })
    languages_details?: any
    
    @Field(() => ID, { nullable: true })
    state_id?: string
}
