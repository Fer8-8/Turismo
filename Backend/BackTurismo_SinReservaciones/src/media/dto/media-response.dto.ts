import { Field, ObjectType } from '@nestjs/graphql';
import { Media } from '../entities/media.entity';
import { Info } from '../../common/pagination/models/info.model';

@ObjectType()
export class MediaResponse {
  @Field(() => Info)
  info: Info;

  @Field(() => [Media])
  media: Media[];
}