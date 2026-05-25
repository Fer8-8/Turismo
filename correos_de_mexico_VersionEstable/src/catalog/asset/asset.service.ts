import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateAssetInput } from './dto/create-asset.input';
import { UpdateAssetInput } from './dto/update-asset.input';
import { FilterAssetsInput } from './dto/filter-assets.input';
import { AppNotFoundException } from '../../core/shared';

@Injectable()
export class AssetService {
  private readonly logger = new Logger(AssetService.name);

  constructor(private readonly prisma: PrismaService) {}

  // ─── CRUD ────────────────────────────────────────────────

  async create(input: CreateAssetInput) {
    return this.prisma.asset.create({
      data: {
        attachment_file_name: input.attachment_file_name,
        attachment_content_type: input.attachment_content_type,
        attachment_file_size: input.attachment_file_size,
        attachment_width: input.attachment_width,
        attachment_height: input.attachment_height,
        alt: input.alt,
        position: input.position ?? 0,
        viewable_type: input.viewable_type,
        viewable_id: input.viewable_id,
        type: input.type,
      },
    });
  }

  // obtener asset por id, lanza NotFoundException si no existe o está eliminado
  async findById(id: string) {
    const asset = await this.prisma.asset.findFirst({
      where: { id, deleted_at: null },
    });
    if (!asset) throw new AppNotFoundException('Asset', id);
    return asset;
  }

  // listado administrativo con filtros opcionales
  async findAll(filter: FilterAssetsInput = {}) {
    const where: Record<string, unknown> = {};

    if (!filter.includeDeleted) {
      where.deleted_at = null;
    }
    if (filter.viewable_type) where.viewable_type = filter.viewable_type;
    if (filter.viewable_id) where.viewable_id = filter.viewable_id;
    if (filter.type) where.type = filter.type;

    return this.prisma.asset.findMany({
      where,
      orderBy: [{ viewable_type: 'asc' }, { position: 'asc' }],
    });
  }

  // listar assets de una entidad específica ordenados por posición
  async findByEntity(viewableType: string, viewableId: string) {
    return this.prisma.asset.findMany({
      where: {
        viewable_type: viewableType,
        viewable_id: viewableId,
        deleted_at: null,
      },
      orderBy: { position: 'asc' },
    });
  }

  // obtener asset principal (menor posición) de una entidad
  async findPrimary(viewableType: string, viewableId: string) {
    return this.prisma.asset.findFirst({
      where: {
        viewable_type: viewableType,
        viewable_id: viewableId,
        deleted_at: null,
      },
      orderBy: { position: 'asc' },
    });
  }

  // actualizar metadata del asset sin reemplazar el archivo
  async update(id: string, input: UpdateAssetInput) {
    await this.findById(id);
    return this.prisma.asset.update({
      where: { id },
      data: {
        attachment_file_name: input.attachment_file_name,
        attachment_content_type: input.attachment_content_type,
        attachment_file_size: input.attachment_file_size,
        attachment_width: input.attachment_width,
        attachment_height: input.attachment_height,
        alt: input.alt,
        position: input.position,
        type: input.type,
        attachment_updated_at: new Date(),
      },
    });
  }

  // baja lógica del asset — no elimina el registro
  async softDelete(id: string): Promise<boolean> {
    await this.findById(id);
    await this.prisma.asset.update({
      where: { id },
      data: { deleted_at: new Date() },
    });
    return true;
  }

  // restaurar asset eliminado lógicamente
  async restore(id: string): Promise<boolean> {
    const asset = await this.prisma.asset.findUnique({ where: { id } });
    if (!asset) throw new AppNotFoundException('Asset', id);
    await this.prisma.asset.update({
      where: { id },
      data: { deleted_at: null },
    });
    return true;
  }

  // eliminación permanente del registro
  async hardDelete(id: string): Promise<boolean> {
    const asset = await this.prisma.asset.findUnique({ where: { id } });
    if (!asset) throw new AppNotFoundException('Asset', id);
    await this.prisma.asset.delete({ where: { id } });
    return true;
  }

  // ─── REORDENAMIENTO ──────────────────────────────────────

  // reordenar assets de una entidad según el array de ids recibido
  async reorder(viewableType: string, viewableId: string, orderedIds: string[]) {
    const updates = orderedIds.map((assetId, index) =>
      this.prisma.asset.updateMany({
        where: {
          id: assetId,
          viewable_type: viewableType,
          viewable_id: viewableId,
        },
        data: { position: index },
      }),
    );
    await this.prisma.$transaction(updates);
    return this.findByEntity(viewableType, viewableId);
  }

  // ─── VALIDACIÓN ──────────────────────────────────────────

  async hasAssets(viewableType: string, viewableId: string): Promise<boolean> {
    const count = await this.prisma.asset.count({
      where: {
        viewable_type: viewableType,
        viewable_id: viewableId,
        deleted_at: null,
      },
    });
    return count > 0;
  }

  async validateAssetExists(id: string): Promise<boolean> {
    const asset = await this.prisma.asset.findFirst({
      where: { id, deleted_at: null },
    });
    if (!asset) throw new AppNotFoundException('Asset', id);
    return true;
  }
}
