import { Injectable } from '@nestjs/common';
import { Prisma } from '../../../prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';
import { ReturnAuthorizationReasonNotFoundException } from '../../domain/exceptions/fulfillment.exceptions';
import {
  CreateReturnReasonData,
  UpdateReturnReasonData,
} from './return-repository.types';

@Injectable()
export class ReturnReasonRepository {
  constructor(private readonly prisma: PrismaService) {}

  createReason(data: CreateReturnReasonData) {
    const createData = {
      name: data.name,
      active: data.active ?? true,
      mutable: data.mutable ?? true,
    } satisfies Prisma.ReturnAuthorizationReasonUncheckedCreateInput;

    return this.prisma.returnAuthorizationReason.create({ data: createData });
  }

  findReasonById(id: string) {
    return this.prisma.returnAuthorizationReason.findUnique({ where: { id } });
  }

  async findReasonByIdOrThrow(id: string) {
    const reason = await this.findReasonById(id);
    if (!reason) {
      throw new ReturnAuthorizationReasonNotFoundException(id);
    }

    return reason;
  }

  listReasons(activeOnly = true) {
    return this.prisma.returnAuthorizationReason.findMany({
      where: activeOnly ? { active: true } : undefined,
      orderBy: [{ active: 'desc' }, { name: 'asc' }],
    });
  }

  async updateReason(id: string, data: UpdateReturnReasonData) {
    await this.findReasonByIdOrThrow(id);

    const updateData = {
      ...data,
      updated_at: new Date(),
    } satisfies Prisma.ReturnAuthorizationReasonUncheckedUpdateInput;

    return this.prisma.returnAuthorizationReason.update({
      where: { id },
      data: updateData,
    });
  }
}