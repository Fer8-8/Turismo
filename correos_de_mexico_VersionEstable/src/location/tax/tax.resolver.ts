import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';
import { SkipStoreContext } from '../../core/shared';
import { TaxCategoryService } from './tax-category.service';
import { TaxRateService } from './tax-rate.service';
import { ZoneService } from './zone.service';
import { TaxCategory } from './entities/tax-category.entity';
import { TaxRate } from './entities/tax-rate.entity';
import { TaxZone } from './entities/zone.entity';
import { ZoneMember } from './entities/zone-member.entity';
import { CreateTaxCategoryInput } from './dto/create-tax-category.input';
import { UpdateTaxCategoryInput } from './dto/update-tax-category.input';
import { CreateTaxRateInput } from './dto/create-tax-rate.input';
import { UpdateTaxRateInput } from './dto/update-tax-rate.input';
import { CreateZoneInput } from './dto/create-zone.input';
import { UpdateZoneInput } from './dto/update-zone.input';
import { CreateZoneMemberInput } from './dto/create-zone-member.input';
import {
  FilterTaxCategoriesInput,
  FilterTaxRatesInput,
  FilterZonesInput,
} from './dto/filters.input';

@Resolver()
export class TaxResolver {
  constructor(
    private readonly taxCategoryService: TaxCategoryService,
    private readonly taxRateService: TaxRateService,
    private readonly zoneService: ZoneService,
  ) {}

  // ─── TAX CATEGORIES — QUERIES ────────────────────────────

  @Query(() => [TaxCategory], { name: 'taxCategories' })
  @AllowAnonymous()
  @SkipStoreContext()
  findAllTaxCategories(
    @Args('filter', { type: () => FilterTaxCategoriesInput, nullable: true })
    filter?: FilterTaxCategoriesInput,
  ) {
    return this.taxCategoryService.findAll(filter);
  }

  @Query(() => TaxCategory, { name: 'taxCategory' })
  @AllowAnonymous()
  @SkipStoreContext()
  findTaxCategory(@Args('id', { type: () => ID }) id: string) {
    return this.taxCategoryService.findById(id);
  }

  @Query(() => TaxCategory, { name: 'taxCategoryDefault', nullable: true })
  @AllowAnonymous()
  @SkipStoreContext()
  findDefaultTaxCategory() {
    return this.taxCategoryService.findDefault();
  }

  // ─── TAX CATEGORIES — MUTATIONS ──────────────────────────

  @Mutation(() => TaxCategory)
  @SkipStoreContext()
  createTaxCategory(@Args('input') input: CreateTaxCategoryInput) {
    return this.taxCategoryService.create(input);
  }

  @Mutation(() => TaxCategory)
  @SkipStoreContext()
  updateTaxCategory(@Args('input') input: UpdateTaxCategoryInput) {
    return this.taxCategoryService.update(input.id, input);
  }

  @Mutation(() => Boolean)
  @SkipStoreContext()
  removeTaxCategory(@Args('id', { type: () => ID }) id: string) {
    return this.taxCategoryService.remove(id);
  }

  // ─── TAX RATES — QUERIES ─────────────────────────────────

  @Query(() => [TaxRate], { name: 'taxRates' })
  @AllowAnonymous()
  @SkipStoreContext()
  findAllTaxRates(
    @Args('filter', { type: () => FilterTaxRatesInput, nullable: true })
    filter?: FilterTaxRatesInput,
  ) {
    return this.taxRateService.findAll(filter);
  }

  @Query(() => TaxRate, { name: 'taxRate' })
  @AllowAnonymous()
  @SkipStoreContext()
  findTaxRate(@Args('id', { type: () => ID }) id: string) {
    return this.taxRateService.findById(id);
  }

  @Query(() => [TaxRate], { name: 'taxRatesByZone' })
  @AllowAnonymous()
  @SkipStoreContext()
  findTaxRatesByZone(@Args('zoneId', { type: () => ID }) zoneId: string) {
    return this.taxRateService.findByZone(zoneId);
  }

  @Query(() => [TaxRate], { name: 'taxRatesByCategory' })
  @AllowAnonymous()
  @SkipStoreContext()
  findTaxRatesByCategory(
    @Args('categoryId', { type: () => ID }) categoryId: string,
  ) {
    return this.taxRateService.findByCategory(categoryId);
  }

  // ─── TAX RATES — MUTATIONS ───────────────────────────────

  @Mutation(() => TaxRate)
  @SkipStoreContext()
  createTaxRate(@Args('input') input: CreateTaxRateInput) {
    return this.taxRateService.create(input);
  }

  @Mutation(() => TaxRate)
  @SkipStoreContext()
  updateTaxRate(@Args('input') input: UpdateTaxRateInput) {
    return this.taxRateService.update(input.id, input);
  }

  @Mutation(() => Boolean)
  @SkipStoreContext()
  removeTaxRate(@Args('id', { type: () => ID }) id: string) {
    return this.taxRateService.remove(id);
  }

  // ─── ZONES — QUERIES ─────────────────────────────────────

  @Query(() => [TaxZone], { name: 'taxZones' })
  @AllowAnonymous()
  @SkipStoreContext()
  findAllZones(
    @Args('filter', { type: () => FilterZonesInput, nullable: true })
    filter?: FilterZonesInput,
  ) {
    return this.zoneService.findAll(filter);
  }

  @Query(() => TaxZone, { name: 'taxZone' })
  @AllowAnonymous()
  @SkipStoreContext()
  findZone(@Args('id', { type: () => ID }) id: string) {
    return this.zoneService.findById(id);
  }

  @Query(() => [ZoneMember], { name: 'taxZoneMembers' })
  @AllowAnonymous()
  @SkipStoreContext()
  findZoneMembers(@Args('zoneId', { type: () => ID }) zoneId: string) {
    return this.zoneService.getMembersByZone(zoneId);
  }

  // ─── ZONES — MUTATIONS ───────────────────────────────────

  @Mutation(() => TaxZone)
  @SkipStoreContext()
  createTaxZone(@Args('input') input: CreateZoneInput) {
    return this.zoneService.create(input);
  }

  @Mutation(() => TaxZone)
  @SkipStoreContext()
  updateTaxZone(@Args('input') input: UpdateZoneInput) {
    return this.zoneService.update(input.id, input);
  }

  @Mutation(() => Boolean)
  @SkipStoreContext()
  removeTaxZone(@Args('id', { type: () => ID }) id: string) {
    return this.zoneService.remove(id);
  }

  @Mutation(() => ZoneMember)
  @SkipStoreContext()
  addTaxZoneMember(@Args('input') input: CreateZoneMemberInput) {
    return this.zoneService.addMember(input);
  }

  @Mutation(() => Boolean)
  @SkipStoreContext()
  removeTaxZoneMember(@Args('id', { type: () => ID }) id: string) {
    return this.zoneService.removeMember(id);
  }
}
