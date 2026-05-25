import { Inject, Injectable } from '@nestjs/common';
import { PAYMENT_PROCESSOR } from '../domain/contracts';
import type { PaymentProcessor } from '../domain/contracts';
import { RefundState, PaymentState } from '../domain/enums';
import {
  PaymentProcessingException,
  RefundAmountExceededException,
  RefundNotProcessableException,
} from '../domain/exceptions';
import { RefundRepository } from '../infrastructure/repositories/refund.repository';
import { PaymentRepository } from '../infrastructure/repositories/payment.repository';
import { RefundReasonService } from './refund-reason.service';
import { SalesFacade } from '../../../commercial-sales/sales/facades/sales.facade';
import { EventBusService } from '../../../core/shared';
import { RefundProcessedEvent } from '../domain/events/refund-processed.event';

export interface CreateRefundInput {
  paymentId: string;
  amount: number;
  refundReasonId: string;
  reimbursementId?: string;
}

@Injectable()
export class RefundService {
  constructor(
    @Inject(PAYMENT_PROCESSOR)
    private readonly processor: PaymentProcessor,
    private readonly refundRepo: RefundRepository,
    private readonly paymentRepo: PaymentRepository,
    private readonly refundReasonService: RefundReasonService,
    private readonly salesFacade: SalesFacade,
    private readonly eventBus: EventBusService,
  ) {}

  async createRefund(input: CreateRefundInput) {
    const payment = await this.paymentRepo.findByIdOrThrow(input.paymentId);

    if (payment.state !== PaymentState.CAPTURED) {
      throw new RefundNotProcessableException(
        input.paymentId,
        payment.state ?? 'unknown',
      );
    }

    if (!payment.order_id || !payment.payment_intent_id) {
      throw new PaymentProcessingException(
        'Captured payment is missing order or gateway transaction context',
      );
    }

    const refundReason = await this.refundReasonService.validateActiveReason(
      input.refundReasonId,
    );

    const alreadyReserved = await this.refundRepo.sumReservedAmountByPayment(
      payment.id,
    );
    const capturedAmount = Number(payment.captured_amount ?? 0);
    const remainingRefundable = parseFloat(
      (capturedAmount - alreadyReserved).toFixed(2),
    );

    if (input.amount > remainingRefundable) {
      throw new RefundAmountExceededException(
        payment.id,
        remainingRefundable,
        input.amount,
      );
    }

    const orderCtx = await this.salesFacade.getPaymentContext(payment.order_id);
    if (!orderCtx.currency) {
      throw new PaymentProcessingException(
        'Order currency is required to process a refund',
      );
    }

    const refund = await this.refundRepo.create({
      payment_id: payment.id,
      amount: input.amount,
      refund_reason_id: input.refundReasonId,
      state: RefundState.PENDING,
      gateway_code: payment.gateway_code ?? this.processor.gatewayCode,
      reimbursement_id: input.reimbursementId ?? null,
    });

    const result = await this.processor.refundPayment({
      refundId: refund.id,
      paymentId: payment.id,
      gatewayTransactionId: payment.payment_intent_id,
      amount: input.amount,
      currency: orderCtx.currency,
      reason: refundReason.name ?? undefined,
      metadata: {
        refund_id: refund.id,
        payment_id: payment.id,
        order_id: payment.order_id,
      },
    });

    if (!result.success) {
      return this.refundRepo.update(refund.id, {
        state: RefundState.FAILED,
        transaction_id: result.gatewayRefundId,
        response_code: result.responseCode,
        gateway_metadata: result.gatewayMetadata as Record<string, unknown>,
      });
    }

    const updated = await this.refundRepo.update(refund.id, {
      state:
        result.status === 'processed'
          ? RefundState.PROCESSED
          : RefundState.PENDING,
      transaction_id: result.gatewayRefundId,
      response_code: result.responseCode,
      gateway_metadata: result.gatewayMetadata as Record<string, unknown>,
      gateway_code: payment.gateway_code ?? this.processor.gatewayCode,
    });

    if (updated.state === RefundState.PROCESSED) {
      await this.eventBus.emit(
        new RefundProcessedEvent(
          updated.id,
          payment.id,
          payment.order_id,
          Number(updated.amount),
        ),
      );
    }

    return updated;
  }

  getRefund(refundId: string) {
    return this.refundRepo.findByIdOrThrow(refundId);
  }

  getRefundsByPayment(paymentId: string) {
    return this.refundRepo.findByPaymentId(paymentId);
  }

  getRefundsByOrder(orderId: string) {
    return this.refundRepo.findByOrderId(orderId);
  }

  getRefundsByReimbursement(reimbursementId: string) {
    return this.refundRepo.findByReimbursementId(reimbursementId);
  }
}
