import { Resolver, Query, Mutation, Args, Int, ID } from '@nestjs/graphql';
import { UserfeaturescacheService } from './userfeaturescache.service';
import { Userfeaturescache } from './entities/userfeaturescache.entity';
import { CreateUserfeaturescacheInput } from './dto/create-userfeaturescache.input';
import { UpdateUserfeaturescacheInput } from './dto/update-userfeaturescache.input';

import { PaginationArgs } from 'src/common/pagination/args/pagination.args';
import { UserfeaturescacheResponse } from './dto/userfeaturescache-response.dto';

@Resolver(() => Userfeaturescache)
export class UserfeaturescacheResolver {
  constructor(private readonly userfeaturescacheService: UserfeaturescacheService) {}

  @Mutation(() => Userfeaturescache)
  createUserfeaturescache(@Args('createUserfeaturescacheInput') createUserfeaturescacheInput: CreateUserfeaturescacheInput) {
    return this.userfeaturescacheService.create(createUserfeaturescacheInput);
  }

  @Query(() => UserfeaturescacheResponse, { name: 'userfeaturescaches' })
  findAll(@Args() paginationArgs: PaginationArgs) {
    return this.userfeaturescacheService.findAll(paginationArgs);
  }

  @Query(() => Userfeaturescache, { name: 'userfeaturescache', nullable: true })
  findOne(@Args('id', { type: () => ID }) id: string) {
    return this.userfeaturescacheService.findOne(id);
  }

  @Query(() => Userfeaturescache, { name: 'userfeaturescacheByUser', nullable: true })
  findByUserId(@Args('userId', { type: () => ID }) userId: string) {
    return this.userfeaturescacheService.findByUserId(userId);
  }

  // @Mutation(() => Userfeaturescache)
  // updateUserfeaturescache(@Args('updateUserfeaturescacheInput') updateUserfeaturescacheInput: UpdateUserfeaturescacheInput) {
  //   return this.userfeaturescacheService.update(updateUserfeaturescacheInput.id, updateUserfeaturescacheInput);
  // }

  // @Mutation(() => Userfeaturescache)
  // removeUserfeaturescache(@Args('id', { type: () => ID }) id: string) {
  //   return this.userfeaturescacheService.remove(id);
  // }
}
