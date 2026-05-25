import { Injectable } from '@nestjs/common';
import { PaymentService, CreatePaymentInput } from '../application/payment.service';
import {
  PaymentMethodService,
  type CreatePaymentMethodInput,
  type UpdatePaymentMethodInput,
} from '../application/payment-method.service';
import { GatewayService } from '../application/gateway.service';
import { OrderPaymentService } from '../application/order-payment.service';
import {
  RefundService,
  type CreateRefundInput,
} from '../application/refund.service';
import {
  RefundReasonService,
  type CreateRefundReasonInput,
  type UpdateRefundReasonInput,
} from '../application/refund-reason.service';

// paymentsfacade — única interfaz pública del dominio payments.
// otros dominios (sales, fulfillment) deben usar solo esta facade.
// nunca inyectar servicios internos desde fuera del módulo.
@Injectable()
export class PaymentsFacade {
  constructor(
    private readonly paymentService: PaymentService,
    private readonly paymentMethodService: PaymentMethodService,
    private readonly gatewayService: GatewayService,
    private readonly orderPaymentService: OrderPaymentService,
    private readonly refundService: RefundService,
    private readonly refundReasonService: RefundReasonService,
  ) {}

  // ─── pagos ────────────────────────────────────────────────

  createPayment(input: CreatePaymentInput) {
    return this.paymentService.createPayment(input);
  }

  processPayment(paymentId: string) {
    return this.paymentService.processPayment(paymentId);
  }

  capturePayment(paymentId: string) {
    return this.paymentService.capturePayment(paymentId);
  }

  getPayment(paymentId: string) {
    return this.paymentService.getPayment(paymentId);
  }

  getPaymentsByOrder(orderId: string) {
    return this.paymentService.getPaymentsByOrder(orderId);
  }

  // ─── reembolsos ───────────────────────────────────────────

  createRefund(input: CreateRefundInput) {
    return this.refundService.createRefund(input);
  }

  getRefund(refundId: string) {
    return this.refundService.getRefund(refundId);
  }

  getRefundsByPayment(paymentId: string) {
    return this.refundService.getRefundsByPayment(paymentId);
  }

  getRefundsByOrder(orderId: string) {
    return this.refundService.getRefundsByOrder(orderId);
  }

  getRefundsByReimbursement(reimbursementId: string) {
    return this.refundService.getRefundsByReimbursement(reimbursementId);
  }

  // ─── integración de pago de orden ───────────────────────

  getOrderPaymentSummary(orderId: string) {
    return this.orderPaymentService.getOrderPaymentSummary(orderId);
  }

  getTotalPaidForOrder(orderId: string) {
    return this.orderPaymentService.getTotalPaidForOrder(orderId);
  }

  // ─── métodos de pago ────────────────────────────────────

  createPaymentMethod(data: CreatePaymentMethodInput) {
    return this.paymentMethodService.createPaymentMethod(data);
  }

  getPaymentMethod(id: string) {
    return this.paymentMethodService.getPaymentMethod(id);
  }

  listPaymentMethods(includeInactive = false) {
    return this.paymentMethodService.listPaymentMethods(includeInactive);
  }

  updatePaymentMethod(id: string, data: UpdatePaymentMethodInput) {
    return this.paymentMethodService.updatePaymentMethod(id, data);
  }

  activatePaymentMethod(id: string) {
    return this.paymentMethodService.activatePaymentMethod(id);
  }

  deactivatePaymentMethod(id: string) {
    return this.paymentMethodService.deactivatePaymentMethod(id);
  }

  // ─── asociaciones de tienda ──────────────────────────────

  listMethodsForStore(storeId: string) {
    return this.paymentMethodService.listMethodsForStore(storeId);
  }

  associateMethodToStore(methodId: string, storeId: string) {
    return this.paymentMethodService.associateToStore(methodId, storeId);
  }

  disassociateMethodFromStore(methodId: string, storeId: string) {
    return this.paymentMethodService.disassociateFromStore(methodId, storeId);
  }

  isMethodAvailableForStore(methodId: string, storeId: string) {
    return this.paymentMethodService.isMethodAvailableForStore(methodId, storeId);
  }

  // ─── gateway ─────────────────────────────────────────────

  listGateways() {
    return this.gatewayService.listGateways();
  }

  isGatewayActive(code: string) {
    return this.gatewayService.isGatewayActive(code as any);
  }

  // ─── motivos de reembolso ───────────────────────────────

  createRefundReason(input: CreateRefundReasonInput) {
    return this.refundReasonService.createRefundReason(input);
  }

  getRefundReason(id: string) {
    return this.refundReasonService.getRefundReason(id);
  }

  listRefundReasons(includeInactive = false) {
    return this.refundReasonService.listRefundReasons(includeInactive);
  }

  updateRefundReason(id: string, input: UpdateRefundReasonInput) {
    return this.refundReasonService.updateRefundReason(id, input);
  }

  activateRefundReason(id: string) {
    return this.refundReasonService.activateRefundReason(id);
  }

  deactivateRefundReason(id: string) {
    return this.refundReasonService.deactivateRefundReason(id);
  }
}
