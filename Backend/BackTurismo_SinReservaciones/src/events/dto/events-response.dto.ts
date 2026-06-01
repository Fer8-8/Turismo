import { Field, ObjectType } from '@nestjs/graphql';
import { Event } from '../entities/event.entity';
import { Info } from '../../common/pagination/models/info.model';

@ObjectType()
export class EventsResponse {
  @Field(() => Info)
  info: Info;

  @Field(() => [Event])
  events: Event[];
}
