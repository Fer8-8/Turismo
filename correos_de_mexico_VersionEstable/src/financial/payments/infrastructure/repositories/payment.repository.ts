import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import { PaymentState } from '../../domain/enums';
import { PaymentNotFoundException } from '../../domain/exceptions';

export interface CreatePaymentData {
  amount: number;
  order_id: string;
  payment_method_id: string;
  state: string;
  gateway_code?: string;
  number?: string;
}

export interface UpdatePaymentStateData {
  state: string;
  response_code?: string | null;
  payment_intent_id?: string | null;
  gateway_metadata?: Record<string, unknown> | null;
  captured_amount?: number;
}

const PAYMENT_INCLUDE = {
  paymentMethod: true,
  paymentCaptureEvents: { orderBy: { created_at: 'desc' as const } },
  refunds: {
    include: {
      refundReason: true,
    },
    orderBy: { created_at: 'desc' as const },
  },
} as const;

@Injectable()
export class PaymentRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreatePaymentData) {
    return this.prisma.payment.create({
      data: {
        amount: data.amount,
        order_id: data.order_id,
        payment_method_id: data.payment_method_id,
        state: data.state,
        gateway_code: data.gateway_code,
        number: data.number,
      },
      include: PAYMENT_INCLUDE,
    });
  }

  async findById(id: string) {
    return this.prisma.payment.findUnique({
      where: { id },
      include: PAYMENT_INCLUDE,
    });
  }

  async findByIdOrThrow(id: string) {
    const payment = await this.findById(id);
    if (!payment) throw new PaymentNotFoundException(id);
    return payment;
  }

  async findByOrderId(orderId: string) {
    return this.prisma.payment.findMany({
      where: { order_id: orderId },
      include: PAYMENT_INCLUDE,
      orderBy: { created_at: 'desc' },
    });
  }

  async findByPaymentIntentId(paymentIntentId: string) {
    return this.prisma.payment.findFirst({
      where: { payment_intent_id: paymentIntentId },
      include: PAYMENT_INCLUDE,
    });
  }

  async updateState(id: string, data: UpdatePaymentStateData) {
    const updateData: Record<string, unknown> = { state: data.state };
    if (data.response_code !== undefined) updateData.response_code = data.response_code;
    if (data.payment_intent_id !== undefined) updateData.payment_intent_id = data.payment_intent_id;
    if (data.gateway_metadata !== undefined) updateData.gateway_metadata = data.gateway_metadata;
    if (data.captured_amount !== undefined) updateData.captured_amount = data.captured_amount;

    return this.prisma.payment.update({
      where: { id },
      data: updateData,
      include: PAYMENT_INCLUDE,
    });
  }

  async createCaptureEvent(paymentId: string, amount: number) {
    return this.prisma.paymentCaptureEvent.create({
      data: {
        payment_id: paymentId,
        amount,
      },
    });
  }

  async sumCapturedAmount(paymentId: string): Promise<number> {
    const result = await this.prisma.paymentCaptureEvent.aggregate({
      where: { payment_id: paymentId },
      _sum: { amount: true },
    });
    return Number(result._sum.amount ?? 0);
  }

  async sumPaymentsByOrder(orderId: string): Promise<number> {
    const result = await this.prisma.payment.aggregate({
      where: {
        order_id: orderId,
        // dinero liquidado solamente: los fondos autorizados no se cuentan como pagados.
        state: PaymentState.CAPTURED,
      },
      _sum: { amount: true },
    });
    return Number(result._sum.amount ?? 0);
  }
}
