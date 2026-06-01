import { InputType, Field } from '@nestjs/graphql';
import GraphQLJSON from 'graphql-type-json';

@InputType()
export class CreateContactInput {
  @Field()
  email: string;

  @Field({ nullable: true })
  phone_number: string;

  @Field(() => GraphQLJSON, { nullable: true })
  social_media: any;
}