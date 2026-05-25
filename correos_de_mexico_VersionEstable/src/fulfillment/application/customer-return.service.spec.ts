import { Test, TestingModule } from '@nestjs/testing';
import { SalesFacade } from '../../commercial-sales/sales/facades/sales.facade';
import { StoreFacade } from '../../core/store/facades/store.facade';
import { InventoryFacade } from '../../inventory/inventory.facade';
import { ReturnAuthorizationState } from '../domain/enums/return-authorization-state.enum';
import {
  ReturnAuthorizationContextException,
  ReturnItemScopeException,
} from '../domain/exceptions/fulfillment.exceptions';
import { CustomerReturnRepository } from '../infrastructure/repositories/customer-return.repository';
import { ReturnAuthorizationRepository } from '../infrastructure/repositories/return-authorization.repository';
import { ReturnItemRepository } from '../infrastructure/repositories/return-item.repository';
import { CustomerReturnService } from './customer-return.service';

describe('CustomerReturnService', () => {
  let service: CustomerReturnService;
  let customerReturnRepository: Record<string, jest.Mock>;
  let returnAuthorizationRepository: Record<string, jest.Mock>;
  let returnItemRepository: Record<string, jest.Mock>;
  let salesFacade: Record<string, jest.Mock>;
  let storeFacade: Record<string, jest.Mock>;
  let inventoryFacade: Record<string, jest.Mock>;

  beforeEach(async () => {
    customerReturnRepository = {
      createCustomerReturn: jest.fn(),
      attachItemsToCustomerReturn: jest.fn(),
      findCustomerReturnByIdOrThrow: jest.fn(),
    };
    returnAuthorizationRepository = {
      findAuthorizationByIdOrThrow: jest.fn(),
      updateAuthorization: jest.fn(),
    };
    returnItemRepository = {
      listReturnItemsByAuthorization: jest.fn(),
    };
    salesFacade = {
      getFulfillmentContext: jest.fn(),
    };
    storeFacade = {
      validateStoreAccess: jest.fn(),
    };
    inventoryFacade = {
      getStockLocation: jest.fn(),
      updateInventoryUnitState: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomerReturnService,
        { provide: CustomerReturnRepository, useValue: customerReturnRepository },
        { provide: ReturnAuthorizationRepository, useValue: returnAuthorizationRepository },
        { provide: ReturnItemRepository, useValue: returnItemRepository },
        { provide: SalesFacade, useValue: salesFacade },
        { provide: StoreFacade, useValue: storeFacade },
        { provide: InventoryFacade, useValue: inventoryFacade },
      ],
    }).compile();

    service = module.get(CustomerReturnService);
  });

  it('creates customer returns only after authorization and moves the authorization to received', async () => {
    returnAuthorizationRepository.findAuthorizationByIdOrThrow.mockResolvedValue({
      id: 'ra-1',
      order_id: 'ord-1',
      state: ReturnAuthorizationState.AUTHORIZED,
      stock_location_id: 'loc-1',
    });
    salesFacade.getFulfillmentContext.mockResolvedValue({
      orderId: 'ord-1',
      storeId: 'store-1',
    });
    returnItemRepository.listReturnItemsByAuthorization.mockResolvedValue([
      { id: 'ri-1', inventory_unit_id: 'iu-1', customer_return_id: null },
    ]);
    customerReturnRepository.createCustomerReturn.mockResolvedValue({ id: 'cr-1' });
    customerReturnRepository.attachItemsToCustomerReturn.mockResolvedValue({
      id: 'cr-1',
      returnItems: [{ id: 'ri-1', inventory_unit_id: 'iu-1' }],
      stockLocation: null,
      store: null,
    });

    const result = await service.createCustomerReturn({
      returnAuthorizationId: 'ra-1',
      itemIds: ['ri-1'],
    });

    expect(storeFacade.validateStoreAccess).toHaveBeenCalledWith('store-1');
    expect(customerReturnRepository.attachItemsToCustomerReturn).toHaveBeenCalledWith('cr-1', ['ri-1']);
    expect(inventoryFacade.updateInventoryUnitState).toHaveBeenCalledWith('iu-1', 'returned', false);
    expect(returnAuthorizationRepository.updateAuthorization).toHaveBeenCalledWith('ra-1', {
      state: ReturnAuthorizationState.RECEIVED,
    });
    expect(result.id).toBe('cr-1');
  });

  it('rejects customer return creation while the authorization is still requested', async () => {
    returnAuthorizationRepository.findAuthorizationByIdOrThrow.mockResolvedValue({
      id: 'ra-1',
      order_id: 'ord-1',
      state: ReturnAuthorizationState.REQUESTED,
    });

    await expect(
      service.createCustomerReturn({
        returnAuthorizationId: 'ra-1',
        itemIds: ['ri-1'],
      }),
    ).rejects.toBeInstanceOf(ReturnAuthorizationContextException);
  });

  it('rejects when itemIds is empty', async () => {
    await expect(
      service.createCustomerReturn({
        returnAuthorizationId: 'ra-1',
        itemIds: [],
      }),
    ).rejects.toBeInstanceOf(ReturnItemScopeException);
  });

  it('rejects when itemIds contains duplicates', async () => {
    await expect(
      service.createCustomerReturn({
        returnAuthorizationId: 'ra-1',
        itemIds: ['ri-1', 'ri-1'],
      }),
    ).rejects.toBeInstanceOf(ReturnItemScopeException);
  });

  it('rejects when an item does not belong to the return authorization', async () => {
    returnAuthorizationRepository.findAuthorizationByIdOrThrow.mockResolvedValue({
      id: 'ra-1',
      order_id: 'ord-1',
      state: ReturnAuthorizationState.AUTHORIZED,
      stock_location_id: 'loc-1',
    });
    salesFacade.getFulfillmentContext.mockResolvedValue({
      orderId: 'ord-1',
      storeId: 'store-1',
    });
    returnItemRepository.listReturnItemsByAuthorization.mockResolvedValue([
      { id: 'ri-2', inventory_unit_id: 'iu-2', customer_return_id: null },
    ]);

    await expect(
      service.createCustomerReturn({
        returnAuthorizationId: 'ra-1',
        itemIds: ['ri-1'],
      }),
    ).rejects.toBeInstanceOf(ReturnItemScopeException);

    expect(customerReturnRepository.createCustomerReturn).not.toHaveBeenCalled();
    expect(customerReturnRepository.attachItemsToCustomerReturn).not.toHaveBeenCalled();
  });

  it('rejects when an item is already attached to another customer return', async () => {
    returnAuthorizationRepository.findAuthorizationByIdOrThrow.mockResolvedValue({
      id: 'ra-1',
      order_id: 'ord-1',
      state: ReturnAuthorizationState.AUTHORIZED,
      stock_location_id: 'loc-1',
    });
    salesFacade.getFulfillmentContext.mockResolvedValue({
      orderId: 'ord-1',
      storeId: 'store-1',
    });
    returnItemRepository.listReturnItemsByAuthorization.mockResolvedValue([
      { id: 'ri-1', inventory_unit_id: 'iu-1', customer_return_id: 'cr-9' },
    ]);

    await expect(
      service.createCustomerReturn({
        returnAuthorizationId: 'ra-1',
        itemIds: ['ri-1'],
      }),
    ).rejects.toBeInstanceOf(ReturnItemScopeException);

    expect(customerReturnRepository.createCustomerReturn).not.toHaveBeenCalled();
  });
});