import { Resolver, Query, Mutation, Args, ID, ResolveField, Parent } from '@nestjs/graphql';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';
import { AddressService } from './address.service';
import { Address } from './entities/address.entity';
import { CreateAddressInput } from './dto/create-address.input';
import { UpdateAddressInput } from './dto/update-address.input';
import { State } from '../state/entities/state.entity';
import { Country } from '../state/entities/country.entity';
import { SkipStoreContext } from '../shared/decorators';
import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
class AddressDeleteResult {
  @Field()
  success: boolean;
}

// api graphql para manejar direcciones de usuarios
@Resolver(() => Address)
export class AddressResolver {
  constructor(private readonly addressService: AddressService) {}

  // obtiene todas las direcciones del sistema o de un usuario

  @Query(() => [Address], { name: 'addresses' })
  @AllowAnonymous()
  @SkipStoreContext()
  findAll() {
    return this.addressService.findAll();
  }

  @Query(() => Address, { name: 'address' })
  @AllowAnonymous()
  @SkipStoreContext()
  findById(@Args('id', { type: () => ID }) id: string) {
    return this.addressService.findById(id);
  }

  @Query(() => [Address], { name: 'addressesByUser' })
  @SkipStoreContext()
  findAddressesByUser(@Args('userId', { type: () => ID }) userId: string) {
    return this.addressService.findAddressesByUser(userId);
  }

  // crea, actualiza y borra direcciones de usuarios

  @Mutation(() => Address, { name: 'createAddress' })
  @SkipStoreContext()
  createAddress(@Args('input') input: CreateAddressInput) {
    return this.addressService.createAddress(input);
  }

  @Mutation(() => Address, { name: 'updateAddress' })
  @SkipStoreContext()
  updateAddress(@Args('input') input: UpdateAddressInput) {
    return this.addressService.updateAddress(input);
  }

  @Mutation(() => Address, { name: 'softDeleteAddress' })
  @SkipStoreContext()
  softDeleteAddress(@Args('id', { type: () => ID }) id: string) {
    return this.addressService.softDeleteAddress(id);
  }

  @Mutation(() => Address, { name: 'restoreAddress' })
  @SkipStoreContext()
  restoreAddress(@Args('id', { type: () => ID }) id: string) {
    return this.addressService.restoreAddress(id);
  }

  @Mutation(() => AddressDeleteResult, { name: 'deleteAddress' })
  @SkipStoreContext()
  deleteAddress(@Args('id', { type: () => ID }) id: string) {
    return this.addressService.hardDeleteAddress(id);
  }

  // ─── RESOLVE FIELDS ───────────────────────────────────────────────────────

  /** Resuelve el estado asociado a la dirección. */
  @ResolveField(() => State, { name: 'state', nullable: true })
  async resolveState(@Parent() address: Address) {
    if (!address.state_id) return null;
    return this.addressService.getAddressState(address.state_id);
  }

  /** Resuelve el país asociado a la dirección. */
  @ResolveField(() => Country, { name: 'country', nullable: true })
  async resolveCountry(@Parent() address: Address) {
    if (!address.country_id) return null;
    return this.addressService.getAddressCountry(address.country_id);
  }
}

