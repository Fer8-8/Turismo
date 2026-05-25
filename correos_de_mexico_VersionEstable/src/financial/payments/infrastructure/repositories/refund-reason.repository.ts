import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import { RefundReasonNotFoundException } from '../../domain/exceptions';

export interface CreateRefundReasonData {
  name: string;
  active?: boolean;
  mutable?: boolean;
}

export interface UpdateRefundReasonData {
  name?: string;
  active?: boolean;
  mutable?: boolean;
}

@Injectable()
export class RefundReasonRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateRefundReasonData) {
    return this.prisma.refundReason.create({
      data: {
        name: data.name,
        active: data.active ?? true,
        mutable: data.mutable ?? true,
      },
    });
  }

  async findById(id: string) {
    return this.prisma.refundReason.findUnique({
      where: { id },
    });
  }

  async findByIdOrThrow(id: string) {
    const reason = await this.findById(id);
    if (!reason) throw new RefundReasonNotFoundException(id);
    return reason;
  }

  async findAll(includeInactive = false) {
    return this.prisma.refundReason.findMany({
      where: includeInactive ? {} : { active: true },
      orderBy: { created_at: 'asc' },
    });
  }

  async update(id: string, data: UpdateRefundReasonData) {
    return this.prisma.refundReason.update({
      where: { id },
      data,
    });
  }
}
