import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Place } from '../../places/entities/place.entity';
import { Event } from '../../events/entities/event.entity';

@ObjectType()
export class Favorite {
  @Field(() => ID)
  id: string;

  @Field(() => String, { nullable: true })
  id_user?: string;

  @Field(() => Date)
  created_at: Date;

  @Field(() => Date)
  updated_at: Date;

  @Field(() => [Place], { nullable: true })
  place?: Place[];

  @Field(() => [Event], { nullable: true })
  event?: Event[];
}
