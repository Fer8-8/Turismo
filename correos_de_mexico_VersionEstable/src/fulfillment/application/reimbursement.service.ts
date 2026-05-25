import { Injectable } from '@nestjs/common';
import { EventBusService } from '../../core/shared';
import { PaymentsFacade } from '../../financial/payments/facades/payments.facade';
import { SalesFacade } from '../../commercial-sales/sales/facades/sales.facade';
import { ReimbursementStatus } from '../domain/enums/reimbursement-status.enum';
import { ReimbursementRecordedEvent } from '../domain/events/reimbursement-recorded.event';
import { ReimbursementRefundRequestedEvent } from '../domain/events/reimbursement-refund-requested.event';
import { ReimbursementStatusUpdatedEvent } from '../domain/events/reimbursement-status-updated.event';
import {
  ReimbursementScopeException,
  ReimbursementStateTransitionException,
} from '../domain/exceptions/fulfillment.exceptions';
import {
  canTransitionReimbursementStatus,
  isReimbursementTerminalStatus,
} from '../domain/policies/reimbursement-state.policy';
import { CustomerReturnRepository } from '../infrastructure/repositories/customer-return.repository';
import { ReturnItemRepository } from '../infrastructure/repositories/return-item.repository';
import { ReimbursementRepository } from '../infrastructure/repositories/reimbursement.repository';
import { ReimbursementFilters } from '../infrastructure/repositories/reimbursement-repository.types';
import { ReturnItemAcceptanceStatus } from '../domain/enums/return-item-acceptance-status.enum';
import {
  serializeReimbursement,
} from './fulfillment.mapper';

export interface CreateReimbursementInput {
  orderId: string;
  customerReturnId?: string;
  total?: number;
}

export interface UpdateReimbursementStatusInput {
  reimbursementId: string;
  status: ReimbursementStatus;
}

export interface AssociateReturnItemsInput {
  reimbursementId: string;
  itemIds: string[];
}

export interface RequestRefundInput {
  reimbursementId: string;
  refundReasonId: string;
  amount?: number;
}

@Injectable()
export class ReimbursementService {
  constructor(
    private readonly reimbursementRepository: ReimbursementRepository,
    private readonly customerReturnRepository: CustomerReturnRepository,
    private readonly returnItemRepository: ReturnItemRepository,
    private readonly salesFacade: SalesFacade,
    private readonly paymentsFacade: PaymentsFacade,
    private readonly eventBus: EventBusService,
  ) {}

  async createReimbursement(input: CreateReimbursementInput) {
    await this.salesFacade.getOrder(input.orderId);

    if (input.customerReturnId) {
      await this.customerReturnRepository.findCustomerReturnByIdOrThrow(input.customerReturnId);
    }

    const reimbursement = await this.reimbursementRepository.create({
      order_id: input.orderId,
      customer_return_id: input.customerReturnId ?? null,
      reimbursement_status: ReimbursementStatus.DRAFT,
      total: input.total ?? null,
    });

    await this.eventBus.emit(
      new ReimbursementRecordedEvent(reimbursement.id, reimbursement.order_id, reimbursement.customer_return_id),
    );

    return serializeReimbursement(reimbursement);
  }

  async getReimbursementById(reimbursementId: string) {
    const reimbursement = await this.reimbursementRepository.findByIdOrThrow(reimbursementId);
    return serializeReimbursement(reimbursement);
  }

  async listReimbursementsByOrder(orderId: string) {
    const results = await this.reimbursementRepository.listByFilters({ orderId });
    return results.map(serializeReimbursement);
  }

  async listReimbursementsByCustomerReturn(customerReturnId: string) {
    const results = await this.reimbursementRepository.listByFilters({ customerReturnId });
    return results.map(serializeReimbursement);
  }

  async listReimbursements(filters: ReimbursementFilters) {
    const results = await this.reimbursementRepository.listByFilters(filters);
    return results.map(serializeReimbursement);
  }

  async updateReimbursementStatus(input: UpdateReimbursementStatusInput) {
    const reimbursement = await this.reimbursementRepository.findByIdOrThrow(input.reimbursementId);

    if (
      !canTransitionReimbursementStatus(reimbursement.reimbursement_status, input.status)
    ) {
      throw new ReimbursementStateTransitionException(
        reimbursement.reimbursement_status,
        input.status,
      );
    }

    const previousStatus = reimbursement.reimbursement_status ?? ReimbursementStatus.DRAFT;
    const updated = await this.reimbursementRepository.update(input.reimbursementId, {
      reimbursement_status: input.status,
    });

    await this.eventBus.emit(
      new ReimbursementStatusUpdatedEvent(updated.id, previousStatus, input.status),
    );

    return serializeReimbursement(updated);
  }

  async associateReturnItems(input: AssociateReturnItemsInput) {
    if (input.itemIds.length === 0) {
      throw new ReimbursementScopeException('itemIds no puede estar vacío');
    }

    const unique = new Set(input.itemIds);
    if (unique.size !== input.itemIds.length) {
      throw new ReimbursementScopeException('itemIds contiene entradas duplicadas');
    }

    const reimbursement = await this.reimbursementRepository.findByIdOrThrow(input.reimbursementId);

    if (isReimbursementTerminalStatus(reimbursement.reimbursement_status)) {
      throw new ReimbursementScopeException(
        `El reembolso ${input.reimbursementId} está en estado terminal y no puede modificarse`,
      );
    }

    if (!reimbursement.customer_return_id) {
      throw new ReimbursementScopeException(
        'El reembolso debe estar asociado a una devolución de cliente antes de adjuntar artículos',
      );
    }

    const scopedItems = await this.reimbursementRepository.findReturnItemsByIds(input.itemIds);

    if (scopedItems.length !== input.itemIds.length) {
      throw new ReimbursementScopeException(
        'Uno o más artículos de devolución no existen en el contexto del reembolso',
      );
    }

    const belongsToSameCustomerReturn = scopedItems.every(
      (item) => item.customer_return_id === reimbursement.customer_return_id,
    );

    if (!belongsToSameCustomerReturn) {
      throw new ReimbursementScopeException(
        'Uno o más artículos de devolución no pertenecen a la devolución de cliente del reembolso',
      );
    }

    const nonAccepted = scopedItems
      .filter((item) => item.acceptance_status !== ReturnItemAcceptanceStatus.ACCEPTED)
      .map((item) => item.id);

    if (nonAccepted.length > 0) {
      throw new ReimbursementScopeException(
        `Los artículos de devolución ${nonAccepted.join(', ')} no están en estado aceptado`,
      );
    }

    await this.reimbursementRepository.associateReturnItems(input.reimbursementId, input.itemIds);

    const updated = await this.reimbursementRepository.findByIdOrThrow(input.reimbursementId);
    return serializeReimbursement(updated);
  }

  async requestRefundForReimbursement(input: RequestRefundInput) {
    const reimbursement = await this.reimbursementRepository.findByIdOrThrow(input.reimbursementId);

    if (!reimbursement.order_id) {
      throw new ReimbursementScopeException(
        'El reembolso debe estar asociado a una orden para solicitar un refund',
      );
    }

    if (
      !canTransitionReimbursementStatus(
        reimbursement.reimbursement_status,
        ReimbursementStatus.PROCESSING,
      )
    ) {
      throw new ReimbursementStateTransitionException(
        reimbursement.reimbursement_status,
        ReimbursementStatus.PROCESSING,
      );
    }

    const amount = input.amount ?? Number(reimbursement.total ?? 0);

    if (amount <= 0) {
      throw new ReimbursementScopeException('El monto del reembolso debe ser mayor a cero');
    }

    const payments = await this.paymentsFacade.getPaymentsByOrder(reimbursement.order_id);
    const capturedPayments = (payments as Array<{ id: string; state: string }>).filter(
      (payment) => payment.state === 'captured',
    );

    if (capturedPayments.length > 1) {
      throw new ReimbursementScopeException(
        `Contexto de pago capturado ambiguo para la orden ${reimbursement.order_id}`,
      );
    }

    const [capturedPayment] = capturedPayments;

    if (!capturedPayment) {
      throw new ReimbursementScopeException(
        `No se encontró pago capturado para la orden ${reimbursement.order_id}`,
      );
    }

    await this.paymentsFacade.createRefund({
      paymentId: capturedPayment.id,
      amount,
      refundReasonId: input.refundReasonId,
      reimbursementId: reimbursement.id,
    });

    const previousStatus = reimbursement.reimbursement_status ?? ReimbursementStatus.PENDING;
    const updated = await this.reimbursementRepository.update(input.reimbursementId, {
      reimbursement_status: ReimbursementStatus.PROCESSING,
    });

    await this.eventBus.emit(
      new ReimbursementRefundRequestedEvent(reimbursement.id, reimbursement.order_id, amount),
    );

    await this.eventBus.emit(
      new ReimbursementStatusUpdatedEvent(updated.id, previousStatus, ReimbursementStatus.PROCESSING),
    );

    return serializeReimbursement(updated);
  }

  resolveEffectiveReimbursementType(returnItem: {
    preferred_reimbursement_type_id?: string | null;
    override_reimbursement_type_id?: string | null;
  }): string | null {
    return returnItem.override_reimbursement_type_id ?? returnItem.preferred_reimbursement_type_id ?? null;
  }
}
