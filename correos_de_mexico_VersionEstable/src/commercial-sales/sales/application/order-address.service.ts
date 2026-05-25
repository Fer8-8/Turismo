import { Injectable } from '@nestjs/common';
import { OrderRepository } from '../infrastructure/repositories/order.repository';
import { AddressFacade } from '../../../core/address/facades/address.facade';
import { OrderStateService } from './order-state.service';
import { OrderPricingService } from './order-pricing.service';
import { OrderState } from '../domain/enums/order-state.enum';
import { OrderAddressNotFoundException } from '../domain/exceptions/order.exceptions';

export interface AssignAddressInput {
  orderId: string;
  shipAddressId?: string;
  billAddressId?: string;
}

@Injectable()
export class OrderAddressService {
  constructor(
    private readonly orderRepo: OrderRepository,
    private readonly addressFacade: AddressFacade,
    private readonly orderStateService: OrderStateService,
    private readonly pricingService: OrderPricingService,
  ) {}

  async assignAddresses(input: AssignAddressInput) {
    const { orderId, shipAddressId, billAddressId } = input;

    const order = await this.orderStateService.assertOrderIsEditable(orderId);

    if (shipAddressId) {
      await this.validateAddress(shipAddressId);
    }
    if (billAddressId) {
      await this.validateAddress(billAddressId);
    }

    const updated = await this.orderRepo.updateAddresses(orderId, {
      ship_address_id: shipAddressId,
      bill_address_id: billAddressId,
    });

    // transición al estado dirección si no está ya allí y las direcciones están completas
    if (
      order.state === OrderState.CART &&
      (updated.ship_address_id || updated.bill_address_id)
    ) {
      await this.orderStateService.transitionTo(orderId, OrderState.ADDRESS);
    }

    // recalcular impuestos con la nueva zona de dirección de envío
    const shipAddress = updated.shipAddress;
    const stateId = shipAddress?.state_id ?? undefined;
    await this.pricingService.recalculate(orderId, { stateId });

    return this.orderRepo.findByIdOrThrow(orderId);
  }

  private async validateAddress(addressId: string): Promise<void> {
    const address = await this.addressFacade.getAddressById(addressId);
    if (!address) {
      throw new OrderAddressNotFoundException(addressId);
    }
  }
}
