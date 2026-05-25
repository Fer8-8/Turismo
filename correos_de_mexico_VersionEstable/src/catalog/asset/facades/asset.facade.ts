import { Injectable } from '@nestjs/common';
import { AssetService } from '../asset.service';
import { SlugService } from '../slug.service';
import { CreateAssetInput } from '../dto/create-asset.input';
import { UpdateAssetInput } from '../dto/update-asset.input';
import { CreateSlugInput } from '../dto/create-slug.input';

// punto de acceso público para que otros módulos gestionen assets y slugs
// sin tocar los internals del módulo
@Injectable()
export class AssetFacade {
  constructor(
    private readonly assetService: AssetService,
    private readonly slugService: SlugService,
  ) {}

  // ─── ASSETS ──────────────────────────────────────────────

  async getAssetById(id: string) {
    return this.assetService.findById(id);
  }

  // obtener galería ordenada de una entidad
  async getAssetsByEntity(viewableType: string, viewableId: string) {
    return this.assetService.findByEntity(viewableType, viewableId);
  }

  // obtener asset principal para imagen de portada
  async getPrimaryAsset(viewableType: string, viewableId: string) {
    return this.assetService.findPrimary(viewableType, viewableId);
  }

  async registerAsset(input: CreateAssetInput) {
    return this.assetService.create(input);
  }

  async updateAssetMetadata(id: string, input: UpdateAssetInput) {
    return this.assetService.update(id, input);
  }

  async entityHasAssets(viewableType: string, viewableId: string): Promise<boolean> {
    return this.assetService.hasAssets(viewableType, viewableId);
  }

  async validateAssetExists(id: string): Promise<boolean> {
    return this.assetService.validateAssetExists(id);
  }

  async reorderAssets(
    viewableType: string,
    viewableId: string,
    orderedIds: string[],
  ) {
    return this.assetService.reorder(viewableType, viewableId, orderedIds);
  }

  // ─── SLUGS ───────────────────────────────────────────────

  async createSlug(input: CreateSlugInput) {
    return this.slugService.create(input);
  }

  // resolver tipo y id de entidad a partir de un slug amigable
  async resolveEntityBySlug(slug: string, scope?: string) {
    return this.slugService.findBySlug(slug, scope);
  }

  async getPrimarySlug(sluggableType: string, sluggableId: string) {
    return this.slugService.findPrimaryBySluggable(sluggableType, sluggableId);
  }

  async getSlugsByEntity(sluggableType: string, sluggableId: string) {
    return this.slugService.findBySluggable(sluggableType, sluggableId);
  }

  async slugExists(slug: string, scope?: string): Promise<boolean> {
    return this.slugService.slugExists(slug, scope);
  }
}
