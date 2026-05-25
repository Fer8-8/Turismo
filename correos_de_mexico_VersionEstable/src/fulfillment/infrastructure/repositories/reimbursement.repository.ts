import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { ReimbursementNotFoundException } from '../../domain/exceptions/fulfillment.exceptions';
import {
  CreateReimbursementData,
  REIMBURSEMENT_INCLUDE,
  ReimbursementFilters,
  UpdateReimbursementData,
  generateReimbursementNumber,
} from './reimbursement-repository.types';

@Injectable()
export class ReimbursementRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: CreateReimbursementData) {
    const now = new Date();
    const createData = {
      number: generateReimbursementNumber(),
      order_id: data.order_id ?? null,
      customer_return_id: data.customer_return_id ?? null,
      reimbursement_status: data.reimbursement_status,
      total: data.total ?? null,
      created_at: now,
      updated_at: now,
    };

    return this.prisma.reimbursement.create({
      data: createData,
      include: REIMBURSEMENT_INCLUDE,
    });
  }

  findById(id: string) {
    return this.prisma.reimbursement.findUnique({
      where: { id },
      include: REIMBURSEMENT_INCLUDE,
    });
  }

  async findByIdOrThrow(id: string) {
    const reimbursement = await this.findById(id);
    if (!reimbursement) {
      throw new ReimbursementNotFoundException(id);
    }

    return reimbursement;
  }

  listByFilters(filters: ReimbursementFilters) {
    const { orderId, customerReturnId, status, take = 50, skip = 0 } = filters;
    return this.prisma.reimbursement.findMany({
      where: {
        ...(orderId ? { order_id: orderId } : {}),
        ...(customerReturnId ? { customer_return_id: customerReturnId } : {}),
        ...(status ? { reimbursement_status: status } : {}),
      },
      include: REIMBURSEMENT_INCLUDE,
      orderBy: { created_at: 'desc' },
      take,
      skip,
    });
  }

  async update(id: string, data: UpdateReimbursementData) {
    await this.findByIdOrThrow(id);

    const updateData = {
      ...data,
      updated_at: new Date(),
    };

    return this.prisma.reimbursement.update({
      where: { id },
      data: updateData,
      include: REIMBURSEMENT_INCLUDE,
    });
  }

  associateReturnItems(reimbursementId: string, itemIds: string[]) {
    if (itemIds.length === 0) return Promise.resolve({ count: 0 });

    return this.prisma.returnItem.updateMany({
      where: { id: { in: itemIds } },
      data: { reimbursement_id: reimbursementId, updated_at: new Date() },
    });
  }

  disassociateReturnItem(itemId: string) {
    return this.prisma.returnItem.update({
      where: { id: itemId },
      data: { reimbursement_id: null, updated_at: new Date() },
    });
  }

  findReturnItemsByIds(itemIds: string[]): Promise<
    Array<{
      id: string;
      customer_return_id: string | null;
      acceptance_status: string | null;
      reimbursement_id: string | null;
      return_authorization_id: string | null;
      inventory_unit_id: string | null;
      reception_status: string | null;
      pre_tax_amount: unknown;
      included_tax_total: unknown;
      additional_tax_total: unknown;
      resellable: boolean | null;
      preferred_reimbursement_type_id: string | null;
      override_reimbursement_type_id: string | null;
      created_at: Date;
      updated_at: Date;
      preferredReimbursementType: { id: string; name: string | null; type: string | null } | null;
      overrideReimbursementType: { id: string; name: string | null; type: string | null } | null;
      returnAuthorization: { id: string } | null;
    }>
  > {
    if (itemIds.length === 0) {
      return Promise.resolve([]);
    }

    return this.prisma.returnItem.findMany({
      where: { id: { in: itemIds } },
      include: {
        preferredReimbursementType: {
          select: { id: true, name: true, type: true },
        },
        overrideReimbursementType: {
          select: { id: true, name: true, type: true },
        },
        returnAuthorization: {
          select: { id: true },
        },
      },
      orderBy: { created_at: 'asc' },
    });
  }
}
