import { Test } from '@nestjs/testing';
import { PaymentValidationService } from './payment-validation.service';
import { SalesFacade } from '../../../commercial-sales/sales/facades/sales.facade';
import { PaymentMethodRepository } from '../infrastructure/repositories/payment-method.repository';
import {
  OrderNotPayableException,
  PaymentMethodDisabledException,
  PaymentMethodNotAvailableForStoreException,
  PaymentAmountMismatchException,
} from '../domain/exceptions';

const mockSalesFacade = { getPaymentContext: jest.fn() };
const mockPaymentMethodRepo = {
  findByIdOrThrow: jest.fn(),
  isMethodAvailableForStore: jest.fn(),
};

describe('PaymentValidationService', () => {
  let service: PaymentValidationService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        PaymentValidationService,
        { provide: SalesFacade, useValue: mockSalesFacade },
        { provide: PaymentMethodRepository, useValue: mockPaymentMethodRepo },
      ],
    }).compile();

    service = module.get(PaymentValidationService);
    jest.resetAllMocks();
  });

  describe('validateOrderPayable', () => {
    it('returns context when order is payable', async () => {
      const ctx = { payable: true, total: 500, outstandingBalance: 500, state: 'PENDING', storeId: 's-1', currency: 'MXN' };
      mockSalesFacade.getPaymentContext.mockResolvedValue(ctx);

      const result = await service.validateOrderPayable('ord-1');

      expect(mockSalesFacade.getPaymentContext).toHaveBeenCalledWith('ord-1');
      expect(result).toBe(ctx);
    });

    it('throws OrderNotPayableException when payable is false', async () => {
      mockSalesFacade.getPaymentContext.mockResolvedValue({
        payable: false,
        state: 'CART',
        outstandingBalance: 500,
      });

      await expect(service.validateOrderPayable('ord-1')).rejects.toThrow(OrderNotPayableException);
    });

    it('throws OrderNotPayableException when outstandingBalance is zero', async () => {
      mockSalesFacade.getPaymentContext.mockResolvedValue({
        payable: false,
        state: 'APPROVED',
        outstandingBalance: 0,
      });

      await expect(service.validateOrderPayable('ord-1')).rejects.toThrow(OrderNotPayableException);
    });
  });

  describe('validatePaymentMethod', () => {
    it('returns the method when active and available for the store', async () => {
      const method = { id: 'pm-1', active: true, deleted_at: null };
      mockPaymentMethodRepo.findByIdOrThrow.mockResolvedValue(method);
      mockPaymentMethodRepo.isMethodAvailableForStore.mockResolvedValue(true);

      const result = await service.validatePaymentMethod('pm-1', 's-1');

      expect(mockPaymentMethodRepo.findByIdOrThrow).toHaveBeenCalledWith('pm-1');
      expect(mockPaymentMethodRepo.isMethodAvailableForStore).toHaveBeenCalledWith('pm-1', 's-1');
      expect(result).toBe(method);
    });

    it('throws PaymentMethodDisabledException when method is inactive', async () => {
      mockPaymentMethodRepo.findByIdOrThrow.mockResolvedValue({ id: 'pm-1', active: false, deleted_at: null });

      await expect(service.validatePaymentMethod('pm-1', 's-1')).rejects.toThrow(PaymentMethodDisabledException);
      expect(mockPaymentMethodRepo.isMethodAvailableForStore).not.toHaveBeenCalled();
    });

    it('throws PaymentMethodDisabledException when method is soft-deleted (deleted_at set)', async () => {
      mockPaymentMethodRepo.findByIdOrThrow.mockResolvedValue({ id: 'pm-1', active: true, deleted_at: new Date() });

      await expect(service.validatePaymentMethod('pm-1', 's-1')).rejects.toThrow(PaymentMethodDisabledException);
    });

    it('throws PaymentMethodNotAvailableForStoreException when not linked to the store', async () => {
      mockPaymentMethodRepo.findByIdOrThrow.mockResolvedValue({ id: 'pm-1', active: true, deleted_at: null });
      mockPaymentMethodRepo.isMethodAvailableForStore.mockResolvedValue(false);

      await expect(service.validatePaymentMethod('pm-1', 's-1')).rejects.toThrow(
        PaymentMethodNotAvailableForStoreException,
      );
    });

    it('checks store availability with the correct storeId', async () => {
      mockPaymentMethodRepo.findByIdOrThrow.mockResolvedValue({ id: 'pm-1', active: true, deleted_at: null });
      mockPaymentMethodRepo.isMethodAvailableForStore.mockResolvedValue(true);

      await service.validatePaymentMethod('pm-1', 'store-99');

      expect(mockPaymentMethodRepo.isMethodAvailableForStore).toHaveBeenCalledWith('pm-1', 'store-99');
    });
  });

  describe('validateAmountConsistency', () => {
    it('returns context when requested amount equals outstandingBalance', async () => {
      const ctx = { outstandingBalance: 300, total: 300 };
      mockSalesFacade.getPaymentContext.mockResolvedValue(ctx);

      const result = await service.validateAmountConsistency('ord-1', 300);

      expect(result).toBe(ctx);
    });

    it('returns context when requested amount is less than outstandingBalance (partial payment)', async () => {
      mockSalesFacade.getPaymentContext.mockResolvedValue({ outstandingBalance: 300, total: 300 });

      await expect(service.validateAmountConsistency('ord-1', 150)).resolves.not.toThrow();
    });

    it('throws PaymentAmountMismatchException when amount exceeds outstandingBalance', async () => {
      mockSalesFacade.getPaymentContext.mockResolvedValue({ outstandingBalance: 100, total: 500 });

      await expect(service.validateAmountConsistency('ord-1', 200)).rejects.toThrow(
        PaymentAmountMismatchException,
      );
    });

    it('throws PaymentAmountMismatchException for one cent over balance', async () => {
      mockSalesFacade.getPaymentContext.mockResolvedValue({ outstandingBalance: 100, total: 500 });

      await expect(service.validateAmountConsistency('ord-1', 100.01)).rejects.toThrow(
        PaymentAmountMismatchException,
      );
    });
  });
});
