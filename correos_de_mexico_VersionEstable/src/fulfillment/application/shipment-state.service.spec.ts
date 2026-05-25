import { Test, TestingModule } from '@nestjs/testing';
import { ShipmentStateService } from './shipment-state.service';
import { ShipmentRepository } from '../infrastructure/repositories/shipment.repository';
import { EventBusService } from '../../core/shared';
import { ShipmentStateTransitionException } from '../domain/exceptions/fulfillment.exceptions';

describe('ShipmentStateService', () => {
  let service: ShipmentStateService;
  let shipmentRepo: {
    findByIdOrThrow: jest.Mock;
    updateState: jest.Mock;
  };
  let eventBus: {
    emit: jest.Mock;
  };

  beforeEach(async () => {
    shipmentRepo = {
      findByIdOrThrow: jest.fn(),
      updateState: jest.fn(),
    };
    eventBus = {
      emit: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ShipmentStateService,
        { provide: ShipmentRepository, useValue: shipmentRepo },
        { provide: EventBusService, useValue: eventBus },
      ],
    }).compile();

    service = module.get<ShipmentStateService>(ShipmentStateService);
  });

  it('transitions a ready shipment to shipped and emits the shipping event', async () => {
    const shippedAt = new Date('2026-04-03T10:00:00.000Z');

    shipmentRepo.findByIdOrThrow.mockResolvedValue({
      id: 'shipment-1',
      order_id: 'order-1',
      tracking: 'TRACK-001',
      state: 'ready',
    });
    shipmentRepo.updateState.mockResolvedValue({
      id: 'shipment-1',
      order_id: 'order-1',
      address_id: 'address-1',
      stock_location_id: 'stock-1',
      tracking: 'TRACK-001',
      state: 'shipped',
      shipped_at: shippedAt,
      cost: 0,
      adjustment_total: 0,
      additional_tax_total: 0,
      promo_total: 0,
      included_tax_total: 0,
      pre_tax_amount: 0,
      taxable_adjustment_total: 0,
      non_taxable_adjustment_total: 0,
      shippingRates: [],
    });

    const result = await service.markShipped('shipment-1', shippedAt);

    expect(shipmentRepo.updateState).toHaveBeenCalledWith('shipment-1', 'shipped', {
      shipped_at: shippedAt,
    });
    expect(eventBus.emit).toHaveBeenCalledTimes(1);
    expect(result.state).toBe('shipped');
    expect(result.shipped_at).toEqual(shippedAt);
  });

  it('transitions a shipped shipment to delivered, persists delivered_at and emits the delivered event', async () => {
    const deliveredAt = new Date('2026-04-06T15:45:00.000Z');

    shipmentRepo.findByIdOrThrow.mockResolvedValue({
      id: 'shipment-1',
      order_id: 'order-1',
      tracking: 'TRACK-001',
      state: 'shipped',
    });
    shipmentRepo.updateState.mockResolvedValue({
      id: 'shipment-1',
      order_id: 'order-1',
      address_id: 'address-1',
      stock_location_id: 'stock-1',
      tracking: 'TRACK-001',
      state: 'delivered',
      shipped_at: new Date('2026-04-03T10:00:00.000Z'),
      delivered_at: deliveredAt,
      cost: 0,
      adjustment_total: 0,
      additional_tax_total: 0,
      promo_total: 0,
      included_tax_total: 0,
      pre_tax_amount: 0,
      taxable_adjustment_total: 0,
      non_taxable_adjustment_total: 0,
      shippingRates: [],
    });

    const result = await service.markDelivered('shipment-1', deliveredAt);

    expect(shipmentRepo.updateState).toHaveBeenCalledWith('shipment-1', 'delivered', {
      delivered_at: deliveredAt,
    });
    expect(eventBus.emit).toHaveBeenCalledTimes(1);
    expect(result.state).toBe('delivered');
    expect(result.delivered_at).toEqual(deliveredAt);
  });

  it('rejects invalid shipment state transitions', async () => {
    shipmentRepo.findByIdOrThrow.mockResolvedValue({
      id: 'shipment-1',
      state: 'pending',
    });

    await expect(service.markDelivered('shipment-1')).rejects.toThrow(
      ShipmentStateTransitionException,
    );

    expect(shipmentRepo.updateState).not.toHaveBeenCalled();
    expect(eventBus.emit).not.toHaveBeenCalled();
  });
});