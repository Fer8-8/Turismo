import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePropertyInput } from './dto/create-property.input';
import { UpdatePropertyInput } from './dto/update-property.input';
import { CreateProductPropertyInput } from './dto/create-product-property.input';
import { UpdateProductPropertyInput } from './dto/update-product-property.input';
import { AppNotFoundException, AppConflictException } from '../../core/shared';

@Injectable()
export class PropertyService {
  constructor(private prisma: PrismaService) {}

  // ─── CRUD DE PROPIEDAD ──────────────────────────────────

  async create(input: CreatePropertyInput) {
    return this.prisma.property.create({
      data: {
        name: input.name,
        presentation: input.presentation,
        filterable: input.filterable ?? false,
        filter_param: input.filter_param,
      },
    });
  }

  async findById(id: string) {
    const property = await this.prisma.property.findUnique({
      where: { id },
    });

    if (!property) {
      throw new AppNotFoundException('Property', id);
    }

    return property;
  }

  async findAll() {
    return this.prisma.property.findMany({
      orderBy: { created_at: 'desc' },
    });
  }

  async update(id: string, input: UpdatePropertyInput) {
    await this.findById(id);

    const { id: _, ...data } = input;
    return this.prisma.property.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    await this.findById(id);
    await this.prisma.property.delete({ where: { id } });
    return true;
  }

  // obtener propiedades filtrables
  async getFilterableProperties() {
    return this.prisma.property.findMany({
      where: { filterable: true },
      orderBy: { created_at: 'desc' },
    });
  }

  async validatePropertyExists(id: string): Promise<boolean> {
    const p = await this.prisma.property.findUnique({
      where: { id },
      select: { id: true },
    });
    return !!p;
  }

  // ─── PRODUCTO ↔ PROPIEDAD ──────────────────────────────

  // asociar propiedad a producto con valor
  async createProductProperty(input: CreateProductPropertyInput) {
    // evitar duplicado producto + propiedad
    const existing = await this.prisma.productProperty.findFirst({
      where: {
        product_id: input.product_id,
        property_id: input.property_id,
      },
    });
    if (existing) {
      throw new AppConflictException(
        `propiedad ${input.property_id} ya asociada al producto ${input.product_id}`,
      );
    }

    return this.prisma.productProperty.create({
      data: {
        product_id: input.product_id,
        property_id: input.property_id,
        value: input.value,
        position: input.position ?? 0,
        show_property: input.show_property ?? true,
        filter_param: input.filter_param,
      },
      include: { property: true },
    });
  }

  // obtener producto-propiedad por id
  async findProductPropertyById(id: string) {
    const pp = await this.prisma.productProperty.findUnique({
      where: { id },
      include: { property: true },
    });

    if (!pp) {
      throw new AppNotFoundException('ProductProperty', id);
    }

    return pp;
  }

  // actualizar valor/visibilidad de producto-propiedad
  async updateProductProperty(id: string, input: UpdateProductPropertyInput) {
    await this.findProductPropertyById(id);

    const { id: _, ...data } = input;
    return this.prisma.productProperty.update({
      where: { id },
      data,
      include: { property: true },
    });
  }

  // eliminar asociación producto-propiedad
  async removeProductProperty(id: string) {
    await this.findProductPropertyById(id);
    await this.prisma.productProperty.delete({ where: { id } });
    return true;
  }

  // listar propiedades de un producto con detalle
  async getPropertiesByProduct(productId: string) {
    return this.prisma.productProperty.findMany({
      where: { product_id: productId },
      include: { property: true },
      orderBy: { position: 'asc' },
    });
  }

  // listar propiedades visibles de un producto
  async getVisiblePropertiesByProduct(productId: string) {
    return this.prisma.productProperty.findMany({
      where: { product_id: productId, show_property: true },
      include: { property: true },
      orderBy: { position: 'asc' },
    });
  }
}
