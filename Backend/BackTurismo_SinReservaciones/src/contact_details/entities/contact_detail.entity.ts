import { Field, ID, ObjectType } from "@nestjs/graphql";
import GraphQLJSON from 'graphql-type-json';

@ObjectType()
export class Contact_detail {
   @Field(() => ID, {nullable: true})
   id: string;
   
   @Field({nullable: true})
   email: string;

   @Field({nullable: true})
   phone_number: string;

   @Field( () => GraphQLJSON,{nullable: true})
   social_media?: any; 

   @Field({nullable: true})
   created_at: Date;

   @Field({nullable: true})
   updated_at: Date;
   
   
}
