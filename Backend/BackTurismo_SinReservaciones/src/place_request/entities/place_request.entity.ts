import { ObjectType, Field, ID } from '@nestjs/graphql';
import { request_status } from '../enums/status.enum';
import { User } from 'src/users/entities/user.entity';
import { Place } from 'src/places/entities/place.entity';
import { PlaceDraft } from '../types/place_json.type';
import { RequestHistoryEntry } from '../types/request-history-entry.type';

@ObjectType()
export class PlaceRequest {
  @Field(() => ID)
  id: string;

  @Field(() => request_status, { description: "Request Status" })
  status: request_status;

  @Field(() => ID)
  id_user: string;
  
  @Field(() => User)
  user: User;

  @Field(() => PlaceDraft, { description: "Info of the place requested to create" })
  place_json: PlaceDraft;

  @Field(() => [RequestHistoryEntry], { nullable: true, description: "History of changes made to the request" })
  history_json?: RequestHistoryEntry[];
  
  @Field(() => ID, { nullable: true })
  id_place?: string;

  @Field(() => Place, { nullable: true })
  place?: Place;

  @Field(() => Date)
  created_at: Date;

  @Field(() => Date)
  updated_at: Date;
}
