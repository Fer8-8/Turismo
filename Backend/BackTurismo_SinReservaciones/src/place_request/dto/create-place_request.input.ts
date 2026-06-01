import { InputType, ID, Field } from '@nestjs/graphql';
import { request_status } from '../enums/status.enum';
import { CreatePlaceInput } from 'src/places/dto/create-place.input';

@InputType()
export class CreatePlaceRequestInput {
  @Field(() => request_status, { defaultValue: request_status.pending })
  status?: request_status;

  @Field(() => ID, { nullable: true, description: "If left blank, it will automatically use the authenticated user's ID" })
  id_user?: string;

  @Field(() => CreatePlaceInput, { description: "Info of the place requested to create" })
  place_json: CreatePlaceInput;

  @Field(() => ID, { nullable: true })
  id_place?: string;
}
