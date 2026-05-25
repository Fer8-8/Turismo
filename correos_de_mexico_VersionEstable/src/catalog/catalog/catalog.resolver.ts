import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { TaxonomyService } from './taxonomy.service';
import { TaxonService } from './taxon.service';
import { PropertyService } from './property.service';
import { PrototypeService } from './prototype.service';
import { Taxonomy } from './entities/taxonomy.entity';
import { Taxon } from './entities/taxon.entity';
import { Property } from './entities/property.entity';
import { ProductProperty } from './entities/product-property.entity';
import { ProductsTaxon } from './entities/products-taxon.entity';
import { Prototype } from './entities/prototype.entity';
import { OptionTypeRef } from './entities/option-type-ref.entity';
import { CreateTaxonomyInput } from './dto/create-taxonomy.input';
import { UpdateTaxonomyInput } from './dto/update-taxonomy.input';
import { CreateTaxonInput } from './dto/create-taxon.input';
import { UpdateTaxonInput } from './dto/update-taxon.input';
import { CreatePropertyInput } from './dto/create-property.input';
import { UpdatePropertyInput } from './dto/update-property.input';
import { CreateProductPropertyInput } from './dto/create-product-property.input';
import { UpdateProductPropertyInput } from './dto/update-product-property.input';
import { CreatePrototypeInput } from './dto/create-prototype.input';
import { UpdatePrototypeInput } from './dto/update-prototype.input';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';

@Resolver()
export class CatalogResolver {
  constructor(
    private readonly taxonomyService: TaxonomyService,
    private readonly taxonService: TaxonService,
    private readonly propertyService: PropertyService,
    private readonly prototypeService: PrototypeService,
  ) {}

  // ─── TAXONOMÍAS ─────────────────────────────────────────

  @Mutation(() => Taxonomy)
  createTaxonomy(
    @Args('createTaxonomyInput') input: CreateTaxonomyInput,
  ) {
    return this.taxonomyService.create(input);
  }

  @Query(() => [Taxonomy], { name: 'taxonomies' })
  @AllowAnonymous()
  findAllTaxonomies() {
    return this.taxonomyService.findAll();
  }

  @Query(() => Taxonomy, { name: 'taxonomy' })
  @AllowAnonymous()
  findTaxonomy(@Args('id', { type: () => ID }) id: string) {
    return this.taxonomyService.findOne(id);
  }

  @Query(() => [Taxonomy], { name: 'taxonomiesByStore' })
  @AllowAnonymous()
  findTaxonomiesByStore(
    @Args('storeId', { type: () => ID }) storeId: string,
  ) {
    return this.taxonomyService.findByStore(storeId);
  }

  @Mutation(() => Taxonomy)
  updateTaxonomy(
    @Args('updateTaxonomyInput') input: UpdateTaxonomyInput,
  ) {
    return this.taxonomyService.update(input.id, input);
  }

  @Mutation(() => Boolean)
  removeTaxonomy(@Args('id', { type: () => ID }) id: string) {
    return this.taxonomyService.remove(id);
  }

  // ─── TAXONS ─────────────────────────────────────────────

  @Mutation(() => Taxon)
  createTaxon(@Args('createTaxonInput') input: CreateTaxonInput) {
    return this.taxonService.create(input);
  }

  @Query(() => Taxon, { name: 'taxon' })
  @AllowAnonymous()
  findTaxon(@Args('id', { type: () => ID }) id: string) {
    return this.taxonService.findById(id);
  }

  @Query(() => [Taxon], { name: 'taxonsByTaxonomy' })
  @AllowAnonymous()
  findTaxonsByTaxonomy(
    @Args('taxonomyId', { type: () => ID }) taxonomyId: string,
  ) {
    return this.taxonService.findByTaxonomy(taxonomyId);
  }

  @Query(() => [Taxon], { name: 'taxonTree' })
  @AllowAnonymous()
  findTaxonTree(
    @Args('taxonomyId', { type: () => ID }) taxonomyId: string,
  ) {
    return this.taxonService.getTree(taxonomyId);
  }

  @Query(() => [Taxon], { name: 'taxonChildren' })
  @AllowAnonymous()
  findTaxonChildren(
    @Args('parentId', { type: () => ID }) parentId: string,
  ) {
    return this.taxonService.getChildren(parentId);
  }

  @Query(() => [Taxon], { name: 'taxonAncestors' })
  @AllowAnonymous()
  findTaxonAncestors(@Args('id', { type: () => ID }) id: string) {
    return this.taxonService.getAncestors(id);
  }

  @Query(() => [Taxon], { name: 'taxonDescendants' })
  @AllowAnonymous()
  findTaxonDescendants(@Args('id', { type: () => ID }) id: string) {
    return this.taxonService.getDescendants(id);
  }

  @Query(() => [Taxon], { name: 'visibleTaxons' })
  @AllowAnonymous()
  findVisibleTaxons(
    @Args('taxonomyId', { type: () => ID }) taxonomyId: string,
  ) {
    return this.taxonService.getVisibleTaxons(taxonomyId);
  }

  @Mutation(() => Taxon)
  updateTaxon(@Args('updateTaxonInput') input: UpdateTaxonInput) {
    return this.taxonService.update(input.id, input);
  }

  @Mutation(() => Boolean)
  removeTaxon(@Args('id', { type: () => ID }) id: string) {
    return this.taxonService.remove(id);
  }

  // ─── PRODUCTO ↔ TAXON ──────────────────────────────────

  @Mutation(() => ProductsTaxon)
  addProductToTaxon(
    @Args('productId', { type: () => ID }) productId: string,
    @Args('taxonId', { type: () => ID }) taxonId: string,
  ) {
    return this.taxonService.addProductToTaxon(productId, taxonId);
  }

  @Mutation(() => Boolean)
  removeProductFromTaxon(
    @Args('productId', { type: () => ID }) productId: string,
    @Args('taxonId', { type: () => ID }) taxonId: string,
  ) {
    return this.taxonService.removeProductFromTaxon(productId, taxonId);
  }

  @Query(() => [Taxon], { name: 'taxonsByProduct' })
  @AllowAnonymous()
  findTaxonsByProduct(
    @Args('productId', { type: () => ID }) productId: string,
  ) {
    return this.taxonService.getTaxonsByProduct(productId);
  }

  @Query(() => Boolean, { name: 'isProductInTaxon' })
  @AllowAnonymous()
  isProductInTaxon(
    @Args('productId', { type: () => ID }) productId: string,
    @Args('taxonId', { type: () => ID }) taxonId: string,
  ) {
    return this.taxonService.isProductInTaxon(productId, taxonId);
  }

  // ─── PROPIEDADES ────────────────────────────────────────

  @Mutation(() => Property)
  createProperty(
    @Args('createPropertyInput') input: CreatePropertyInput,
  ) {
    return this.propertyService.create(input);
  }

  @Query(() => [Property], { name: 'properties' })
  @AllowAnonymous()
  findAllProperties() {
    return this.propertyService.findAll();
  }

  @Query(() => Property, { name: 'property' })
  @AllowAnonymous()
  findProperty(@Args('id', { type: () => ID }) id: string) {
    return this.propertyService.findById(id);
  }

  @Query(() => [Property], { name: 'filterableProperties' })
  @AllowAnonymous()
  findFilterableProperties() {
    return this.propertyService.getFilterableProperties();
  }

  @Mutation(() => Property)
  updateProperty(
    @Args('updatePropertyInput') input: UpdatePropertyInput,
  ) {
    return this.propertyService.update(input.id, input);
  }

  @Mutation(() => Boolean)
  removeProperty(@Args('id', { type: () => ID }) id: string) {
    return this.propertyService.remove(id);
  }

  // ─── PRODUCTO ↔ PROPIEDAD ──────────────────────────────

  @Mutation(() => ProductProperty)
  createProductProperty(
    @Args('createProductPropertyInput') input: CreateProductPropertyInput,
  ) {
    return this.propertyService.createProductProperty(input);
  }

  @Query(() => [ProductProperty], { name: 'propertiesByProduct' })
  @AllowAnonymous()
  findPropertiesByProduct(
    @Args('productId', { type: () => ID }) productId: string,
  ) {
    return this.propertyService.getPropertiesByProduct(productId);
  }

  @Query(() => [ProductProperty], { name: 'visiblePropertiesByProduct' })
  @AllowAnonymous()
  findVisiblePropertiesByProduct(
    @Args('productId', { type: () => ID }) productId: string,
  ) {
    return this.propertyService.getVisiblePropertiesByProduct(productId);
  }

  @Mutation(() => ProductProperty)
  updateProductProperty(
    @Args('updateProductPropertyInput') input: UpdateProductPropertyInput,
  ) {
    return this.propertyService.updateProductProperty(input.id, input);
  }

  @Mutation(() => Boolean)
  removeProductProperty(@Args('id', { type: () => ID }) id: string) {
    return this.propertyService.removeProductProperty(id);
  }

  // ─── PROTOTIPOS ─────────────────────────────────────────

  @Mutation(() => Prototype)
  createPrototype(
    @Args('createPrototypeInput') input: CreatePrototypeInput,
  ) {
    return this.prototypeService.create(input);
  }

  @Query(() => [Prototype], { name: 'prototypes' })
  @AllowAnonymous()
  findAllPrototypes() {
    return this.prototypeService.findAll();
  }

  @Query(() => Prototype, { name: 'prototype' })
  @AllowAnonymous()
  findPrototype(@Args('id', { type: () => ID }) id: string) {
    return this.prototypeService.findById(id);
  }

  @Mutation(() => Prototype)
  updatePrototype(
    @Args('updatePrototypeInput') input: UpdatePrototypeInput,
  ) {
    return this.prototypeService.update(input.id, input);
  }

  @Mutation(() => Boolean)
  removePrototype(@Args('id', { type: () => ID }) id: string) {
    return this.prototypeService.remove(id);
  }

  // ─── PROTOTIPO ↔ PROPIEDAD ─────────────────────────────

  @Mutation(() => Boolean)
  addPropertyToPrototype(
    @Args('prototypeId', { type: () => ID }) prototypeId: string,
    @Args('propertyId', { type: () => ID }) propertyId: string,
  ) {
    return this.prototypeService
      .addPropertyToPrototype(prototypeId, propertyId)
      .then(() => true);
  }

  @Mutation(() => Boolean)
  removePropertyFromPrototype(
    @Args('prototypeId', { type: () => ID }) prototypeId: string,
    @Args('propertyId', { type: () => ID }) propertyId: string,
  ) {
    return this.prototypeService.removePropertyFromPrototype(
      prototypeId,
      propertyId,
    );
  }

  @Query(() => [Property], { name: 'propertiesByPrototype' })
  @AllowAnonymous()
  findPropertiesByPrototype(
    @Args('prototypeId', { type: () => ID }) prototypeId: string,
  ) {
    return this.prototypeService.getPropertiesByPrototype(prototypeId);
  }

  // ─── PROTOTIPO ↔ OPTION TYPE ───────────────────────────

  @Mutation(() => Boolean)
  addOptionTypeToPrototype(
    @Args('prototypeId', { type: () => ID }) prototypeId: string,
    @Args('optionTypeId', { type: () => ID }) optionTypeId: string,
  ) {
    return this.prototypeService
      .addOptionTypeToPrototype(prototypeId, optionTypeId)
      .then(() => true);
  }

  @Mutation(() => Boolean)
  removeOptionTypeFromPrototype(
    @Args('prototypeId', { type: () => ID }) prototypeId: string,
    @Args('optionTypeId', { type: () => ID }) optionTypeId: string,
  ) {
    return this.prototypeService.removeOptionTypeFromPrototype(
      prototypeId,
      optionTypeId,
    );
  }

  @Query(() => [OptionTypeRef], { name: 'optionTypesByPrototype' })
  @AllowAnonymous()
  findOptionTypesByPrototype(
    @Args('prototypeId', { type: () => ID }) prototypeId: string,
  ) {
    return this.prototypeService.getOptionTypesByPrototype(prototypeId);
  }
}
