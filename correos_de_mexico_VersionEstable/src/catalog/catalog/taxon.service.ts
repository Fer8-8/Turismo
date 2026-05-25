import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateTaxonInput } from './dto/create-taxon.input';
import { UpdateTaxonInput } from './dto/update-taxon.input';
import { AppNotFoundException, AppConflictException } from '../../core/shared';

const TAXON_INCLUDE = {
  children: {
    orderBy: { position: 'asc' as const },
    include: {
      children: { orderBy: { position: 'asc' as const } },
    },
  },
  parent: true,
} as const;

@Injectable()
export class TaxonService {
  constructor(private prisma: PrismaService) {}

  // ─── CRUD DE TAXON ───────────────────────────────────────

  async create(input: CreateTaxonInput) {
    // calcular depth a partir del padre si existe
    let depth = 0;
    if (input.parent_id) {
      const parent = await this.prisma.taxon.findUnique({
        where: { id: input.parent_id },
        select: { depth: true },
      });
      if (!parent) {
        throw new AppNotFoundException('Taxon (parent)', input.parent_id);
      }
      depth = (parent.depth ?? 0) + 1;
    }

    return this.prisma.taxon.create({
      data: {
        name: input.name,
        taxonomy_id: input.taxonomy_id,
        parent_id: input.parent_id,
        permalink: input.permalink,
        description: input.description,
        meta_title: input.meta_title,
        meta_description: input.meta_description,
        meta_keywords: input.meta_keywords,
        position: input.position ?? 0,
        depth,
        hide_from_nav: input.hide_from_nav ?? false,
      },
      include: TAXON_INCLUDE,
    });
  }

  async findById(id: string) {
    const taxon = await this.prisma.taxon.findUnique({
      where: { id },
      include: TAXON_INCLUDE,
    });

    if (!taxon) {
      throw new AppNotFoundException('Taxon', id);
    }

    return taxon;
  }

  async findByTaxonomy(taxonomyId: string) {
    return this.prisma.taxon.findMany({
      where: { taxonomy_id: taxonomyId },
      include: TAXON_INCLUDE,
      orderBy: { position: 'asc' },
    });
  }

  async update(id: string, input: UpdateTaxonInput) {
    await this.findById(id);

    const { id: _, ...data } = input;

    // recalcular depth si cambia parent
    if (input.parent_id !== undefined) {
      if (input.parent_id) {
        const parent = await this.prisma.taxon.findUnique({
          where: { id: input.parent_id },
          select: { depth: true },
        });
        if (!parent) {
          throw new AppNotFoundException('Taxon (parent)', input.parent_id);
        }
        (data as any).depth = (parent.depth ?? 0) + 1;
      } else {
        (data as any).depth = 0;
      }
    }

    return this.prisma.taxon.update({
      where: { id },
      data,
      include: TAXON_INCLUDE,
    });
  }

  async remove(id: string) {
    await this.findById(id);
    await this.prisma.taxon.delete({ where: { id } });
    return true;
  }

  // ─── JERARQUÍA ──────────────────────────────────────────

  // obtener taxons raíz (sin padre) de una taxonomía
  async getRootTaxons(taxonomyId: string) {
    return this.prisma.taxon.findMany({
      where: { taxonomy_id: taxonomyId, parent_id: null },
      include: TAXON_INCLUDE,
      orderBy: { position: 'asc' },
    });
  }

  // obtener hijos directos de un taxon
  async getChildren(parentId: string) {
    return this.prisma.taxon.findMany({
      where: { parent_id: parentId },
      include: TAXON_INCLUDE,
      orderBy: { position: 'asc' },
    });
  }

  // obtener cadena de ancestros desde taxon hasta la raíz
  async getAncestors(id: string): Promise<any[]> {
    const ancestors: any[] = [];
    let current = await this.prisma.taxon.findUnique({
      where: { id },
      include: { parent: true },
    });

    while (current?.parent) {
      ancestors.unshift(current.parent);
      current = await this.prisma.taxon.findUnique({
        where: { id: current.parent.id },
        include: { parent: true },
      });
    }

    return ancestors;
  }

  // obtener todos los descendientes recursivos de un taxon
  async getDescendants(id: string): Promise<any[]> {
    const descendants: any[] = [];
    const children = await this.prisma.taxon.findMany({
      where: { parent_id: id },
      orderBy: { position: 'asc' },
    });

    for (const child of children) {
      descendants.push(child);
      const childDescendants = await this.getDescendants(child.id);
      descendants.push(...childDescendants);
    }

    return descendants;
  }

  // obtener árbol completo de una taxonomía
  async getTree(taxonomyId: string) {
    return this.prisma.taxon.findMany({
      where: { taxonomy_id: taxonomyId, parent_id: null },
      include: {
        children: {
          orderBy: { position: 'asc' },
          include: {
            children: {
              orderBy: { position: 'asc' },
              include: {
                children: { orderBy: { position: 'asc' } },
              },
            },
          },
        },
      },
      orderBy: { position: 'asc' },
    });
  }

  // obtener taxons visibles para navegación
  async getVisibleTaxons(taxonomyId: string) {
    return this.prisma.taxon.findMany({
      where: { taxonomy_id: taxonomyId, hide_from_nav: false },
      include: TAXON_INCLUDE,
      orderBy: { position: 'asc' },
    });
  }

  // ─── RELACIÓN PRODUCTO ↔ TAXON ──────────────────────────

  // asociar producto a taxon (idempotente)
  async addProductToTaxon(productId: string, taxonId: string, position?: number) {
    const existing = await this.prisma.productsTaxon.findFirst({
      where: { product_id: productId, taxon_id: taxonId },
    });
    if (existing) return existing;

    return this.prisma.productsTaxon.create({
      data: {
        product_id: productId,
        taxon_id: taxonId,
        position: position ?? 0,
      },
    });
  }

  // desasociar producto de taxon
  async removeProductFromTaxon(productId: string, taxonId: string): Promise<boolean> {
    const relation = await this.prisma.productsTaxon.findFirst({
      where: { product_id: productId, taxon_id: taxonId },
    });
    if (!relation) return false;

    await this.prisma.productsTaxon.delete({ where: { id: relation.id } });
    return true;
  }

  // listar productos asociados a un taxon
  async getProductsByTaxon(taxonId: string, skip = 0, take = 20) {
    const relations = await this.prisma.productsTaxon.findMany({
      where: { taxon_id: taxonId },
      include: { product: true },
      orderBy: { position: 'asc' },
      skip,
      take,
    });
    return relations.map((r) => r.product).filter(Boolean);
  }

  // listar taxons de un producto
  async getTaxonsByProduct(productId: string) {
    const relations = await this.prisma.productsTaxon.findMany({
      where: { product_id: productId },
      include: { taxon: true },
      orderBy: { position: 'asc' },
    });
    return relations.map((r) => r.taxon).filter(Boolean);
  }

  // verificar si producto pertenece a taxon
  async isProductInTaxon(productId: string, taxonId: string): Promise<boolean> {
    const relation = await this.prisma.productsTaxon.findFirst({
      where: { product_id: productId, taxon_id: taxonId },
    });
    return !!relation;
  }

  // ─── VALIDACIONES ───────────────────────────────────────

  async validateTaxonExists(id: string): Promise<boolean> {
    const t = await this.prisma.taxon.findUnique({
      where: { id },
      select: { id: true },
    });
    return !!t;
  }
}
