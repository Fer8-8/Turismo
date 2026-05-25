import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { PaymentsFacade } from '../../facades/payments.facade';
import {
  PaymentType,
  PaymentMethodType,
  OrderPaymentSummaryType,
  GatewayConfigType,
  RefundType,
  RefundReasonType,
} from './types';
import {
  CreatePaymentInput,
  ProcessPaymentInput,
  CapturePaymentInput,
  CreatePaymentMethodInput,
  UpdatePaymentMethodInput,
  PaymentMethodStoreInput,
  OrderPaymentsInput,
  PaymentRefundsInput,
  CreateRefundInput,
  CreateRefundReasonInput,
  UpdateRefundReasonInput,
} from './dto';

@Resolver()
export class PaymentsResolver {
  constructor(private readonly paymentsFacade: PaymentsFacade) {}

  // ─── consultas de pago ───────────────────────────────────

  @Query(() => PaymentType, { name: 'payment' })
  getPayment(@Args('id', { type: () => ID }) id: string) {
    return this.paymentsFacade.getPayment(id);
  }

  @Query(() => [PaymentType], { name: 'orderPayments' })
  getOrderPayments(@Args('input') input: OrderPaymentsInput) {
    return this.paymentsFacade.getPaymentsByOrder(input.orderId);
  }

  @Query(() => OrderPaymentSummaryType, { name: 'orderPaymentSummary' })
  getOrderPaymentSummary(@Args('input') input: OrderPaymentsInput) {
    return this.paymentsFacade.getOrderPaymentSummary(input.orderId);
  }

  @Query(() => [RefundType], { name: 'paymentRefunds' })
  getPaymentRefunds(@Args('input') input: PaymentRefundsInput) {
    return this.paymentsFacade.getRefundsByPayment(input.paymentId);
  }

  @Query(() => [RefundType], { name: 'orderRefunds' })
  getOrderRefunds(@Args('input') input: OrderPaymentsInput) {
    return this.paymentsFacade.getRefundsByOrder(input.orderId);
  }

  @Query(() => RefundType, { name: 'refund' })
  getRefund(@Args('id', { type: () => ID }) id: string) {
    return this.paymentsFacade.getRefund(id);
  }

  // ─── consultas de método de pago ─────────────────────────

  @Query(() => PaymentMethodType, { name: 'paymentMethod' })
  getPaymentMethod(@Args('id', { type: () => ID }) id: string) {
    return this.paymentsFacade.getPaymentMethod(id);
  }

  @Query(() => [PaymentMethodType], { name: 'paymentMethods' })
  listPaymentMethods(
    @Args('includeInactive', { type: () => Boolean, nullable: true, defaultValue: false })
    includeInactive: boolean,
  ) {
    return this.paymentsFacade.listPaymentMethods(includeInactive);
  }

  @Query(() => [PaymentMethodType], { name: 'paymentMethodsForStore' })
  listPaymentMethodsForStore(
    @Args('storeId', { type: () => ID }) storeId: string,
  ) {
    return this.paymentsFacade.listMethodsForStore(storeId);
  }

  // ─── consultas de gateway ────────────────────────────────

  @Query(() => [GatewayConfigType], { name: 'gateways' })
  listGateways() {
    return this.paymentsFacade.listGateways();
  }

  @Query(() => [RefundReasonType], { name: 'refundReasons' })
  listRefundReasons(
    @Args('includeInactive', { type: () => Boolean, nullable: true, defaultValue: false })
    includeInactive: boolean,
  ) {
    return this.paymentsFacade.listRefundReasons(includeInactive);
  }

  @Query(() => RefundReasonType, { name: 'refundReason' })
  getRefundReason(@Args('id', { type: () => ID }) id: string) {
    return this.paymentsFacade.getRefundReason(id);
  }

  // ─── mutaciones de pago ─────────────────────────────────

  @Mutation(() => PaymentType, { name: 'createPayment' })
  createPayment(@Args('input') input: CreatePaymentInput) {
    return this.paymentsFacade.createPayment({
      orderId: input.orderId,
      paymentMethodId: input.paymentMethodId,
      amount: input.amount,
    });
  }

  @Mutation(() => PaymentType, { name: 'processPayment' })
  processPayment(@Args('input') input: ProcessPaymentInput) {
    return this.paymentsFacade.processPayment(input.paymentId);
  }

  @Mutation(() => PaymentType, { name: 'capturePayment' })
  capturePayment(@Args('input') input: CapturePaymentInput) {
    return this.paymentsFacade.capturePayment(input.paymentId);
  }

  @Mutation(() => RefundType, { name: 'createRefund' })
  createRefund(@Args('input') input: CreateRefundInput) {
    return this.paymentsFacade.createRefund(input);
  }

  // ─── mutaciones de método de pago ───────────────────────

  @Mutation(() => PaymentMethodType, { name: 'createPaymentMethod' })
  createPaymentMethod(@Args('input') input: CreatePaymentMethodInput) {
    return this.paymentsFacade.createPaymentMethod(input);
  }

  @Mutation(() => PaymentMethodType, { name: 'updatePaymentMethod' })
  updatePaymentMethod(@Args('input') input: UpdatePaymentMethodInput) {
    const { id, ...data } = input;
    return this.paymentsFacade.updatePaymentMethod(id, data);
  }

  @Mutation(() => PaymentMethodType, { name: 'activatePaymentMethod' })
  activatePaymentMethod(@Args('id', { type: () => ID }) id: string) {
    return this.paymentsFacade.activatePaymentMethod(id);
  }

  @Mutation(() => PaymentMethodType, { name: 'deactivatePaymentMethod' })
  deactivatePaymentMethod(@Args('id', { type: () => ID }) id: string) {
    return this.paymentsFacade.deactivatePaymentMethod(id);
  }

  // ─── mutaciones de motivos de reembolso ─────────────────

  @Mutation(() => RefundReasonType, { name: 'createRefundReason' })
  createRefundReason(@Args('input') input: CreateRefundReasonInput) {
    return this.paymentsFacade.createRefundReason(input);
  }

  @Mutation(() => RefundReasonType, { name: 'updateRefundReason' })
  updateRefundReason(@Args('input') input: UpdateRefundReasonInput) {
    const { id, ...data } = input;
    return this.paymentsFacade.updateRefundReason(id, data);
  }

  @Mutation(() => RefundReasonType, { name: 'activateRefundReason' })
  activateRefundReason(@Args('id', { type: () => ID }) id: string) {
    return this.paymentsFacade.activateRefundReason(id);
  }

  @Mutation(() => RefundReasonType, { name: 'deactivateRefundReason' })
  deactivateRefundReason(@Args('id', { type: () => ID }) id: string) {
    return this.paymentsFacade.deactivateRefundReason(id);
  }

  // ─── mutaciones de asociación de tienda ─────────────────

  @Mutation(() => Boolean, { name: 'associatePaymentMethodToStore' })
  async associatePaymentMethodToStore(
    @Args('input') input: PaymentMethodStoreInput,
  ) {
    await this.paymentsFacade.associateMethodToStore(
      input.paymentMethodId,
      input.storeId,
    );
    return true;
  }

  @Mutation(() => Boolean, { name: 'disassociatePaymentMethodFromStore' })
  async disassociatePaymentMethodFromStore(
    @Args('input') input: PaymentMethodStoreInput,
  ) {
    await this.paymentsFacade.disassociateMethodFromStore(
      input.paymentMethodId,
      input.storeId,
    );
    return true;
  }
}
