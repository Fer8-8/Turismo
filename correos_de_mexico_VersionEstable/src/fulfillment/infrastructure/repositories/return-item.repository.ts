import { Injectable } from '@nestjs/common';
import { Prisma } from '../../../prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';
import { ReturnItemNotFoundException } from '../../domain/exceptions/fulfillment.exceptions';
import {
  CreateReturnItemData,
  RETURN_ITEM_INCLUDE,
  UpdateReturnItemData,
} from './return-repository.types';

@Injectable()
export class ReturnItemRepository {
  constructor(private readonly prisma: PrismaService) {}

  createReturnItem(data: CreateReturnItemData) {
    const createData = {
      return_authorization_id: data.return_authorization_id,
      inventory_unit_id: data.inventory_unit_id,
      exchange_variant_id: data.exchange_variant_id ?? null,
      pre_tax_amount: data.pre_tax_amount ?? 0,
      included_tax_total: data.included_tax_total ?? 0,
      additional_tax_total: data.additional_tax_total ?? 0,
      reception_status: data.reception_status ?? 'pending',
      acceptance_status: data.acceptance_status ?? 'pending',
      acceptance_status_errors: data.acceptance_status_errors ?? null,
      resellable: data.resellable ?? true,
    } satisfies Prisma.ReturnItemUncheckedCreateInput;

    return this.prisma.returnItem.create({
      data: createData,
      include: RETURN_ITEM_INCLUDE,
    });
  }

  findReturnItemById(id: string) {
    return this.prisma.returnItem.findUnique({
      where: { id },
      include: {
        ...RETURN_ITEM_INCLUDE,
        returnAuthorization: true,
      },
    });
  }

  async findReturnItemByIdOrThrow(id: string) {
    const item = await this.findReturnItemById(id);
    if (!item) {
      throw new ReturnItemNotFoundException(id);
    }

    return item;
  }

  findReturnItemByInventoryUnit(inventoryUnitId: string) {
    return this.prisma.returnItem.findFirst({
      where: { inventory_unit_id: inventoryUnitId },
      include: {
        ...RETURN_ITEM_INCLUDE,
        returnAuthorization: true,
      },
    });
  }

  listReturnItemsByAuthorization(returnAuthorizationId: string) {
    return this.prisma.returnItem.findMany({
      where: { return_authorization_id: returnAuthorizationId },
      include: {
        ...RETURN_ITEM_INCLUDE,
        returnAuthorization: true,
      },
      orderBy: { created_at: 'asc' },
    });
  }

  async updateReturnItem(id: string, data: UpdateReturnItemData) {
    await this.findReturnItemByIdOrThrow(id);

    const updateData = {
      ...data,
      updated_at: new Date(),
    } satisfies Prisma.ReturnItemUncheckedUpdateInput;

    return this.prisma.returnItem.update({
      where: { id },
      data: updateData,
      include: {
        ...RETURN_ITEM_INCLUDE,
        returnAuthorization: true,
      },
    });
  }
}