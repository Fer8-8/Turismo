import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql';
import GraphQLJSON from 'graphql-type-json';
import { Event } from 'src/events/entities/event.entity';
import { Place } from 'src/places/entities/place.entity';
import { User } from 'src/users/entities/user.entity';
import { IsString } from 'class-validator';
import { PlaceActivity } from 'src/place-activities/entities/place-activity.entity';
import { imageMetadata, videoMetadata } from '../interfaces';
import { $Enums } from '@prisma/client';

export const MediaStatus = $Enums.MediaStatus;
export type MediaStatus = $Enums.MediaStatus;

registerEnumType(MediaStatus, {
  name: 'MediaStatus',
  description: 'Status of the media upload',
});

@ObjectType()
export class Media {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  url: string;

  @Field(() => String)
  mime_type: string;

  @Field(() => String)
  alt_text: string;

  @Field(() => Boolean)
  isCover: boolean;

  @Field(() => String, { nullable: true })
  @IsString()
  event_id?: string | null;

  @Field(() => String, { nullable: true })
  @IsString()
  place_id?: string | null;

  @Field(() => String, { nullable: true })
  @IsString()
  review_id?: string | null;

  @Field(() => String, { nullable: true })
  @IsString()
  user_id?: string | null;

  @Field(() => GraphQLJSON, { nullable: true })
  metadata: imageMetadata | videoMetadata | null;

  @Field(() => Number, { nullable: true })
  size?: number | null;

  @Field(() => MediaStatus, { defaultValue: MediaStatus.PENDING })
  status: MediaStatus;

  @Field(() => String, { nullable: true })
  stream_url?: string | null;

  @Field(() => String, { nullable: true })
  miniature_url?: string | null;

  @Field()
  created_at: Date;

  @Field()
  updated_at: Date;

  @Field(() => String, { nullable: true })
  place_activities_id?: string | null;

  @Field(() => PlaceActivity, { nullable: true })
  place_activities?: PlaceActivity | null;

  @Field(() => Event, { nullable: true })
  event?: Event | null;

  @Field(() => Place, { nullable: true })
  place?: Place | null;

  @Field(() => User, { nullable: true })
  user?: User | null;
}
