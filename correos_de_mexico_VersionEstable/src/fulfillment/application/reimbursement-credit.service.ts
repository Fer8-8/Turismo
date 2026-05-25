import { Injectable } from '@nestjs/common';
import { ReimbursementScopeException } from '../domain/exceptions/fulfillment.exceptions';
import { isReimbursementTerminalStatus } from '../domain/policies/reimbursement-state.policy';
import { ReimbursementCreditRepository } from '../infrastructure/repositories/reimbursement-credit.repository';
import { ReimbursementRepository } from '../infrastructure/repositories/reimbursement.repository';
import { serializeReimbursementCredit } from './fulfillment.mapper';

export interface CreateReimbursementCreditInput {
  reimbursementId: string;
  amount: number;
  creditableId?: string;
  creditableType?: string;
}

@Injectable()
export class ReimbursementCreditService {
  constructor(
    private readonly reimbursementCreditRepository: ReimbursementCreditRepository,
    private readonly reimbursementRepository: ReimbursementRepository,
  ) {}

  async createReimbursementCredit(input: CreateReimbursementCreditInput) {
    if (input.amount <= 0) {
      throw new ReimbursementScopeException('El monto del crédito debe ser mayor a cero');
    }

    const reimbursement = await this.reimbursementRepository.findByIdOrThrow(
      input.reimbursementId,
    );

    if (isReimbursementTerminalStatus(reimbursement.reimbursement_status)) {
      throw new ReimbursementScopeException(
        `El reembolso ${input.reimbursementId} está en estado terminal y no puede recibir nuevos créditos`,
      );
    }

    const credit = await this.reimbursementCreditRepository.create({
      reimbursement_id: input.reimbursementId,
      amount: input.amount,
      creditable_id: input.creditableId ?? null,
      creditable_type: input.creditableType ?? null,
    });

    return serializeReimbursementCredit(credit);
  }

  async listCreditsByReimbursement(reimbursementId: string) {
    await this.reimbursementRepository.findByIdOrThrow(reimbursementId);
    const credits = await this.reimbursementCreditRepository.listByReimbursement(reimbursementId);
    return credits.map(serializeReimbursementCredit);
  }
}
