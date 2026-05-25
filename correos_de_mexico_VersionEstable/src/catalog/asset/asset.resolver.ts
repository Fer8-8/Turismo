import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { AssetService } from './asset.service';
import { SlugService } from './slug.service';
import { Asset } from './entities/asset.entity';
import { FriendlySlug } from './entities/friendly-slug.entity';
import { CreateAssetInput } from './dto/create-asset.input';
import { UpdateAssetInput } from './dto/update-asset.input';
import { FilterAssetsInput } from './dto/filter-assets.input';
import { CreateSlugInput } from './dto/create-slug.input';
import { UpdateSlugInput } from './dto/update-slug.input';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';

@Resolver(() => Asset)
export class AssetResolver {
  constructor(
    private readonly assetService: AssetService,
    private readonly slugService: SlugService,
  ) {}

  // ─── ASSETS ──────────────────────────────────────────────

  // registrar nuevo asset con metadata técnica
  @Mutation(() => Asset)
  createAsset(@Args('createAssetInput') input: CreateAssetInput) {
    return this.assetService.create(input);
  }

  // obtener asset por id
  @Query(() => Asset, { name: 'asset' })
  @AllowAnonymous()
  findAssetById(@Args('id', { type: () => ID }) id: string) {
    return this.assetService.findById(id);
  }

  // listado administrativo de assets con filtros
  @Query(() => [Asset], { name: 'assets' })
  findAllAssets(
    @Args('filter', { nullable: true }) filter?: FilterAssetsInput,
  ) {
    return this.assetService.findAll(filter ?? {});
  }

  // listar assets de una entidad ordenados por posición
  @Query(() => [Asset], { name: 'assetsByEntity' })
  @AllowAnonymous()
  findAssetsByEntity(
    @Args('viewableType') viewableType: string,
    @Args('viewableId', { type: () => ID }) viewableId: string,
  ) {
    return this.assetService.findByEntity(viewableType, viewableId);
  }

  // obtener asset principal (posición más baja) de una entidad
  @Query(() => Asset, { name: 'primaryAsset', nullable: true })
  @AllowAnonymous()
  findPrimaryAsset(
    @Args('viewableType') viewableType: string,
    @Args('viewableId', { type: () => ID }) viewableId: string,
  ) {
    return this.assetService.findPrimary(viewableType, viewableId);
  }

  // actualizar metadata sin reemplazar el archivo
  @Mutation(() => Asset)
  updateAsset(@Args('updateAssetInput') input: UpdateAssetInput) {
    return this.assetService.update(input.id, input);
  }

  // baja lógica del asset
  @Mutation(() => Boolean)
  softDeleteAsset(@Args('id', { type: () => ID }) id: string) {
    return this.assetService.softDelete(id);
  }

  // restaurar asset eliminado lógicamente
  @Mutation(() => Boolean)
  restoreAsset(@Args('id', { type: () => ID }) id: string) {
    return this.assetService.restore(id);
  }

  // eliminación permanente del asset
  @Mutation(() => Boolean)
  hardDeleteAsset(@Args('id', { type: () => ID }) id: string) {
    return this.assetService.hardDelete(id);
  }

  // reordenar assets de una entidad según el array de ids recibido
  @Mutation(() => [Asset])
  reorderAssets(
    @Args('viewableType') viewableType: string,
    @Args('viewableId', { type: () => ID }) viewableId: string,
    @Args('orderedIds', { type: () => [ID] }) orderedIds: string[],
  ) {
    return this.assetService.reorder(viewableType, viewableId, orderedIds);
  }

  // verificar si una entidad tiene assets activos
  @Query(() => Boolean, { name: 'entityHasAssets' })
  @AllowAnonymous()
  entityHasAssets(
    @Args('viewableType') viewableType: string,
    @Args('viewableId', { type: () => ID }) viewableId: string,
  ) {
    return this.assetService.hasAssets(viewableType, viewableId);
  }

  // ─── SLUGS ───────────────────────────────────────────────

  // crear slug amigable para una entidad
  @Mutation(() => FriendlySlug)
  createSlug(@Args('createSlugInput') input: CreateSlugInput) {
    return this.slugService.create(input);
  }

  // resolver entidad a partir de su slug
  @Query(() => FriendlySlug, { name: 'slugByValue', nullable: true })
  @AllowAnonymous()
  findBySlug(
    @Args('slug') slug: string,
    @Args('scope', { nullable: true }) scope?: string,
  ) {
    return this.slugService.findBySlug(slug, scope);
  }

  // listar todos los slugs de una entidad
  @Query(() => [FriendlySlug], { name: 'slugsByEntity' })
  @AllowAnonymous()
  findSlugsByEntity(
    @Args('sluggableType') sluggableType: string,
    @Args('sluggableId', { type: () => ID }) sluggableId: string,
  ) {
    return this.slugService.findBySluggable(sluggableType, sluggableId);
  }

  // obtener slug principal de una entidad
  @Query(() => FriendlySlug, { name: 'primarySlug', nullable: true })
  @AllowAnonymous()
  findPrimarySlug(
    @Args('sluggableType') sluggableType: string,
    @Args('sluggableId', { type: () => ID }) sluggableId: string,
  ) {
    return this.slugService.findPrimaryBySluggable(sluggableType, sluggableId);
  }

  // actualizar slug con validación de unicidad
  @Mutation(() => FriendlySlug)
  updateSlug(@Args('updateSlugInput') input: UpdateSlugInput) {
    return this.slugService.update(input.id, input);
  }

  // eliminar slug
  @Mutation(() => Boolean)
  deleteSlug(@Args('id', { type: () => ID }) id: string) {
    return this.slugService.delete(id);
  }

  // verificar disponibilidad de un slug antes de guardarlo
  @Query(() => Boolean, { name: 'slugExists' })
  @AllowAnonymous()
  slugExists(
    @Args('slug') slug: string,
    @Args('scope', { nullable: true }) scope?: string,
  ) {
    return this.slugService.slugExists(slug, scope);
  }
}
