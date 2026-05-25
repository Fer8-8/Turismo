jest.mock('#prisma/client', () => ({}), { virtual: true });

import { Test, TestingModule } from '@nestjs/testing';
import { ShippingRateService } from './shipping-rate.service';
import { ShipmentRepository } from '../infrastructure/repositories/shipment.repository';
import { ShippingRateRepository } from '../infrastructure/repositories/shipping-rate.repository';
import { ShippingMethodService } from './shipping-method.service';
import { SalesFacade } from '../../commercial-sales/sales/facades/sales.facade';
import { TaxFacade } from '../../location/tax/facades/tax.facade';

describe('ShippingRateService', () => {
  let service: ShippingRateService;
  let shipmentRepo: {
    findByIdOrThrow: jest.Mock;
    updateSelectedRateTotals: jest.Mock;
  };
  let rateRepo: {
    create: jest.Mock;
    update: jest.Mock;
    findByIdOrThrow: jest.Mock;
    deselectByShipment: jest.Mock;
    select: jest.Mock;
    findByShipment: jest.Mock;
  };
  let shippingMethodService: {
    validateMethodAvailable: jest.Mock;
  };
  let salesFacade: {
    getFulfillmentContext: jest.Mock;
  };
  let taxFacade: {
    getRateById: jest.Mock;
  };

  beforeEach(async () => {
    shipmentRepo = {
      findByIdOrThrow: jest.fn(),
      updateSelectedRateTotals: jest.fn(),
    };
    rateRepo = {
      create: jest.fn(),
      update: jest.fn(),
      findByIdOrThrow: jest.fn(),
      deselectByShipment: jest.fn(),
      select: jest.fn(),
      findByShipment: jest.fn(),
    };
    shippingMethodService = {
      validateMethodAvailable: jest.fn(),
    };
    salesFacade = {
      getFulfillmentContext: jest.fn(),
    };
    taxFacade = {
      getRateById: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ShippingRateService,
        { provide: ShipmentRepository, useValue: shipmentRepo },
        { provide: ShippingRateRepository, useValue: rateRepo },
        { provide: ShippingMethodService, useValue: shippingMethodService },
        { provide: SalesFacade, useValue: salesFacade },
        { provide: TaxFacade, useValue: taxFacade },
      ],
    }).compile();

    service = module.get<ShippingRateService>(ShippingRateService);
  });

  it('returns the final selected rate when create selects it immediately', async () => {
    shipmentRepo.findByIdOrThrow.mockResolvedValue({ id: 'shipment-1', order_id: 'order-1' });
    salesFacade.getFulfillmentContext.mockResolvedValue({ storeId: 'store-1' });
    shippingMethodService.validateMethodAvailable.mockResolvedValue(true);
    taxFacade.getRateById.mockResolvedValue({
      id: 'tax-1',
      name: 'IVA',
      amount: 0.16,
      included_in_price: false,
    });
    rateRepo.create.mockResolvedValue({
      id: 'rate-1',
      shipment_id: 'shipment-1',
      shipping_method_id: 'method-1',
      cost: 100,
      selected: false,
      tax_rate_id: 'tax-1',
      shippingMethod: { id: 'method-1', name: 'Express' },
    });
    rateRepo.findByIdOrThrow.mockResolvedValue({
      id: 'rate-1',
      shipment_id: 'shipment-1',
      tax_rate_id: 'tax-1',
    });
    rateRepo.select.mockResolvedValue({
      id: 'rate-1',
      shipment_id: 'shipment-1',
      shipping_method_id: 'method-1',
      cost: 100,
      selected: true,
      tax_rate_id: 'tax-1',
      shippingMethod: { id: 'method-1', name: 'Express' },
    });
    rateRepo.findByShipment.mockResolvedValue([
      {
        id: 'rate-1',
        shipment_id: 'shipment-1',
        shipping_method_id: 'method-1',
        cost: 100,
        selected: true,
        tax_rate_id: 'tax-1',
        shippingMethod: { id: 'method-1', name: 'Express' },
      },
    ]);
    shipmentRepo.updateSelectedRateTotals.mockResolvedValue({
      id: 'shipment-1',
      shippingRates: [],
      cost: 100,
      adjustment_total: 0,
      additional_tax_total: 16,
      promo_total: 0,
      included_tax_total: 0,
      pre_tax_amount: 100,
      taxable_adjustment_total: 0,
      non_taxable_adjustment_total: 0,
    });

    const result = await service.createShippingRate({
      shipmentId: 'shipment-1',
      shippingMethodId: 'method-1',
      cost: 100,
      taxRateId: 'tax-1',
      selected: true,
    });

    expect(rateRepo.deselectByShipment).toHaveBeenCalledWith('shipment-1');
    expect(rateRepo.select).toHaveBeenCalledWith('rate-1');
    expect(result.id).toBe('rate-1');
    expect(result.selected).toBe(true);
    expect(result.taxRate?.id).toBe('tax-1');
  });

  it('returns the final selected rate when update selects it immediately', async () => {
    rateRepo.update.mockResolvedValue({
      id: 'rate-1',
      shipment_id: 'shipment-1',
      shipping_method_id: 'method-1',
      cost: 150,
      selected: false,
      tax_rate_id: 'tax-1',
      shippingMethod: { id: 'method-1', name: 'Express' },
    });
    rateRepo.findByIdOrThrow.mockResolvedValue({
      id: 'rate-1',
      shipment_id: 'shipment-1',
      tax_rate_id: 'tax-1',
    });
    rateRepo.select.mockResolvedValue({
      id: 'rate-1',
      shipment_id: 'shipment-1',
      shipping_method_id: 'method-1',
      cost: 150,
      selected: true,
      tax_rate_id: 'tax-1',
      shippingMethod: { id: 'method-1', name: 'Express' },
    });
    rateRepo.findByShipment.mockResolvedValue([
      {
        id: 'rate-1',
        shipment_id: 'shipment-1',
        shipping_method_id: 'method-1',
        cost: 150,
        selected: true,
        tax_rate_id: 'tax-1',
        shippingMethod: { id: 'method-1', name: 'Express' },
      },
    ]);
    shipmentRepo.updateSelectedRateTotals.mockResolvedValue({
      id: 'shipment-1',
      shippingRates: [],
      cost: 150,
      adjustment_total: 0,
      additional_tax_total: 24,
      promo_total: 0,
      included_tax_total: 0,
      pre_tax_amount: 150,
      taxable_adjustment_total: 0,
      non_taxable_adjustment_total: 0,
    });
    taxFacade.getRateById.mockResolvedValue({
      id: 'tax-1',
      name: 'IVA',
      amount: 0.16,
      included_in_price: false,
    });

    const result = await service.updateShippingRate({
      rateId: 'rate-1',
      selected: true,
    });

    expect(rateRepo.select).toHaveBeenCalledWith('rate-1');
    expect(result.selected).toBe(true);
    expect(result.cost).toBe(150);
  });

  it('selects a rate explicitly and keeps shipment totals aligned with the selected rate', async () => {
    rateRepo.findByIdOrThrow.mockResolvedValue({
      id: 'rate-2',
      shipment_id: 'shipment-1',
      tax_rate_id: 'tax-1',
      cost: 80,
    });
    rateRepo.select.mockResolvedValue({
      id: 'rate-2',
      shipment_id: 'shipment-1',
      shipping_method_id: 'method-2',
      cost: 80,
      selected: true,
      tax_rate_id: 'tax-1',
      shippingMethod: { id: 'method-2', name: 'Standard' },
    });
    rateRepo.findByShipment.mockResolvedValue([
      {
        id: 'rate-1',
        shipment_id: 'shipment-1',
        shipping_method_id: 'method-1',
        cost: 120,
        selected: false,
        tax_rate_id: 'tax-1',
        shippingMethod: { id: 'method-1', name: 'Express' },
      },
      {
        id: 'rate-2',
        shipment_id: 'shipment-1',
        shipping_method_id: 'method-2',
        cost: 80,
        selected: true,
        tax_rate_id: 'tax-1',
        shippingMethod: { id: 'method-2', name: 'Standard' },
      },
    ]);
    shipmentRepo.updateSelectedRateTotals.mockResolvedValue({
      id: 'shipment-1',
      shippingRates: [],
      cost: 80,
      adjustment_total: 0,
      additional_tax_total: 12.8,
      promo_total: 0,
      included_tax_total: 0,
      pre_tax_amount: 80,
      taxable_adjustment_total: 0,
      non_taxable_adjustment_total: 0,
    });
    taxFacade.getRateById.mockResolvedValue({
      id: 'tax-1',
      name: 'IVA',
      amount: 0.16,
      included_in_price: false,
    });

    const result = await service.selectShippingRate('rate-2');

    expect(rateRepo.deselectByShipment).toHaveBeenCalledWith('shipment-1');
    expect(rateRepo.select).toHaveBeenCalledWith('rate-2');
    expect(shipmentRepo.updateSelectedRateTotals).toHaveBeenCalledWith('shipment-1', {
      cost: 80,
      pre_tax_amount: 80,
      included_tax_total: 0,
      additional_tax_total: 12.8,
    });
    expect(result.selected_shipping_rate_id).toBe('rate-2');
    expect(result.shippingRates.filter((rate) => rate.selected)).toHaveLength(1);
  });
});