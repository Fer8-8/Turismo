import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { PlaceRequestService } from './place_request.service';
import { PlaceRequest } from './entities/place_request.entity';
import { CreatePlaceRequestInput } from './dto/create-place_request.input';
import { UpdatePlaceRequestInput } from './dto/update-place_request.input';
import { PaginationArgs } from 'src/common/pagination/args/pagination.args';
import { PlaceRequestResponse } from './dto/place_request-response.dto';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@thallesp/nestjs-better-auth';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { PlaceRequestFilterArgs } from './args/request-filter.args';
import { request_status } from "./enums/status.enum";

@Resolver(() => PlaceRequest)
@UseGuards(AuthGuard, RolesGuard)
export class PlaceRequestResolver {
  constructor(private readonly placeRequestService: PlaceRequestService) {}

  @Roles(Role.admin, Role.adminState, Role.partner, Role.user)
  @Mutation(() => PlaceRequest)
  createPlaceRequest(
    @CurrentUser() user: User,
    @Args('createPlaceRequestInput') createPlaceRequestInput: CreatePlaceRequestInput
  ) {
    createPlaceRequestInput.id_user = user.id;
    return this.placeRequestService.create(createPlaceRequestInput);
  }

  @Roles(Role.admin, Role.adminState, Role.partner, Role.user)
  @Query(() => PlaceRequestResponse, { name: 'placeRequests' })
  findAll(
    @CurrentUser() user: User,
    @Args() paginationArgs: PaginationArgs,
    @Args() filterArgs: PlaceRequestFilterArgs,
  ): Promise<PlaceRequestResponse> {
    return this.placeRequestService.findAll(user, paginationArgs, filterArgs);
  }

  @Roles(Role.admin, Role.adminState, Role.partner, Role.user)
  @Query(() => PlaceRequest, { name: 'placeRequest' })
  findOne(
    @CurrentUser() user: User,
    @Args('id', { type: () => ID }) id: string
  ): Promise<PlaceRequest> {
    return this.placeRequestService.findOne(user, id);
  }

  @Roles(Role.admin, Role.adminState, Role.partner, Role.user)
  @Mutation(() => PlaceRequest)
  updatePlaceRequest(
    @CurrentUser() user: User,
    @Args('updatePlaceRequestInput') updatePlaceRequestInput: UpdatePlaceRequestInput
  ) {
    return this.placeRequestService.update(user, updatePlaceRequestInput.id, updatePlaceRequestInput);
  }

  @Roles(Role.admin)
  @Mutation(() => PlaceRequest)
  removePlaceRequest(@Args('id', { type: () => ID }) id: string) {
    return this.placeRequestService.remove(id);
  }

  @Roles(Role.admin, Role.adminState)
  @Mutation(() => PlaceRequest, { name: "reviewPlaceRequest" })
  reviewPlaceRequest(
    @CurrentUser() user: User,
    @Args("id", { type: () => ID }) id: string,
    @Args("status", { type: () => request_status }) status: request_status
  ) {
    return this.placeRequestService.review(user, id, status);
  }
}
