import { Field, ObjectType } from '@nestjs/graphql';
import { Favorite } from '../entities/favorite.entity';
import { Info } from '../../common/pagination/models/info.model';

@ObjectType()
export class FavoritesResponse {
  @Field(() => Info)
  info: Info;

  @Field(() => [Favorite])
  favorites: Favorite[];
}
