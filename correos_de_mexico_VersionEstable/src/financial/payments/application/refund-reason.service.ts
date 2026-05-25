import { Injectable } from '@nestjs/common';
import { RefundReasonRepository } from '../infrastructure/repositories/refund-reason.repository';
import { RefundReasonDisabledException } from '../domain/exceptions';

export interface CreateRefundReasonInput {
  name: string;
  active?: boolean;
  mutable?: boolean;
}

export interface UpdateRefundReasonInput {
  name?: string;
  active?: boolean;
  mutable?: boolean;
}

@Injectable()
export class RefundReasonService {
  constructor(private readonly refundReasonRepo: RefundReasonRepository) {}

  createRefundReason(input: CreateRefundReasonInput) {
    return this.refundReasonRepo.create(input);
  }

  getRefundReason(id: string) {
    return this.refundReasonRepo.findByIdOrThrow(id);
  }

  listRefundReasons(includeInactive = false) {
    return this.refundReasonRepo.findAll(includeInactive);
  }

  updateRefundReason(id: string, input: UpdateRefundReasonInput) {
    return this.refundReasonRepo.update(id, input);
  }

  async activateRefundReason(id: string) {
    await this.refundReasonRepo.findByIdOrThrow(id);
    return this.refundReasonRepo.update(id, { active: true });
  }

  async deactivateRefundReason(id: string) {
    await this.refundReasonRepo.findByIdOrThrow(id);
    return this.refundReasonRepo.update(id, { active: false });
  }

  async validateActiveReason(id: string) {
    const reason = await this.refundReasonRepo.findByIdOrThrow(id);
    if (!reason.active) {
      throw new RefundReasonDisabledException(id);
    }
    return reason;
  }
}
