import { Resolver, Query, Mutation, Args, ID, ResolveField, Parent, Int } from '@nestjs/graphql';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { CdmUser } from './entities/cdm-user.entity';
import { CreateCdmUserInput } from './dto/create-cdm-user.input';
import { UpdateCdmUserInput } from './dto/update-cdm-user.input';
import { FilterUsersInput, PaginationInput } from './dto/filter-users.input';
import { UserRoleType } from './types/user-role.type';
import { UserAddressSummaryType } from './types/address-summary.type';
import { UserOrderSummaryType } from './types/order-summary.type';
import { UserStoreCreditSummaryType } from './types/store-credit-summary.type';
import { UserCreditCardSummaryType } from './types/credit-card-summary.type';
import { UserStateChangeType } from './types/state-change.type';
import { SkipStoreContext } from '../shared/decorators';

// api graphql para usuarios de negocio y auth
@Resolver(() => CdmUser)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  // ─── QUERIES: USUARIOS DE NEGOCIO ─────────────────────────────────────────

  @Query(() => [CdmUser], { name: 'businessUsers' })
  @SkipStoreContext()
  findAllBusinessUsers(
    @Args('filter', { type: () => FilterUsersInput, nullable: true }) filter?: FilterUsersInput,
    @Args('pagination', { type: () => PaginationInput, nullable: true }) pagination?: PaginationInput,
  ) {
    return this.userService.findAllBusinessUsers(filter, pagination?.skip, pagination?.take);
  }

  @Query(() => CdmUser, { name: 'businessUser' })
  @SkipStoreContext()
  findBusinessUser(@Args('id', { type: () => ID }) id: string) {
    return this.userService.findBusinessUser(id);
  }

  @Query(() => CdmUser, { name: 'businessUserByEmail', nullable: true })
  @SkipStoreContext()
  findBusinessUserByEmail(@Args('email') email: string) {
    return this.userService.findBusinessUserByEmail(email);
  }

  @Query(() => Int, { name: 'businessUserCount' })
  @SkipStoreContext()
  countBusinessUsers(
    @Args('filter', { type: () => FilterUsersInput, nullable: true }) filter?: FilterUsersInput,
  ) {
    return this.userService.countBusinessUsers(filter);
  }

  // ─── MUTATIONS: USUARIOS DE NEGOCIO ──────────────────────────────────────

  @Mutation(() => CdmUser, { name: 'createBusinessUser' })
  @SkipStoreContext()
  createBusinessUser(@Args('input') input: CreateCdmUserInput) {
    return this.userService.createBusinessUser(input);
  }

  @Mutation(() => CdmUser, { name: 'updateBusinessUser' })
  @SkipStoreContext()
  updateBusinessUser(@Args('input') input: UpdateCdmUserInput) {
    return this.userService.updateBusinessUser(input.id, input);
  }

  @Mutation(() => CdmUser, { name: 'deactivateBusinessUser' })
  @SkipStoreContext()
  deactivateBusinessUser(@Args('id', { type: () => ID }) id: string) {
    return this.userService.deactivateUser(id);
  }

  @Mutation(() => CdmUser, { name: 'reactivateBusinessUser' })
  @SkipStoreContext()
  reactivateBusinessUser(@Args('id', { type: () => ID }) id: string) {
    return this.userService.reactivateUser(id);
  }

  // ─── MUTATIONS: ROLES ─────────────────────────────────────────────────────

  @Mutation(() => Boolean, { name: 'assignRoleToUser' })
  @SkipStoreContext()
  async assignRole(
    @Args('userId', { type: () => ID }) userId: string,
    @Args('roleId', { type: () => ID }) roleId: string,
  ) {
    await this.userService.assignRole(userId, roleId);
    return true;
  }

  @Mutation(() => Boolean, { name: 'removeRoleFromUser' })
  @SkipStoreContext()
  async removeRole(
    @Args('userId', { type: () => ID }) userId: string,
    @Args('roleId', { type: () => ID }) roleId: string,
  ) {
    await this.userService.removeRole(userId, roleId);
    return true;
  }

  // ─── MUTATIONS: DIRECCIONES ───────────────────────────────────────────────

  @Mutation(() => CdmUser, { name: 'setDefaultShipAddress' })
  @SkipStoreContext()
  setDefaultShipAddress(
    @Args('userId', { type: () => ID }) userId: string,
    @Args('addressId', { type: () => ID }) addressId: string,
  ) {
    return this.userService.setDefaultShipAddress(userId, addressId);
  }

  @Mutation(() => CdmUser, { name: 'setDefaultBillAddress' })
  @SkipStoreContext()
  setDefaultBillAddress(
    @Args('userId', { type: () => ID }) userId: string,
    @Args('addressId', { type: () => ID }) addressId: string,
  ) {
    return this.userService.setDefaultBillAddress(userId, addressId);
  }

  // ─── RESOLVE FIELDS — RELACIONES LAZY ────────────────────────────────────

  @ResolveField(() => [UserAddressSummaryType], { name: 'addresses' })
  addresses(@Parent() user: CdmUser) {
    return this.userService.getUserAddresses(user.id);
  }

  @ResolveField(() => UserAddressSummaryType, { name: 'shipAddress', nullable: true })
  shipAddress(@Parent() user: CdmUser) {
    return this.userService.getUserShipAddress(user.id);
  }

  @ResolveField(() => UserAddressSummaryType, { name: 'billAddress', nullable: true })
  billAddress(@Parent() user: CdmUser) {
    return this.userService.getUserBillAddress(user.id);
  }

  @ResolveField(() => [UserOrderSummaryType], { name: 'orders' })
  orders(
    @Parent() user: CdmUser,
    @Args('take', { type: () => Int, nullable: true, defaultValue: 20 }) take: number,
    @Args('skip', { type: () => Int, nullable: true, defaultValue: 0 }) skip: number,
  ) {
    return this.userService.getUserOrders(user.id, take, skip);
  }

  @ResolveField(() => [UserCreditCardSummaryType], { name: 'creditCards' })
  creditCards(@Parent() user: CdmUser) {
    return this.userService.getUserCreditCards(user.id);
  }

  @ResolveField(() => [UserStoreCreditSummaryType], { name: 'storeCredits' })
  storeCredits(@Parent() user: CdmUser) {
    return this.userService.getUserStoreCredits(user.id);
  }

  @ResolveField(() => [UserRoleType], { name: 'roles' })
  roles(@Parent() user: CdmUser) {
    return this.userService.getUserRoles(user.id);
  }

  @ResolveField(() => [UserStateChangeType], { name: 'stateChanges' })
  stateChanges(@Parent() user: CdmUser) {
    return this.userService.getUserStateChanges(user.id);
  }

  // ─── QUERIES: USUARIOS AUTH (Better Auth — admin) ─────────────────────────

  @Query(() => [User], { name: 'authUsers' })
  @SkipStoreContext()
  findAllAuthUsers() {
    return this.userService.findAllAuthUsers();
  }

  @Query(() => User, { name: 'authUser' })
  @SkipStoreContext()
  findAuthUser(@Args('id', { type: () => ID }) id: string) {
    return this.userService.findAuthUserById(id);
  }
}
