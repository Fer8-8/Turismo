import { Injectable } from '@nestjs/common';
import { SalesFacade } from '../../../commercial-sales/sales/facades/sales.facade';
import {
  PaymentMethodDisabledException,
  PaymentMethodNotAvailableForStoreException,
  OrderNotPayableException,
  PaymentAmountMismatchException,
} from '../domain/exceptions';
import { PaymentMethodRepository } from '../infrastructure/repositories/payment-method.repository';

@Injectable()
export class PaymentValidationService {
  constructor(
    private readonly salesFacade: SalesFacade,
    private readonly paymentMethodRepo: PaymentMethodRepository,
  ) {}

  async validateOrderPayable(orderId: string) {
    const ctx = await this.salesFacade.getPaymentContext(orderId);

    if (!ctx.payable) {
      throw new OrderNotPayableException(
        orderId,
        `estado=${ctx.state}, balance=${ctx.outstandingBalance}`,
      );
    }

    return ctx;
  }

  async validatePaymentMethod(methodId: string, storeId: string) {
    const method = await this.paymentMethodRepo.findByIdOrThrow(methodId);

    if (!method.active || method.deleted_at) {
      throw new PaymentMethodDisabledException(methodId);
    }

    const available = await this.paymentMethodRepo.isMethodAvailableForStore(
      methodId,
      storeId,
    );
    if (!available) {
      throw new PaymentMethodNotAvailableForStoreException(methodId, storeId);
    }

    return method;
  }

  async validateAmountConsistency(
    orderId: string,
    requestedAmount: number,
  ) {
    const ctx = await this.salesFacade.getPaymentContext(orderId);

    if (requestedAmount > ctx.outstandingBalance) {
      throw new PaymentAmountMismatchException(
        ctx.outstandingBalance,
        requestedAmount,
      );
    }

    return ctx;
  }
}
