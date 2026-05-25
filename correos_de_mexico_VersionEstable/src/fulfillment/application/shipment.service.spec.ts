import { Test, TestingModule } from '@nestjs/testing';
import { ShipmentService } from './shipment.service';
import { ShipmentRepository } from '../infrastructure/repositories/shipment.repository';
import { SalesFacade } from '../../commercial-sales/sales/facades/sales.facade';
import { AddressFacade } from '../../core/address/facades/address.facade';
import { InventoryFacade } from '../../inventory/inventory.facade';
import { StoreFacade } from '../../core/store/facades/store.facade';
import { BusinessException, EventBusService } from '../../core/shared';

describe('ShipmentService', () => {
  let service: ShipmentService;
  let shipmentRepo: {
    findByIdOrThrow: jest.Mock;
    update: jest.Mock;
  };

  beforeEach(async () => {
    shipmentRepo = {
      findByIdOrThrow: jest.fn(),
      update: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ShipmentService,
        { provide: ShipmentRepository, useValue: shipmentRepo },
        { provide: SalesFacade, useValue: { getFulfillmentContext: jest.fn() } },
        { provide: AddressFacade, useValue: { getAddressById: jest.fn() } },
        { provide: InventoryFacade, useValue: { getStockLocation: jest.fn() } },
        { provide: StoreFacade, useValue: { validateStoreAccess: jest.fn() } },
        { provide: EventBusService, useValue: { emit: jest.fn() } },
      ],
    }).compile();

    service = module.get<ShipmentService>(ShipmentService);
  });

  it('rejects logistics dates in generic shipment updates', async () => {
    await expect(
      service.updateShipment({
        shipmentId: 'shipment-1',
        shippedAt: new Date(),
      } as never),
    ).rejects.toThrow(BusinessException);

    expect(shipmentRepo.findByIdOrThrow).not.toHaveBeenCalled();
    expect(shipmentRepo.update).not.toHaveBeenCalled();
  });

  it('keeps generic updates available for non-logistic fields', async () => {
    shipmentRepo.findByIdOrThrow.mockResolvedValue({ id: 'shipment-1' });
    shipmentRepo.update.mockResolvedValue({
      id: 'shipment-1',
      order_id: 'order-1',
      address_id: 'address-2',
      stock_location_id: 'stock-1',
      state: 'pending',
      tracking: 'TRACK-002',
      cost: 10,
      adjustment_total: 0,
      additional_tax_total: 0,
      promo_total: 0,
      included_tax_total: 0,
      pre_tax_amount: 10,
      taxable_adjustment_total: 0,
      non_taxable_adjustment_total: 0,
      shippingRates: [],
    });

    const result = await service.updateShipment({
      shipmentId: 'shipment-1',
      tracking: 'TRACK-002',
      baseCost: 10,
      addressId: 'address-2',
      stockLocationId: 'stock-1',
    });

    expect(shipmentRepo.update).toHaveBeenCalledWith('shipment-1', {
      address_id: 'address-2',
      stock_location_id: 'stock-1',
      tracking: 'TRACK-002',
      cost: 10,
      pre_tax_amount: 10,
    });
    expect(result.tracking).toBe('TRACK-002');
  });
});