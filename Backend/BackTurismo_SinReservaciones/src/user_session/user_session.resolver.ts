import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { UserSessionService } from './user_session.service';
import { UserSession } from './entities/user_session.entity';
import { CreateUserSessionInput } from './dto/create-user_session.input';
import { UpdateUserSessionInput } from './dto/update-user_session.input';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';
import { PaginationArgs } from 'src/common/pagination/args/pagination.args';
import { UserSessionResponse } from './dto/user-session-response.dto';
import { ValidUserArgs } from './args/user.arg';
import { ValidDeviceArgs } from './args/device.arg';

@Resolver(() => UserSession)
export class UserSessionResolver {
  constructor(private readonly userSessionService: UserSessionService) {}

  @AllowAnonymous()
  @Mutation(() => UserSession, { description: "create a new user session"} )
  createUserSession(@Args('createUserSessionInput') createUserSessionInput: CreateUserSessionInput): Promise<UserSession> {
    return this.userSessionService.create(createUserSessionInput);
  }

  @AllowAnonymous()
  @Query(() => UserSessionResponse, { name: 'userSessions' })
  findAll(
    @Args() ValidUserArgs: ValidUserArgs,
    @Args() ValidDeviceArgs: ValidDeviceArgs,
    @Args() paginationArgs: PaginationArgs
  ): Promise<UserSessionResponse> {
    return this.userSessionService.findAll(
      ValidUserArgs.user_ids,
      ValidDeviceArgs.device_types,
      paginationArgs
    );
  }

  @AllowAnonymous()
  @Query(() => UserSession, { name: 'userSession' })
  findOne(@Args('id', { type: () => ID }) id: string) {
    return this.userSessionService.findOne(id);
  }

  @AllowAnonymous()
  @Mutation(() => UserSession)
  updateUserSession(@Args('updateUserSessionInput') updateUserSessionInput: UpdateUserSessionInput) {
    return this.userSessionService.update(updateUserSessionInput.id, updateUserSessionInput);
  }

  // @Mutation(() => UserSession)
  // removeUserSession(@Args('id', { type: () => Int }) id: number) {
  //   return this.userSessionService.remove(id);
  // }
}
