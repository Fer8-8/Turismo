import { Injectable } from '@nestjs/common';
import { ReimbursementTypeKind } from '../domain/enums/reimbursement-type-kind.enum';
import { ReimbursementTypeImmutableException } from '../domain/exceptions/fulfillment.exceptions';
import { ReimbursementTypeRepository } from '../infrastructure/repositories/reimbursement-type.repository';
import { serializeReimbursementKind } from './fulfillment.mapper';

export interface CreateReimbursementTypeInput {
  name: string;
  active?: boolean;
  mutable?: boolean;
  type?: ReimbursementTypeKind;
}

export interface UpdateReimbursementTypeInput {
  reimbursementTypeId: string;
  name?: string;
  type?: ReimbursementTypeKind;
}

@Injectable()
export class ReimbursementTypeService {
  constructor(
    private readonly reimbursementTypeRepository: ReimbursementTypeRepository,
  ) {}

  async createReimbursementType(input: CreateReimbursementTypeInput) {
    const record = await this.reimbursementTypeRepository.create({
      name: input.name,
      active: input.active ?? true,
      mutable: input.mutable ?? true,
      type: input.type ?? null,
    });

    return serializeReimbursementKind(record);
  }

  async getReimbursementTypeById(typeId: string) {
    const record = await this.reimbursementTypeRepository.findByIdOrThrow(typeId);
    return serializeReimbursementKind(record);
  }

  async listReimbursementTypes(activeOnly = false) {
    const records = await this.reimbursementTypeRepository.list(activeOnly);
    return records.map(serializeReimbursementKind);
  }

  async updateReimbursementType(input: UpdateReimbursementTypeInput) {
    const record = await this.reimbursementTypeRepository.findByIdOrThrow(
      input.reimbursementTypeId,
    );

    if (!record.mutable) {
      throw new ReimbursementTypeImmutableException(input.reimbursementTypeId);
    }

    const updated = await this.reimbursementTypeRepository.update(input.reimbursementTypeId, {
      name: input.name,
      type: input.type,
    });

    return serializeReimbursementKind(updated);
  }

  async activateReimbursementType(typeId: string) {
    const updated = await this.reimbursementTypeRepository.activate(typeId);
    return serializeReimbursementKind(updated);
  }

  async deactivateReimbursementType(typeId: string) {
    const updated = await this.reimbursementTypeRepository.deactivate(typeId);
    return serializeReimbursementKind(updated);
  }
}
