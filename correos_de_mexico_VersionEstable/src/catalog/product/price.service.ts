import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePriceInput } from './dto/create-price.input';
import { UpdatePriceInput } from './dto/update-price.input';
import { AppNotFoundException } from '../../core/shared';

@Injectable()
export class PriceService {
  constructor(private prisma: PrismaService) {}

  // ─── CRUD DE PRECIO ──────────────────────────────────────

  // crear precio asociado a variante existente
  async create(input: CreatePriceInput) {
    const variant = await this.prisma.variant.findUnique({
      where: { id: input.variant_id },
      select: { id: true, deleted_at: true },
    });
    if (!variant || variant.deleted_at) {
      throw new AppNotFoundException('Variant', input.variant_id);
    }

    return this.prisma.price.create({
      data: {
        variant_id: input.variant_id,
        amount: input.amount,
        currency: input.currency,
        compare_at_amount: input.compare_at_amount,
      },
    });
  }

  // obtener precio por id excluyendo eliminados
  async findById(id: string) {
    const price = await this.prisma.price.findUnique({
      where: { id },
    });

    if (!price || price.deleted_at) {
      throw new AppNotFoundException('Price', id);
    }

    return price;
  }

  // listar precios activos de una variante
  async findByVariantId(variantId: string) {
    return this.prisma.price.findMany({
      where: { variant_id: variantId, deleted_at: null },
      orderBy: { created_at: 'desc' },
    });
  }

  // obtener precio base (el más antiguo activo) de una variante
  async getBasePrice(variantId: string) {
    return this.prisma.price.findFirst({
      where: { variant_id: variantId, deleted_at: null },
      orderBy: { created_at: 'asc' },
    });
  }

  // actualizar precio existente
  async update(id: string, input: UpdatePriceInput) {
    await this.findById(id);

    const { id: _, ...data } = input;
    return this.prisma.price.update({
      where: { id },
      data,
    });
  }

  // baja lógica de precio con soft delete
  async remove(id: string) {
    await this.findById(id);
    await this.prisma.price.update({
      where: { id },
      data: { deleted_at: new Date() },
    });
    return true;
  }
}
