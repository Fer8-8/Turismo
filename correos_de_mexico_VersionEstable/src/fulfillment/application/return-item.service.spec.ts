import { Test, TestingModule } from '@nestjs/testing';
import { InventoryFacade } from '../../inventory/inventory.facade';
import { ReturnAuthorizationState } from '../domain/enums/return-authorization-state.enum';
import { ReturnItemAcceptanceStatus } from '../domain/enums/return-item-acceptance-status.enum';
import { ReturnItemReceptionStatus } from '../domain/enums/return-item-reception-status.enum';
import { ReturnAuthorizationContextException } from '../domain/exceptions/fulfillment.exceptions';
import { ReturnAuthorizationRepository } from '../infrastructure/repositories/return-authorization.repository';
import { ReturnItemRepository } from '../infrastructure/repositories/return-item.repository';
import { ReturnItemService } from './return-item.service';

describe('ReturnItemService', () => {
  let service: ReturnItemService;
  let returnAuthorizationRepository: Record<string, jest.Mock>;
  let returnItemRepository: Record<string, jest.Mock>;
  let inventoryFacade: Record<string, jest.Mock>;

  beforeEach(async () => {
    returnAuthorizationRepository = {
      findAuthorizationByIdOrThrow: jest.fn(),
      updateAuthorization: jest.fn(),
    };

    returnItemRepository = {
      findReturnItemByInventoryUnit: jest.fn(),
      createReturnItem: jest.fn(),
      findReturnItemByIdOrThrow: jest.fn(),
      updateReturnItem: jest.fn(),
      listReturnItemsByAuthorization: jest.fn(),
    };

    inventoryFacade = {
      getInventoryUnit: jest.fn(),
      getStockLocation: jest.fn(),
      updateInventoryUnitState: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReturnItemService,
        { provide: ReturnAuthorizationRepository, useValue: returnAuthorizationRepository },
        { provide: ReturnItemRepository, useValue: returnItemRepository },
        { provide: InventoryFacade, useValue: inventoryFacade },
      ],
    }).compile();

    service = module.get(ReturnItemService);
  });

  it('adds a return item only when the inventory unit belongs to the same order', async () => {
    returnAuthorizationRepository.findAuthorizationByIdOrThrow.mockResolvedValue({
      id: 'ra-1',
      order_id: 'ord-1',
      state: ReturnAuthorizationState.REQUESTED,
    });
    returnItemRepository.findReturnItemByInventoryUnit.mockResolvedValue(null);
    inventoryFacade.getInventoryUnit.mockResolvedValue({
      id: 'iu-1',
      order_id: 'ord-1',
      quantity: 1,
      lineItem: {
        quantity: 1,
        pre_tax_amount: 12,
        included_tax_total: 0,
        additional_tax_total: 2,
      },
    });
    returnItemRepository.createReturnItem.mockResolvedValue({
      id: 'ri-1',
      return_authorization_id: 'ra-1',
      inventory_unit_id: 'iu-1',
      pre_tax_amount: 12,
      included_tax_total: 0,
      additional_tax_total: 2,
      resellable: true,
      customerReturn: null,
      returnAuthorization: null,
    });

    const result = await service.addReturnItem({
      returnAuthorizationId: 'ra-1',
      inventoryUnitId: 'iu-1',
    });

    expect(returnItemRepository.createReturnItem).toHaveBeenCalledWith(
      expect.objectContaining({
        inventory_unit_id: 'iu-1',
        pre_tax_amount: 12,
        additional_tax_total: 2,
      }),
    );
    expect(result.inventory_unit_id).toBe('iu-1');
  });

  it('rejects receiving items while the authorization is still requested', async () => {
    returnItemRepository.findReturnItemByIdOrThrow.mockResolvedValue({
      id: 'ri-1',
      return_authorization_id: 'ra-1',
    });
    returnAuthorizationRepository.findAuthorizationByIdOrThrow.mockResolvedValue({
      id: 'ra-1',
      state: ReturnAuthorizationState.REQUESTED,
    });

    await expect(
      service.evaluateReturnItem({
        returnItemId: 'ri-1',
        receptionStatus: ReturnItemReceptionStatus.RECEIVED,
      }),
    ).rejects.toBeInstanceOf(ReturnAuthorizationContextException);
  });

  it('moves authorized returns to received and can auto-reintegrate accepted items', async () => {
    returnItemRepository.findReturnItemByIdOrThrow
      .mockResolvedValueOnce({
        id: 'ri-1',
        return_authorization_id: 'ra-1',
      })
      .mockResolvedValueOnce({
        id: 'ri-1',
        return_authorization_id: 'ra-1',
        inventory_unit_id: 'iu-1',
        resellable: true,
        inventoryUnit: { state: 'returned' },
        returnAuthorization: { id: 'ra-1', state: ReturnAuthorizationState.RECEIVED },
      });
    returnAuthorizationRepository.findAuthorizationByIdOrThrow.mockResolvedValue({
      id: 'ra-1',
      state: ReturnAuthorizationState.AUTHORIZED,
    });
    returnItemRepository.updateReturnItem.mockResolvedValue({
      id: 'ri-1',
      return_authorization_id: 'ra-1',
      inventory_unit_id: 'iu-1',
      resellable: true,
      inventoryUnit: { state: 'returned' },
      returnAuthorization: { id: 'ra-1', state: ReturnAuthorizationState.AUTHORIZED },
    });

    const result = await service.evaluateReturnItem({
      returnItemId: 'ri-1',
      receptionStatus: ReturnItemReceptionStatus.RECEIVED,
      acceptanceStatus: ReturnItemAcceptanceStatus.ACCEPTED,
      autoReintegrate: true,
      reintegrateToLocationId: 'loc-1',
    });

    expect(inventoryFacade.updateInventoryUnitState).toHaveBeenCalledWith('iu-1', 'returned', false);
    expect(inventoryFacade.getStockLocation).toHaveBeenCalledWith('loc-1');
    expect(returnAuthorizationRepository.updateAuthorization).toHaveBeenCalledWith('ra-1', {
      state: ReturnAuthorizationState.RECEIVED,
    });
    expect(inventoryFacade.updateInventoryUnitState).toHaveBeenCalledWith(
      'iu-1',
      'reintegrated',
      false,
    );
    expect(result.id).toBe('ri-1');
  });

  it('marks inventory as non-resellable when a received item is rejected', async () => {
    returnItemRepository.findReturnItemByIdOrThrow
      .mockResolvedValueOnce({
        id: 'ri-1',
        return_authorization_id: 'ra-1',
      })
      .mockResolvedValueOnce({
        id: 'ri-1',
        return_authorization_id: 'ra-1',
        inventory_unit_id: 'iu-1',
        resellable: false,
        inventoryUnit: { state: 'returned' },
        returnAuthorization: { id: 'ra-1', state: ReturnAuthorizationState.RECEIVED },
      });
    returnAuthorizationRepository.findAuthorizationByIdOrThrow.mockResolvedValue({
      id: 'ra-1',
      state: ReturnAuthorizationState.RECEIVED,
    });
    returnItemRepository.updateReturnItem.mockResolvedValue({
      id: 'ri-1',
      return_authorization_id: 'ra-1',
      inventory_unit_id: 'iu-1',
      resellable: false,
      inventoryUnit: { state: 'returned' },
      returnAuthorization: { id: 'ra-1', state: ReturnAuthorizationState.RECEIVED },
    });

    const result = await service.evaluateReturnItem({
      returnItemId: 'ri-1',
      acceptanceStatus: ReturnItemAcceptanceStatus.REJECTED,
      resellable: false,
    });

    expect(inventoryFacade.updateInventoryUnitState).toHaveBeenCalledWith(
      'iu-1',
      'non_resellable',
      false,
    );
    expect(inventoryFacade.getStockLocation).not.toHaveBeenCalled();
    expect(result.id).toBe('ri-1');
  });
});