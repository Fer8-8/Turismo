import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateVariantInput } from './dto/create-variant.input';
import { UpdateVariantInput } from './dto/update-variant.input';
import {
  AppNotFoundException,
  AppConflictException,
  BusinessException,
} from '../../core/shared';

// includes estándar para consultas de variante
const VARIANT_INCLUDE = {
  prices: { where: { deleted_at: null } },
  taxCategory: true,
} as const;

@Injectable()
export class VariantService {
  constructor(private prisma: PrismaService) {}

  // ─── CRUD DE VARIANTE ────────────────────────────────────

  // crear variante asociada a producto existente
  async create(input: CreateVariantInput) {
    const product = await this.prisma.product.findUnique({
      where: { id: input.product_id },
      select: { id: true, deleted_at: true },
    });
    if (!product || product.deleted_at) {
      throw new AppNotFoundException('Product', input.product_id);
    }

    if (input.sku) {
      await this.validateSkuUniqueness(input.sku);
    }

    return this.prisma.variant.create({
      data: {
        product_id: input.product_id,
        sku: input.sku ?? '',
        weight: input.weight,
        height: input.height,
        width: input.width,
        depth: input.depth,
        is_master: input.is_master ?? false,
        cost_price: input.cost_price,
        cost_currency: input.cost_currency,
        track_inventory: input.track_inventory ?? true,
        position: input.position,
        tax_category_id: input.tax_category_id,
        discontinue_on: input.discontinue_on,
      },
      include: VARIANT_INCLUDE,
    });
  }

  // obtener variante por id con precios y categoría fiscal
  async findById(id: string) {
    const variant = await this.prisma.variant.findUnique({
      where: { id },
      include: VARIANT_INCLUDE,
    });

    if (!variant || variant.deleted_at) {
      throw new AppNotFoundException('Variant', id);
    }

    return variant;
  }

  // listar variantes activas de un producto ordenadas por posición
  async findByProductId(productId: string) {
    return this.prisma.variant.findMany({
      where: { product_id: productId, deleted_at: null },
      include: VARIANT_INCLUDE,
      orderBy: { position: 'asc' },
    });
  }

  // buscar variante por SKU con producto asociado
  async findBySku(sku: string) {
    const variant = await this.prisma.variant.findFirst({
      where: { sku, deleted_at: null },
      include: { ...VARIANT_INCLUDE, product: true },
    });

    if (!variant) {
      throw new AppNotFoundException('Variant', `sku:${sku}`);
    }

    return variant;
  }

  // actualizar variante con validación de SKU único
  async update(id: string, input: UpdateVariantInput) {
    await this.findById(id);

    if (input.sku) {
      await this.validateSkuUniqueness(input.sku, id);
    }

    const { id: _, ...data } = input;
    return this.prisma.variant.update({
      where: { id },
      data,
      include: VARIANT_INCLUDE,
    });
  }

  // baja lógica de variante con soft delete
  async remove(id: string) {
    await this.findById(id);
    await this.prisma.variant.update({
      where: { id },
      data: { deleted_at: new Date() },
    });
    return true;
  }

  // ─── SKU ─────────────────────────────────────────────────

  // validar que SKU no esté en uso por otra variante activa
  async validateSkuUniqueness(sku: string, excludeId?: string) {
    if (!sku) return;

    const existing = await this.prisma.variant.findFirst({
      where: {
        sku,
        deleted_at: null,
        ...(excludeId && { id: { not: excludeId } }),
      },
    });

    if (existing) {
      throw new AppConflictException(`SKU "${sku}" ya está en uso`);
    }
  }

  // resolver variante a partir de SKU (alias de findBySku)
  async resolveVariantBySku(sku: string) {
    return this.findBySku(sku);
  }

  // ─── DISPONIBILIDAD COMERCIAL ────────────────────────────

  // verificar si variante y su producto están disponibles
  async isVariantAvailable(id: string): Promise<boolean> {
    const variant = await this.prisma.variant.findUnique({
      where: { id },
      select: {
        deleted_at: true,
        discontinue_on: true,
        product: {
          select: {
            available_on: true,
            discontinue_on: true,
            deleted_at: true,
          },
        },
      },
    });

    if (!variant || variant.deleted_at) return false;

    const now = new Date();
    if (variant.discontinue_on && variant.discontinue_on <= now) return false;

    if (!variant.product) return false;
    if (variant.product.deleted_at) return false;
    if (!variant.product.available_on || variant.product.available_on > now) return false;
    if (variant.product.discontinue_on && variant.product.discontinue_on <= now) return false;

    return true;
  }

  // verificar si variante tiene tracking de inventario activo
  async isVariantTrackable(id: string): Promise<boolean> {
    const variant = await this.prisma.variant.findUnique({
      where: { id },
      select: { track_inventory: true, deleted_at: true },
    });
    return !!variant && !variant.deleted_at && variant.track_inventory;
  }

  // ─── CONSULTAS PARA SALES ────────────────────────────────

  // obtener variante con datos mínimos para armar line items
  async getVariantForSales(id: string) {
    const variant = await this.prisma.variant.findUnique({
      where: { id },
      include: {
        prices: { where: { deleted_at: null } },
        product: { select: { id: true, name: true, slug: true } },
      },
    });

    if (!variant || variant.deleted_at) {
      throw new AppNotFoundException('Variant', id);
    }

    return variant;
  }

  // ─── CONSULTAS PARA INVENTORY ────────────────────────────

  // obtener variante con dimensiones físicas para fulfillment
  async getVariantForInventory(id: string) {
    const variant = await this.prisma.variant.findUnique({
      where: { id },
      select: {
        id: true,
        sku: true,
        weight: true,
        height: true,
        width: true,
        depth: true,
        track_inventory: true,
        product_id: true,
        product: { select: { id: true, name: true } },
      },
    });

    if (!variant) {
      throw new AppNotFoundException('Variant', id);
    }

    return variant;
  }

  // resolver product_id a partir de una variante
  async resolveProductForVariant(variantId: string): Promise<string> {
    const variant = await this.prisma.variant.findUnique({
      where: { id: variantId },
      select: { product_id: true },
    });

    if (!variant?.product_id) {
      throw new BusinessException(
        `variante ${variantId} no tiene producto asociado`,
      );
    }

    return variant.product_id;
  }

  // ─── VALIDACIONES ────────────────────────────────────────

  // validar que variante existe y no está eliminada
  async validateVariantExists(id: string): Promise<boolean> {
    const variant = await this.prisma.variant.findUnique({
      where: { id },
      select: { id: true, deleted_at: true },
    });
    return !!variant && !variant.deleted_at;
  }
}
