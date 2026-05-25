import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateProductInput } from './dto/create-product.input';
import { UpdateProductInput } from './dto/update-product.input';
import { FilterProductsInput } from './dto/filter-products.input';
import { AppNotFoundException, AppConflictException } from '../../core/shared';
import { Prisma } from '../../prisma/client';

// includes reutilizables para producto completo
const PRODUCT_FULL_INCLUDE = {
  variants: {
    where: { deleted_at: null },
    include: {
      prices: { where: { deleted_at: null } },
      taxCategory: true,
    },
    orderBy: { position: 'asc' as const },
  },
  taxCategory: true,
  shippingCategory: true,
} as const;

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  // ─── CRUD DE PRODUCTO ────────────────────────────────────

  // crear producto con validación de slug único
  async create(input: CreateProductInput) {
    if (input.slug) {
      const existing = await this.prisma.product.findFirst({
        where: { slug: input.slug, deleted_at: null },
      });
      if (existing) {
        throw new AppConflictException(`slug "${input.slug}" ya está en uso`);
      }
    }

    return this.prisma.product.create({
      data: {
        name: input.name,
        description: input.description,
        slug: input.slug,
        meta_title: input.meta_title,
        meta_description: input.meta_description,
        meta_keywords: input.meta_keywords,
        promotionable: input.promotionable ?? true,
        available_on: input.available_on,
        discontinue_on: input.discontinue_on,
        tax_category_id: input.tax_category_id,
        shipping_category_id: input.shipping_category_id,
      },
      include: PRODUCT_FULL_INCLUDE,
    });
  }

  // listar productos con paginación, búsqueda y filtros
  async findAll(filter: FilterProductsInput) {
    const { page = 1, limit = 10, search, slug, sku, available } = filter;
    const skip = (page - 1) * limit;

    const conditions: Prisma.ProductWhereInput[] = [{ deleted_at: null }];

    if (search) {
      conditions.push({
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
        ],
      });
    }

    if (slug) {
      conditions.push({ slug });
    }

    if (sku) {
      conditions.push({
        variants: {
          some: {
            sku: { contains: sku, mode: 'insensitive' },
            deleted_at: null,
          },
        },
      });
    }

    if (available === true) {
      const now = new Date();
      conditions.push({ available_on: { lte: now } });
      conditions.push({
        OR: [{ discontinue_on: null }, { discontinue_on: { gt: now } }],
      });
    } else if (available === false) {
      const now = new Date();
      conditions.push({
        OR: [
          { available_on: null },
          { available_on: { gt: now } },
          { discontinue_on: { lte: now } },
        ],
      });
    }

    const where: Prisma.ProductWhereInput = { AND: conditions };

    const [data, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        skip,
        take: limit,
        include: PRODUCT_FULL_INCLUDE,
        orderBy: { created_at: 'desc' },
      }),
      this.prisma.product.count({ where }),
    ]);

    return { data, total, page, limit, pages: Math.ceil(total / limit) };
  }

  // obtener producto por id con detalle completo
  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: PRODUCT_FULL_INCLUDE,
    });

    if (!product || product.deleted_at) {
      throw new AppNotFoundException('Product', id);
    }

    return product;
  }

  // obtener producto por slug con detalle completo
  async findBySlug(slug: string) {
    const product = await this.prisma.product.findFirst({
      where: { slug, deleted_at: null },
      include: PRODUCT_FULL_INCLUDE,
    });

    if (!product) {
      throw new AppNotFoundException('Product', `slug:${slug}`);
    }

    return product;
  }

  // actualizar producto con validación de slug único
  async update(id: string, input: UpdateProductInput) {
    await this.findOne(id);

    if (input.slug) {
      const existing = await this.prisma.product.findFirst({
        where: { slug: input.slug, deleted_at: null, id: { not: id } },
      });
      if (existing) {
        throw new AppConflictException(`slug "${input.slug}" ya está en uso`);
      }
    }

    const { id: _, ...data } = input;
    return this.prisma.product.update({
      where: { id },
      data,
      include: PRODUCT_FULL_INCLUDE,
    });
  }

  // baja lógica de producto con soft delete
  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.product.update({
      where: { id },
      data: { deleted_at: new Date() },
    });
    return true;
  }

  // ─── DISPONIBILIDAD COMERCIAL ────────────────────────────

  // verificar si producto está disponible comercialmente
  async isProductAvailable(id: string): Promise<boolean> {
    const product = await this.prisma.product.findUnique({
      where: { id },
      select: { available_on: true, discontinue_on: true, deleted_at: true },
    });

    if (!product || product.deleted_at) return false;

    const now = new Date();
    if (!product.available_on || product.available_on > now) return false;
    if (product.discontinue_on && product.discontinue_on <= now) return false;

    return true;
  }

  // ─── RELACIÓN CON TIENDA ─────────────────────────────────

  // obtener ids de tiendas donde el producto está habilitado
  async getStoresForProduct(productId: string): Promise<string[]> {
    const relations = await this.prisma.productsStore.findMany({
      where: { product_id: productId },
      select: { store_id: true },
    });
    return relations
      .map((r) => r.store_id)
      .filter((id): id is string => !!id);
  }

  // verificar si producto está habilitado en tienda específica
  async isProductInStore(
    productId: string,
    storeId: string,
  ): Promise<boolean> {
    const relation = await this.prisma.productsStore.findFirst({
      where: { product_id: productId, store_id: storeId },
    });
    return !!relation;
  }

  // listar productos habilitados en una tienda
  async getProductsByStore(storeId: string, skip = 0, take = 20) {
    return this.prisma.product.findMany({
      where: {
        deleted_at: null,
        productsStores: { some: { store_id: storeId } },
      },
      skip,
      take,
      include: PRODUCT_FULL_INCLUDE,
      orderBy: { created_at: 'desc' },
    });
  }

  // asociar producto a tienda (idempotente)
  async addProductToStore(productId: string, storeId: string) {
    const existing = await this.prisma.productsStore.findFirst({
      where: { product_id: productId, store_id: storeId },
    });
    if (existing) return existing;

    return this.prisma.productsStore.create({
      data: { product_id: productId, store_id: storeId },
    });
  }

  // desasociar producto de tienda
  async removeProductFromStore(
    productId: string,
    storeId: string,
  ): Promise<boolean> {
    const relation = await this.prisma.productsStore.findFirst({
      where: { product_id: productId, store_id: storeId },
    });
    if (!relation) return false;

    await this.prisma.productsStore.delete({ where: { id: relation.id } });
    return true;
  }

  // ─── VALIDACIONES ────────────────────────────────────────

  // validar que producto existe y no está eliminado
  async validateProductExists(id: string): Promise<boolean> {
    const product = await this.prisma.product.findUnique({
      where: { id },
      select: { id: true, deleted_at: true },
    });
    return !!product && !product.deleted_at;
  }
}
