import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { ReimbursementTypeKind } from '../../domain/enums/reimbursement-type-kind.enum';
import { ReimbursementTypeNotFoundException } from '../../domain/exceptions/fulfillment.exceptions';
import {
  CreateReimbursementTypeData,
  UpdateReimbursementTypeData,
} from './reimbursement-repository.types';

@Injectable()
export class ReimbursementTypeRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: CreateReimbursementTypeData) {
    return this.prisma.reimbursementType.create({
      data: {
        name: data.name,
        active: data.active ?? true,
        mutable: data.mutable ?? true,
        type: (data.type ?? null) as ReimbursementTypeKind | null,
        created_at: new Date(),
        updated_at: new Date(),
      },
    });
  }

  findById(id: string) {
    return this.prisma.reimbursementType.findUnique({ where: { id } });
  }

  async findByIdOrThrow(id: string) {
    const type = await this.findById(id);
    if (!type) throw new ReimbursementTypeNotFoundException(id);
    return type;
  }

  list(activeOnly = false) {
    return this.prisma.reimbursementType.findMany({
      where: activeOnly ? { active: true } : {},
      orderBy: { name: 'asc' },
    });
  }

  async update(id: string, data: UpdateReimbursementTypeData) {
    await this.findByIdOrThrow(id);
    return this.prisma.reimbursementType.update({
      where: { id },
      data: {
        ...data,
        type: data.type === undefined ? undefined : ((data.type ?? null) as ReimbursementTypeKind | null),
        updated_at: new Date(),
      },
    });
  }

  async activate(id: string) {
    await this.findByIdOrThrow(id);
    return this.prisma.reimbursementType.update({
      where: { id },
      data: { active: true, updated_at: new Date() },
    });
  }

  async deactivate(id: string) {
    await this.findByIdOrThrow(id);
    return this.prisma.reimbursementType.update({
      where: { id },
      data: { active: false, updated_at: new Date() },
    });
  }
}
