import { Test, TestingModule } from '@nestjs/testing';
import { EventBusService } from '../../core/shared';
import { PaymentsFacade } from '../../financial/payments/facades/payments.facade';
import { SalesFacade } from '../../commercial-sales/sales/facades/sales.facade';
import { ReimbursementStatus } from '../domain/enums/reimbursement-status.enum';
import { ReturnItemAcceptanceStatus } from '../domain/enums/return-item-acceptance-status.enum';
import { ReimbursementScopeException } from '../domain/exceptions/fulfillment.exceptions';
import { CustomerReturnRepository } from '../infrastructure/repositories/customer-return.repository';
import { ReturnItemRepository } from '../infrastructure/repositories/return-item.repository';
import { ReimbursementRepository } from '../infrastructure/repositories/reimbursement.repository';
import { ReimbursementService } from './reimbursement.service';

describe('ReimbursementService', () => {
  let service: ReimbursementService;
  let reimbursementRepository: Record<string, jest.Mock>;
  let customerReturnRepository: Record<string, jest.Mock>;
  let returnItemRepository: Record<string, jest.Mock>;
  let salesFacade: Record<string, jest.Mock>;
  let paymentsFacade: Record<string, jest.Mock>;
  let eventBus: Record<string, jest.Mock>;

  beforeEach(async () => {
    reimbursementRepository = {
      create: jest.fn(),
      findByIdOrThrow: jest.fn(),
      listByFilters: jest.fn(),
      update: jest.fn(),
      associateReturnItems: jest.fn(),
      findReturnItemsByIds: jest.fn(),
    };
    customerReturnRepository = {
      findCustomerReturnByIdOrThrow: jest.fn(),
    };
    returnItemRepository = {
      listReturnItemsByAuthorization: jest.fn(),
    };
    salesFacade = {
      getOrder: jest.fn(),
    };
    paymentsFacade = {
      getPaymentsByOrder: jest.fn(),
      createRefund: jest.fn(),
    };
    eventBus = {
      emit: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReimbursementService,
        { provide: ReimbursementRepository, useValue: reimbursementRepository },
        { provide: CustomerReturnRepository, useValue: customerReturnRepository },
        { provide: ReturnItemRepository, useValue: returnItemRepository },
        { provide: SalesFacade, useValue: salesFacade },
        { provide: PaymentsFacade, useValue: paymentsFacade },
        { provide: EventBusService, useValue: eventBus },
      ],
    }).compile();

    service = module.get(ReimbursementService);
  });

  it('associates return items only when they belong to the reimbursement customer return', async () => {
    reimbursementRepository.findByIdOrThrow.mockResolvedValue({
      id: 'rb-1',
      customer_return_id: 'cr-1',
      reimbursement_status: ReimbursementStatus.DRAFT,
    });
    reimbursementRepository.findReturnItemsByIds.mockResolvedValue([
      {
        id: 'ri-1',
        customer_return_id: 'cr-1',
        acceptance_status: ReturnItemAcceptanceStatus.ACCEPTED,
      },
    ]);
    reimbursementRepository.associateReturnItems.mockResolvedValue({ count: 1 });
    reimbursementRepository.findByIdOrThrow.mockResolvedValueOnce({
      id: 'rb-1',
      customer_return_id: 'cr-1',
      reimbursement_status: ReimbursementStatus.DRAFT,
    }).mockResolvedValueOnce({
      id: 'rb-1',
      customer_return_id: 'cr-1',
      reimbursement_status: ReimbursementStatus.DRAFT,
      total: 0,
      reimbursementCredits: [],
      returnItems: [],
      refunds: [],
      order: null,
      customerReturn: null,
    });

    await service.associateReturnItems({ reimbursementId: 'rb-1', itemIds: ['ri-1'] });

    expect(reimbursementRepository.findReturnItemsByIds).toHaveBeenCalledWith(['ri-1']);
    expect(reimbursementRepository.associateReturnItems).toHaveBeenCalledWith('rb-1', ['ri-1']);
  });

  it('rejects association when a return item belongs to another customer return', async () => {
    reimbursementRepository.findByIdOrThrow.mockResolvedValue({
      id: 'rb-1',
      customer_return_id: 'cr-1',
      reimbursement_status: ReimbursementStatus.DRAFT,
    });
    reimbursementRepository.findReturnItemsByIds.mockResolvedValue([
      {
        id: 'ri-1',
        customer_return_id: 'cr-2',
        acceptance_status: ReturnItemAcceptanceStatus.ACCEPTED,
      },
    ]);

    await expect(
      service.associateReturnItems({ reimbursementId: 'rb-1', itemIds: ['ri-1'] }),
    ).rejects.toBeInstanceOf(ReimbursementScopeException);
  });

  it('rejects refund creation when more than one captured payment exists', async () => {
    reimbursementRepository.findByIdOrThrow.mockResolvedValue({
      id: 'rb-1',
      order_id: 'ord-1',
      reimbursement_status: ReimbursementStatus.PENDING,
      total: 100,
    });
    paymentsFacade.getPaymentsByOrder.mockResolvedValue([
      { id: 'pay-1', state: 'captured' },
      { id: 'pay-2', state: 'captured' },
    ]);

    await expect(
      service.requestRefundForReimbursement({
        reimbursementId: 'rb-1',
        refundReasonId: 'rr-1',
      }),
    ).rejects.toBeInstanceOf(ReimbursementScopeException);
  });
});