import { CreatePlaceRequestInput } from './create-place_request.input';
import { InputType, Field, ID, PartialType } from '@nestjs/graphql';
import GraphQLJSON from 'graphql-type-json';

@InputType()
export class UpdatePlaceRequestInput extends PartialType(CreatePlaceRequestInput) {
  @Field(() => ID)
  id: string;

  @Field(() => GraphQLJSON, { nullable: true, description: "Partial info of the place to modify" })
  place_json?: any;
}
