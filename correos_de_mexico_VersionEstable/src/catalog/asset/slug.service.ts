import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateSlugInput } from './dto/create-slug.input';
import { UpdateSlugInput } from './dto/update-slug.input';
import { AppNotFoundException, AppConflictException } from '../../core/shared';

@Injectable()
export class SlugService {
  constructor(private readonly prisma: PrismaService) {}

  // crear slug validando unicidad dentro del scope
  async create(input: CreateSlugInput) {
    const existing = await this.prisma.friendlySlug.findFirst({
      where: {
        slug: input.slug,
        scope: input.scope ?? null,
      },
    });
    if (existing) {
      const scopeLabel = input.scope ? ` en scope "${input.scope}"` : '';
      throw new AppConflictException(`slug "${input.slug}" ya está en uso${scopeLabel}`);
    }

    return this.prisma.friendlySlug.create({
      data: {
        slug: input.slug,
        sluggable_type: input.sluggable_type,
        sluggable_id: input.sluggable_id,
        scope: input.scope,
        is_primary: input.is_primary ?? true,
      },
    });
  }

  // resolver entidad por slug — lanza NotFoundException si no existe
  async findBySlug(slug: string, scope?: string) {
    const record = await this.prisma.friendlySlug.findFirst({
      where: {
        slug,
        scope: scope ?? null,
      },
    });
    if (!record) throw new AppNotFoundException('FriendlySlug', slug);
    return record;
  }

  // obtener todos los slugs registrados para una entidad
  async findBySluggable(sluggableType: string, sluggableId: string) {
    return this.prisma.friendlySlug.findMany({
      where: {
        sluggable_type: sluggableType,
        sluggable_id: sluggableId,
      },
      orderBy: { is_primary: 'desc' },
    });
  }

  // obtener slug principal de una entidad
  async findPrimaryBySluggable(sluggableType: string, sluggableId: string) {
    return this.prisma.friendlySlug.findFirst({
      where: {
        sluggable_type: sluggableType,
        sluggable_id: sluggableId,
        is_primary: true,
      },
    });
  }

  // actualizar slug con validación de unicidad
  async update(id: string, input: UpdateSlugInput) {
    const record = await this.prisma.friendlySlug.findUnique({ where: { id } });
    if (!record) throw new AppNotFoundException('FriendlySlug', id);

    if (input.slug) {
      const effectiveScope = input.scope !== undefined ? input.scope : record.scope;
      const conflict = await this.prisma.friendlySlug.findFirst({
        where: {
          slug: input.slug,
          scope: effectiveScope ?? null,
          NOT: { id },
        },
      });
      if (conflict) {
        throw new AppConflictException(`slug "${input.slug}" ya está en uso`);
      }
    }

    return this.prisma.friendlySlug.update({
      where: { id },
      data: {
        slug: input.slug,
        is_primary: input.is_primary,
        scope: input.scope,
      },
    });
  }

  async delete(id: string): Promise<boolean> {
    const record = await this.prisma.friendlySlug.findUnique({ where: { id } });
    if (!record) throw new AppNotFoundException('FriendlySlug', id);
    await this.prisma.friendlySlug.delete({ where: { id } });
    return true;
  }

  // verificar si un slug ya está tomado (útil para UI)
  async slugExists(slug: string, scope?: string): Promise<boolean> {
    const count = await this.prisma.friendlySlug.count({
      where: { slug, scope: scope ?? null },
    });
    return count > 0;
  }
}
