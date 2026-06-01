import { Field, ObjectType } from '@nestjs/graphql';
import { Userfeaturescache } from '../entities/userfeaturescache.entity';
import { Info } from '../../common/pagination/models/info.model';

@ObjectType()
export class UserfeaturescacheResponse {
  @Field(() => Info)
  info: Info;

  @Field(() => [Userfeaturescache])
  userfeaturescaches: Userfeaturescache[];
}
