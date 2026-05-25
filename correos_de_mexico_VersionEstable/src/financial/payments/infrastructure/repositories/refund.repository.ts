import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import { RefundNotFoundException } from '../../domain/exceptions';
import { RefundState } from '../../domain/enums';

export interface CreateRefundData {
  payment_id: string;
  amount: number;
  refund_reason_id: string;
  state: string;
  gateway_code?: string;
  reimbursement_id?: string | null;
}

export interface UpdateRefundData {
  state?: string;
  transaction_id?: string | null;
  response_code?: string | null;
  gateway_code?: string | null;
  gateway_metadata?: Record<string, unknown> | null;
}

const REFUND_INCLUDE = {
  refundReason: true,
  payment: {
    select: {
      id: true,
      order_id: true,
      state: true,
      amount: true,
      captured_amount: true,
      payment_intent_id: true,
      gateway_code: true,
    },
  },
} as const;

@Injectable()
export class RefundRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateRefundData) {
    return this.prisma.refund.create({
      data: {
        payment_id: data.payment_id,
        amount: data.amount,
        refund_reason_id: data.refund_reason_id,
        state: data.state,
        gateway_code: data.gateway_code,
        reimbursement_id: data.reimbursement_id ?? null,
      },
      include: REFUND_INCLUDE,
    });
  }

  async findByReimbursementId(reimbursementId: string) {
    return this.prisma.refund.findMany({
      where: { reimbursement_id: reimbursementId },
      include: REFUND_INCLUDE,
      orderBy: { created_at: 'desc' },
    });
  }

  async findById(id: string) {
    return this.prisma.refund.findUnique({
      where: { id },
      include: REFUND_INCLUDE,
    });
  }

  async findByIdOrThrow(id: string) {
    const refund = await this.findById(id);
    if (!refund) throw new RefundNotFoundException(id);
    return refund;
  }

  async findByPaymentId(paymentId: string) {
    return this.prisma.refund.findMany({
      where: { payment_id: paymentId },
      include: REFUND_INCLUDE,
      orderBy: { created_at: 'desc' },
    });
  }

  async findByOrderId(orderId: string) {
    return this.prisma.refund.findMany({
      where: {
        payment: {
          order_id: orderId,
        },
      },
      include: REFUND_INCLUDE,
      orderBy: { created_at: 'desc' },
    });
  }

  async update(id: string, data: UpdateRefundData) {
    const updateData: Record<string, unknown> = {};
    if (data.state !== undefined) updateData.state = data.state;
    if (data.transaction_id !== undefined) updateData.transaction_id = data.transaction_id;
    if (data.response_code !== undefined) updateData.response_code = data.response_code;
    if (data.gateway_code !== undefined) updateData.gateway_code = data.gateway_code;
    if (data.gateway_metadata !== undefined) updateData.gateway_metadata = data.gateway_metadata;

    return this.prisma.refund.update({
      where: { id },
      data: updateData,
      include: REFUND_INCLUDE,
    });
  }

  async sumReservedAmountByPayment(paymentId: string): Promise<number> {
    const result = await this.prisma.refund.aggregate({
      where: {
        payment_id: paymentId,
        state: { in: [RefundState.PENDING, RefundState.PROCESSED] },
      },
      _sum: { amount: true },
    });

    return Number(result._sum?.amount ?? 0);
  }
}
