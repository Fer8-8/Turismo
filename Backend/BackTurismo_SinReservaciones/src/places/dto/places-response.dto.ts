import { Field, ObjectType } from '@nestjs/graphql';
import { Place } from '../entities/place.entity';
import { Info } from '../../common/pagination/models/info.model';

@ObjectType()
export class PlacesResponse {
  @Field(() => Info)
  info: Info;

  @Field(() => [Place])
  places: Place[];
}
