import { Injectable } from '@nestjs/common';
import { ReturnReasonRepository } from '../infrastructure/repositories/return-reason.repository';
import { ReturnReasonImmutableException } from '../domain/exceptions/fulfillment.exceptions';
import { serializeReturnAuthorizationReason } from './fulfillment.mapper';

export interface CreateReturnAuthorizationReasonInput {
  name: string;
  active?: boolean;
  mutable?: boolean;
}

export interface UpdateReturnAuthorizationReasonInput {
  reasonId: string;
  name?: string;
  active?: boolean;
  mutable?: boolean;
}

@Injectable()
export class ReturnReasonService {
  constructor(private readonly returnReasonRepository: ReturnReasonRepository) {}

  async createReason(input: CreateReturnAuthorizationReasonInput) {
    const reason = await this.returnReasonRepository.createReason(input);
    return serializeReturnAuthorizationReason(reason);
  }

  async listReasons(activeOnly = true) {
    const reasons = await this.returnReasonRepository.listReasons(activeOnly);
    return reasons.map((reason) => serializeReturnAuthorizationReason(reason));
  }

  async updateReason(input: UpdateReturnAuthorizationReasonInput) {
    const reason = await this.returnReasonRepository.findReasonByIdOrThrow(input.reasonId);
    if (!reason.mutable) {
      throw new ReturnReasonImmutableException(input.reasonId);
    }

    const updated = await this.returnReasonRepository.updateReason(input.reasonId, {
      ...(input.name !== undefined ? { name: input.name } : {}),
      ...(input.active !== undefined ? { active: input.active } : {}),
      ...(input.mutable !== undefined ? { mutable: input.mutable } : {}),
    });

    return serializeReturnAuthorizationReason(updated);
  }
}