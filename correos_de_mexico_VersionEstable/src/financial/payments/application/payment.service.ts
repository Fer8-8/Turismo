import { Injectable } from '@nestjs/common';
import { PaymentRepository } from '../infrastructure/repositories/payment.repository';
import { PaymentValidationService } from './payment-validation.service';
import { PaymentProcessingService } from './payment-processing.service';
import { GatewayService } from './gateway.service';
import { PaymentState, GatewayCode } from '../domain/enums';
import { EventBusService } from '../../../core/shared';
import { PaymentCreatedEvent } from '../domain/events';
import { randomUUID } from 'crypto';

export interface CreatePaymentInput {
  orderId: string;
  paymentMethodId: string;
  amount: number;
}

@Injectable()
export class PaymentService {
  constructor(
    private readonly paymentRepo: PaymentRepository,
    private readonly validationService: PaymentValidationService,
    private readonly processingService: PaymentProcessingService,
    private readonly gatewayService: GatewayService,
    private readonly eventBus: EventBusService,
  ) {}

  async createPayment(input: CreatePaymentInput) {
    // 1. validar que la orden es pagable
    const orderCtx = await this.validationService.validateOrderPayable(
      input.orderId,
    );

    // 2. validar consistencia de monto
    await this.validationService.validateAmountConsistency(
      input.orderId,
      input.amount,
    );

    // 3. validar método de pago para la tienda
    const method = await this.validationService.validatePaymentMethod(
      input.paymentMethodId,
      orderCtx.storeId!,
    );

    // 4. resolver gateway
    const gateway = this.gatewayService.getActiveGateway();

    // 5. crear registro de pago
    const payment = await this.paymentRepo.create({
      amount: input.amount,
      order_id: input.orderId,
      payment_method_id: input.paymentMethodId,
      state: PaymentState.CHECKOUT,
      gateway_code: gateway.code,
      number: `PAY-${randomUUID().slice(0, 8).toUpperCase()}`,
    });

    // 6. emitir evento de creación
    await this.eventBus.emit(
      new PaymentCreatedEvent(
        payment.id,
        input.orderId,
        input.amount,
        orderCtx.storeId!,
      ),
    );

    // 7. si auto_capture, procesar inmediatamente
    if (method.auto_capture) {
      return this.processingService.processPayment(
        payment.id,
        input.orderId,
        input.amount,
        orderCtx.currency ?? 'MXN',
        method.type ?? 'card',
      );
    }

    // 8. marcar como pendiente (esperando llamada explícita de proceso)
    return this.paymentRepo.updateState(payment.id, {
      state: PaymentState.PENDING,
    });
  }

  async processPayment(paymentId: string) {
    const payment = await this.paymentRepo.findByIdOrThrow(paymentId);

    if (
      payment.payment_intent_id &&
      [
        PaymentState.PENDING,
        PaymentState.PROCESSING,
        PaymentState.AUTHORIZED,
        PaymentState.CAPTURED,
      ].includes(payment.state as PaymentState)
    ) {
      return payment;
    }

    const orderCtx = await this.validationService.validateOrderPayable(
      payment.order_id!,
    );

    return this.processingService.processPayment(
      paymentId,
      payment.order_id!,
      Number(payment.amount),
      orderCtx.currency ?? 'MXN',
      payment.paymentMethod?.type ?? 'card',
    );
  }

  async capturePayment(paymentId: string) {
    return this.processingService.capturePayment(paymentId);
  }

  async getPayment(paymentId: string) {
    return this.paymentRepo.findByIdOrThrow(paymentId);
  }

  async getPaymentsByOrder(orderId: string) {
    return this.paymentRepo.findByOrderId(orderId);
  }
}
