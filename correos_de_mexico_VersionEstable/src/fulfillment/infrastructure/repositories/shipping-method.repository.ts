import { Injectable } from '@nestjs/common';
import { Prisma } from '../../../prisma/client';
import { PrismaService as ApplicationPrismaService } from '../../../prisma/prisma.service';
import { ShippingMethodNotFoundException } from '../../domain/exceptions/fulfillment.exceptions';

export interface CreateShippingMethodData {
  name: string;
  code: string;
  display_on?: string | null;
  tracking_url?: string | null;
  admin_name?: string | null;
  tax_category_id?: string | null;
  active?: boolean;
  is_global?: boolean;
  configuration?: Record<string, unknown> | null;
  store_id?: string | null;
}

export interface UpdateShippingMethodData {
  name?: string;
  code?: string;
  display_on?: string | null;
  tracking_url?: string | null;
  admin_name?: string | null;
  tax_category_id?: string | null;
  active?: boolean;
  is_global?: boolean;
  configuration?: Record<string, unknown> | null;
  store_id?: string | null;
}

const SHIPPING_METHOD_INCLUDE = {
  shippingMethodCategories: {
    include: {
      shippingCategory: true,
    },
  },
} as const;

function normalizeConfiguration(
  configuration: Record<string, unknown> | null | undefined,
): Prisma.InputJsonValue | Prisma.NullableJsonNullValueInput | undefined {
  if (configuration === undefined) {
    return undefined;
  }

  if (configuration === null) {
    return Prisma.JsonNull;
  }

  return JSON.parse(JSON.stringify(configuration));
}

@Injectable()
export class ShippingMethodRepository {
  constructor(private readonly prisma: ApplicationPrismaService) {}

  create(data: CreateShippingMethodData) {
    const createData = {
      name: data.name,
      code: data.code,
      display_on: data.display_on,
      tracking_url: data.tracking_url,
      admin_name: data.admin_name,
      tax_category_id: data.tax_category_id,
      active: data.active,
      is_global: data.is_global,
      configuration: normalizeConfiguration(data.configuration),
      store_id: data.store_id,
    } satisfies Prisma.ShippingMethodUncheckedCreateInput;

    return this.prisma.shippingMethod.create({
      data: createData,
      include: SHIPPING_METHOD_INCLUDE,
    });
  }

  findById(id: string) {
    return this.prisma.shippingMethod.findFirst({
      where: { id, deleted_at: null },
      include: SHIPPING_METHOD_INCLUDE,
    });
  }

  async findByIdOrThrow(id: string) {
    const method = await this.findById(id);
    if (!method) {
      throw new ShippingMethodNotFoundException(id);
    }

    return method;
  }

  findMany(filters: {
    includeInactive?: boolean;
    storeId?: string;
    shippingCategoryId?: string;
  }) {
    const { includeInactive = false, storeId, shippingCategoryId } = filters;
    const where = {
      deleted_at: null,
      ...(includeInactive ? {} : { active: true }),
      ...(shippingCategoryId
        ? {
            shippingMethodCategories: {
              some: { shipping_category_id: shippingCategoryId },
            },
          }
        : {}),
      ...(storeId
        ? {
            OR: [{ is_global: true }, { store_id: storeId }],
          }
        : {}),
    } satisfies Prisma.ShippingMethodWhereInput;

    return this.prisma.shippingMethod.findMany({
      where,
      include: SHIPPING_METHOD_INCLUDE,
      orderBy: { name: 'asc' },
    });
  }

  async update(id: string, data: UpdateShippingMethodData) {
    await this.findByIdOrThrow(id);
    const updateData = {
      ...(data.name !== undefined ? { name: data.name } : {}),
      ...(data.code !== undefined ? { code: data.code } : {}),
      ...(data.display_on !== undefined ? { display_on: data.display_on } : {}),
      ...(data.tracking_url !== undefined ? { tracking_url: data.tracking_url } : {}),
      ...(data.admin_name !== undefined ? { admin_name: data.admin_name } : {}),
      ...(data.tax_category_id !== undefined
        ? { tax_category_id: data.tax_category_id }
        : {}),
      ...(data.active !== undefined ? { active: data.active } : {}),
      ...(data.is_global !== undefined ? { is_global: data.is_global } : {}),
      ...(data.configuration !== undefined
        ? { configuration: normalizeConfiguration(data.configuration) }
        : {}),
      ...(data.store_id !== undefined ? { store_id: data.store_id } : {}),
    } satisfies Prisma.ShippingMethodUncheckedUpdateInput;

    return this.prisma.shippingMethod.update({
      where: { id },
      data: updateData,
      include: SHIPPING_METHOD_INCLUDE,
    });
  }

  async setActive(id: string, active: boolean) {
    await this.findByIdOrThrow(id);
    const updateData = { active } satisfies Prisma.ShippingMethodUncheckedUpdateInput;

    return this.prisma.shippingMethod.update({
      where: { id },
      data: updateData,
      include: SHIPPING_METHOD_INCLUDE,
    });
  }
}