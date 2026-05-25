import { Test, TestingModule } from '@nestjs/testing';
import { ReturnAuthorizationService } from './return-authorization.service';
import { ReturnAuthorizationRepository } from '../infrastructure/repositories/return-authorization.repository';
import { ReturnReasonRepository } from '../infrastructure/repositories/return-reason.repository';
import { SalesFacade } from '../../commercial-sales/sales/facades/sales.facade';
import { StoreFacade } from '../../core/store/facades/store.facade';
import { InventoryFacade } from '../../inventory/inventory.facade';
import { EventBusService } from '../../core/shared';
import { ReturnAuthorizationState } from '../domain/enums/return-authorization-state.enum';
import { ReturnItemAcceptanceStatus } from '../domain/enums/return-item-acceptance-status.enum';

describe('ReturnAuthorizationService', () => {
  let service: ReturnAuthorizationService;
  let returnAuthorizationRepository: Record<string, jest.Mock>;
  let returnReasonRepository: Record<string, jest.Mock>;
  let inventoryFacade: Record<string, jest.Mock>;
  let eventBus: Record<string, jest.Mock>;

  beforeEach(async () => {
    returnAuthorizationRepository = {
      createAuthorization: jest.fn(),
      findAuthorizationByIdOrThrow: jest.fn(),
      updateAuthorization: jest.fn(),
      listAuthorizations: jest.fn(),
    };

    returnReasonRepository = {
      findReasonByIdOrThrow: jest.fn(),
    };

    inventoryFacade = {
      getStockLocation: jest.fn(),
      updateInventoryUnitState: jest.fn(),
    };

    eventBus = {
      emit: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReturnAuthorizationService,
        { provide: ReturnAuthorizationRepository, useValue: returnAuthorizationRepository },
        { provide: ReturnReasonRepository, useValue: returnReasonRepository },
        {
          provide: SalesFacade,
          useValue: { getFulfillmentContext: jest.fn() },
        },
        { provide: StoreFacade, useValue: { validateStoreAccess: jest.fn() } },
        { provide: InventoryFacade, useValue: inventoryFacade },
        { provide: EventBusService, useValue: eventBus },
      ],
    }).compile();

    service = module.get(ReturnAuthorizationService);
  });

  it('creates requested return authorizations after validating reason and stock location', async () => {
    const salesFacade = (service as any).salesFacade as { getFulfillmentContext: jest.Mock };
    const storeFacade = (service as any).storeFacade as { validateStoreAccess: jest.Mock };

    salesFacade.getFulfillmentContext.mockResolvedValue({
      orderId: 'ord-1',
      storeId: 'store-1',
    });
    returnReasonRepository.findReasonByIdOrThrow.mockResolvedValue({ id: 'reason-1', active: true });
    returnAuthorizationRepository.createAuthorization.mockResolvedValue({
      id: 'ra-1',
      state: ReturnAuthorizationState.REQUESTED,
      order_id: 'ord-1',
      returnItems: [],
      returnAuthorizationReason: { id: 'reason-1', name: 'Damaged', active: true, mutable: true },
    });

    const result = await service.createReturnAuthorization({
      orderId: 'ord-1',
      reasonId: 'reason-1',
      stockLocationId: 'loc-1',
    });

    expect(storeFacade.validateStoreAccess).toHaveBeenCalledWith('store-1');
    expect(inventoryFacade.getStockLocation).toHaveBeenCalledWith('loc-1');
    expect(returnAuthorizationRepository.createAuthorization).toHaveBeenCalledWith(
      expect.objectContaining({ state: ReturnAuthorizationState.REQUESTED }),
    );
    expect(result.state).toBe(ReturnAuthorizationState.REQUESTED);
  });

  it('approves authorizations and emits the return approved event', async () => {
    returnAuthorizationRepository.findAuthorizationByIdOrThrow
      .mockResolvedValueOnce({
        id: 'ra-1',
        state: ReturnAuthorizationState.RECEIVED,
        order_id: 'ord-1',
        returnItems: [
          {
            id: 'ri-1',
            inventory_unit_id: 'iu-1',
            acceptance_status: ReturnItemAcceptanceStatus.ACCEPTED,
            resellable: true,
            inventoryUnit: { state: 'returned' },
          },
        ],
      })
      .mockResolvedValueOnce({
        id: 'ra-1',
        state: ReturnAuthorizationState.RECEIVED,
        order_id: 'ord-1',
      })
      .mockResolvedValueOnce({
        id: 'ra-1',
        state: ReturnAuthorizationState.APPROVED,
        order_id: 'ord-1',
        returnItems: [],
        returnAuthorizationReason: null,
      });
    returnAuthorizationRepository.updateAuthorization.mockResolvedValue({
      id: 'ra-1',
      state: ReturnAuthorizationState.APPROVED,
      order_id: 'ord-1',
      returnItems: [],
      returnAuthorizationReason: null,
    });

    const result = await service.approveReturnAuthorization({
      returnAuthorizationId: 'ra-1',
      reintegrateAcceptedItems: true,
      locationId: 'loc-1',
    });

    expect(inventoryFacade.getStockLocation).toHaveBeenCalledWith('loc-1');
    expect(inventoryFacade.updateInventoryUnitState).toHaveBeenCalledWith(
      'iu-1',
      'reintegrated',
      false,
    );
    expect(eventBus.emit).toHaveBeenCalledTimes(1);
    expect(result.state).toBe(ReturnAuthorizationState.APPROVED);
  });
});