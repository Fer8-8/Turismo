import { Injectable } from '@nestjs/common';
import { Prisma } from '../../../prisma/client';
import { PrismaService as ApplicationPrismaService } from '../../../prisma/prisma.service';
import { ShippingCategoryNotFoundException } from '../../domain/exceptions/fulfillment.exceptions';

export interface CreateShippingCategoryData {
  name: string;
  code?: string | null;
  is_global?: boolean;
  store_id?: string | null;
}

export interface UpdateShippingCategoryData {
  name?: string;
  code?: string | null;
  is_global?: boolean;
  store_id?: string | null;
}

const SHIPPING_CATEGORY_INCLUDE = {
  shippingMethodCategories: {
    include: {
      shippingMethod: true,
    },
  },
} as const;

@Injectable()
export class ShippingCategoryRepository {
  constructor(private readonly prisma: ApplicationPrismaService) {}

  create(data: CreateShippingCategoryData) {
    const createData: Prisma.ShippingCategoryUncheckedCreateInput = data;

    return this.prisma.shippingCategory.create({
      data: createData,
      include: SHIPPING_CATEGORY_INCLUDE,
    });
  }

  findById(id: string) {
    return this.prisma.shippingCategory.findUnique({
      where: { id },
      include: SHIPPING_CATEGORY_INCLUDE,
    });
  }

  async findByIdOrThrow(id: string) {
    const category = await this.findById(id);
    if (!category) {
      throw new ShippingCategoryNotFoundException(id);
    }

    return category;
  }

  findMany(filters: { storeId?: string }) {
    const { storeId } = filters;
    const where = storeId
      ? ({ OR: [{ is_global: true }, { store_id: storeId }] } satisfies Prisma.ShippingCategoryWhereInput)
      : undefined;

    return this.prisma.shippingCategory.findMany({
      where,
      include: SHIPPING_CATEGORY_INCLUDE,
      orderBy: { name: 'asc' },
    });
  }

  async update(id: string, data: UpdateShippingCategoryData) {
    await this.findByIdOrThrow(id);
    const updateData: Prisma.ShippingCategoryUncheckedUpdateInput = data;

    return this.prisma.shippingCategory.update({
      where: { id },
      data: updateData,
      include: SHIPPING_CATEGORY_INCLUDE,
    });
  }

  async associateMethod(categoryId: string, methodId: string) {
    await this.findByIdOrThrow(categoryId);
    const existing = await this.prisma.shippingMethodCategory.findFirst({
      where: {
        shipping_category_id: categoryId,
        shipping_method_id: methodId,
      },
    });

    if (existing) {
      return existing;
    }

    return this.prisma.shippingMethodCategory.create({
      data: {
        shipping_category_id: categoryId,
        shipping_method_id: methodId,
      },
      include: {
        shippingMethod: true,
        shippingCategory: true,
      },
    });
  }

  async disassociateMethod(categoryId: string, methodId: string) {
    await this.findByIdOrThrow(categoryId);
    const existing = await this.prisma.shippingMethodCategory.findFirst({
      where: {
        shipping_category_id: categoryId,
        shipping_method_id: methodId,
      },
    });

    if (!existing) {
      return false;
    }

    await this.prisma.shippingMethodCategory.delete({
      where: { id: existing.id },
    });

    return true;
  }

  async listCategoriesForMethod(methodId: string) {
    const relations = await this.prisma.shippingMethodCategory.findMany({
      where: { shipping_method_id: methodId },
      include: { shippingCategory: true },
      orderBy: { created_at: 'asc' },
    });

    return relations.map((relation) => relation.shippingCategory);
  }

  async listMethodsForCategory(categoryId: string) {
    const relations = await this.prisma.shippingMethodCategory.findMany({
      where: { shipping_category_id: categoryId },
      include: { shippingMethod: true },
      orderBy: { created_at: 'asc' },
    });

    return relations.map((relation) => relation.shippingMethod);
  }

  async isMethodApplicable(methodId: string, categoryId: string) {
    const relation = await this.prisma.shippingMethodCategory.findFirst({
      where: {
        shipping_method_id: methodId,
        shipping_category_id: categoryId,
      },
    });

    return !!relation;
  }
}