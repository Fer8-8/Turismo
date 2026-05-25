import { Injectable } from '@nestjs/common';
import { Prisma } from '../../../prisma/client';
import { PrismaService } from '../../../prisma/prisma.service';
import { ReimbursementCreditNotFoundException } from '../../domain/exceptions/fulfillment.exceptions';
import { CreateReimbursementCreditData } from './reimbursement-repository.types';

@Injectable()
export class ReimbursementCreditRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: CreateReimbursementCreditData) {
    const now = new Date();
    const createData = {
      reimbursement_id: data.reimbursement_id,
      amount: data.amount,
      creditable_id: data.creditable_id ?? null,
      creditable_type: data.creditable_type ?? null,
      created_at: now,
      updated_at: now,
    } satisfies Prisma.ReimbursementCreditUncheckedCreateInput;

    return this.prisma.reimbursementCredit.create({ data: createData });
  }

  findById(id: string) {
    return this.prisma.reimbursementCredit.findUnique({ where: { id } });
  }

  async findByIdOrThrow(id: string) {
    const credit = await this.findById(id);
    if (!credit) throw new ReimbursementCreditNotFoundException(id);
    return credit;
  }

  listByReimbursement(reimbursementId: string) {
    return this.prisma.reimbursementCredit.findMany({
      where: { reimbursement_id: reimbursementId },
      orderBy: { created_at: 'asc' },
    });
  }
}
