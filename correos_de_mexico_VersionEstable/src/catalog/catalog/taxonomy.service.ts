import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateTaxonomyInput } from './dto/create-taxonomy.input';
import { UpdateTaxonomyInput } from './dto/update-taxonomy.input';
import { AppNotFoundException } from '../../core/shared';

const TAXONOMY_INCLUDE = {
  taxons: {
    where: { parent_id: null },
    orderBy: { position: 'asc' as const },
    include: {
      children: {
        orderBy: { position: 'asc' as const },
        include: {
          children: { orderBy: { position: 'asc' as const } },
        },
      },
    },
  },
} as const;

@Injectable()
export class TaxonomyService {
  constructor(private prisma: PrismaService) {}

  // ─── CRUD DE TAXONOMÍA ───────────────────────────────────

  async create(input: CreateTaxonomyInput) {
    return this.prisma.taxonomy.create({
      data: {
        name: input.name,
        position: input.position ?? 0,
        store_id: input.store_id,
      },
      include: TAXONOMY_INCLUDE,
    });
  }

  async findAll() {
    return this.prisma.taxonomy.findMany({
      include: TAXONOMY_INCLUDE,
      orderBy: { position: 'asc' },
    });
  }

  async findOne(id: string) {
    const taxonomy = await this.prisma.taxonomy.findUnique({
      where: { id },
      include: TAXONOMY_INCLUDE,
    });

    if (!taxonomy) {
      throw new AppNotFoundException('Taxonomy', id);
    }

    return taxonomy;
  }

  async update(id: string, input: UpdateTaxonomyInput) {
    await this.findOne(id);

    const { id: _, ...data } = input;
    return this.prisma.taxonomy.update({
      where: { id },
      data,
      include: TAXONOMY_INCLUDE,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.taxonomy.delete({ where: { id } });
    return true;
  }

  // ─── CONSULTAS POR TIENDA ───────────────────────────────

  async findByStore(storeId: string) {
    return this.prisma.taxonomy.findMany({
      where: { store_id: storeId },
      include: TAXONOMY_INCLUDE,
      orderBy: { position: 'asc' },
    });
  }

  async validateTaxonomyExists(id: string): Promise<boolean> {
    const t = await this.prisma.taxonomy.findUnique({
      where: { id },
      select: { id: true },
    });
    return !!t;
  }
}
