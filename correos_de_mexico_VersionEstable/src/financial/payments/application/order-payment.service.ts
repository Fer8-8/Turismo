import { Injectable } from '@nestjs/common';
import { SalesFacade } from '../../../commercial-sales/sales/facades/sales.facade';
import { PaymentRepository } from '../infrastructure/repositories/payment.repository';

export interface OrderPaymentSummary {
  orderId: string;
  totalPaid: number;
  outstandingBalance: number;
  payments: Array<{
    id: string;
    amount: number;
    state: string | null;
    createdAt: Date;
  }>;
}

@Injectable()
export class OrderPaymentService {
  constructor(
    private readonly salesFacade: SalesFacade,
    private readonly paymentRepo: PaymentRepository,
  ) {}

  async getOrderPayments(orderId: string) {
    return this.paymentRepo.findByOrderId(orderId);
  }

  async getOrderPaymentSummary(orderId: string): Promise<OrderPaymentSummary> {
    const ctx = await this.salesFacade.getPaymentContext(orderId);
    const payments = await this.paymentRepo.findByOrderId(orderId);
    const totalPaid = await this.paymentRepo.sumPaymentsByOrder(orderId);

    return {
      orderId,
      totalPaid,
      outstandingBalance: Math.max(
        0,
        parseFloat((ctx.total - totalPaid).toFixed(2)),
      ),
      payments: payments.map((p) => ({
        id: p.id,
        amount: Number(p.amount),
        state: p.state,
        createdAt: p.created_at,
      })),
    };
  }

  async getTotalPaidForOrder(orderId: string): Promise<number> {
    return this.paymentRepo.sumPaymentsByOrder(orderId);
  }
}
