import { Field, ObjectType } from '@nestjs/graphql';
import { PlaceActivity } from '../entities/place-activity.entity';
import { Info } from '../../common/pagination/models/info.model';

@ObjectType()
export class PlaceActivitiesResponse {
  @Field(() => Info)
  info: Info;

  @Field(() => [PlaceActivity])
  placeActivities: PlaceActivity[];
}
