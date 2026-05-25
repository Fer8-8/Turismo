import { Test, TestingModule } from '@nestjs/testing';
import { OrderAddressService } from './order-address.service';
import { OrderRepository } from '../infrastructure/repositories/order.repository';
import { AddressFacade } from '../../../core/address/facades/address.facade';
import { OrderStateService } from './order-state.service';
import { OrderPricingService } from './order-pricing.service';
import { OrderState } from '../domain/enums/order-state.enum';
import {
  OrderAddressNotFoundException,
  OrderNotEditableException,
} from '../domain/exceptions/order.exceptions';

const mockOrderRepo = {
  findByIdOrThrow: jest.fn(),
  updateAddresses: jest.fn(),
};

const mockAddressFacade = {
  getAddressById: jest.fn(),
};

const mockStateService = {
  assertOrderIsEditable: jest.fn(),
  transitionTo: jest.fn(),
};

const mockPricingService = {
  recalculate: jest.fn(),
};

const cartOrder = {
  id: 'ord-1',
  state: OrderState.CART,
  ship_address_id: null,
  bill_address_id: null,
};

describe('OrderAddressService', () => {
  let service: OrderAddressService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderAddressService,
        { provide: OrderRepository, useValue: mockOrderRepo },
        { provide: AddressFacade, useValue: mockAddressFacade },
        { provide: OrderStateService, useValue: mockStateService },
        { provide: OrderPricingService, useValue: mockPricingService },
      ],
    }).compile();

    service = module.get<OrderAddressService>(OrderAddressService);
    jest.clearAllMocks();
  });

  it('assigns addresses and transitions to ADDRESS state', async () => {
    mockStateService.assertOrderIsEditable.mockResolvedValue(cartOrder);
    mockOrderRepo.findByIdOrThrow
      .mockResolvedValueOnce(cartOrder)
      .mockResolvedValueOnce({
        ...cartOrder,
        state: OrderState.ADDRESS,
        ship_address_id: 'addr-1',
        shipAddress: { state_id: 'state-1' },
      });
    mockAddressFacade.getAddressById.mockResolvedValue({ id: 'addr-1' });
    mockOrderRepo.updateAddresses.mockResolvedValue({
      ...cartOrder,
      ship_address_id: 'addr-1',
      shipAddress: { state_id: 'state-1' },
    });
    mockStateService.transitionTo.mockResolvedValue(undefined);
    mockPricingService.recalculate.mockResolvedValue(undefined);

    await service.assignAddresses({
      orderId: 'ord-1',
      shipAddressId: 'addr-1',
    });

    expect(mockStateService.transitionTo).toHaveBeenCalledWith(
      'ord-1',
      OrderState.ADDRESS,
    );
    expect(mockPricingService.recalculate).toHaveBeenCalled();
  });

  it('throws OrderAddressNotFoundException for invalid addressId', async () => {
    mockStateService.assertOrderIsEditable.mockResolvedValue(cartOrder);
    mockAddressFacade.getAddressById.mockResolvedValue(null);

    await expect(
      service.assignAddresses({ orderId: 'ord-1', shipAddressId: 'ghost-addr' }),
    ).rejects.toThrow(OrderAddressNotFoundException);
  });

  it('throws OrderNotEditableException for cancelled order', async () => {
    mockStateService.assertOrderIsEditable.mockRejectedValue(
      new OrderNotEditableException('ord-1', OrderState.CANCELLED),
    );

    await expect(
      service.assignAddresses({ orderId: 'ord-1', shipAddressId: 'addr-1' }),
    ).rejects.toThrow(OrderNotEditableException);
  });
});
