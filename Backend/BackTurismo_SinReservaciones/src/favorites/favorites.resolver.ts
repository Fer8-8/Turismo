import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { FavoritesService } from './favorites.service';
import { Favorite } from './entities/favorite.entity';
import { CreateFavoriteInput } from './dto/create-favorite.input';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@thallesp/nestjs-better-auth';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { PaginationArgs } from '../common/pagination/args/pagination.args';
import { FavoritesResponse } from './dto/favorites-response.dto';

@Resolver(() => Favorite)
@UseGuards(AuthGuard)
export class FavoritesResolver {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Mutation(() => Favorite)
  createFavorite(
    @CurrentUser() user: User,
    @Args('createFavoriteInput') createFavoriteInput: CreateFavoriteInput,
  ) {
    return this.favoritesService.create(user, createFavoriteInput);
  }

  @Query(() => FavoritesResponse, { name: 'favorites' })
  findAll(
    @CurrentUser() user: User,
    @Args() paginationArgs: PaginationArgs,
  ) {
    return this.favoritesService.findAll(user, paginationArgs);
  }

  @Query(() => Favorite, { name: 'favorite' })
  findOne(
    @CurrentUser() user: User,
    @Args('id', { type: () => String }) id: string,
  ) {
    return this.favoritesService.findOne(user, id);
  }

  @Mutation(() => Favorite)
  removeFavorite(
    @CurrentUser() user: User,
    @Args('id', { type: () => String }) id: string,
  ) {
    return this.favoritesService.remove(user, id);
  }
}
