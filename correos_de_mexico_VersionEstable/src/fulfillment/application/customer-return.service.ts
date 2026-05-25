import { Injectable } from '@nestjs/common';
import { SalesFacade } from '../../commercial-sales/sales/facades/sales.facade';
import { StoreFacade } from '../../core/store/facades/store.facade';
import { InventoryFacade } from '../../inventory/inventory.facade';
import { ReturnAuthorizationState } from '../domain/enums/return-authorization-state.enum';
import {
  ReturnAuthorizationContextException,
  ReturnItemScopeException,
} from '../domain/exceptions/fulfillment.exceptions';
import { canTransitionReturnAuthorizationState } from '../domain/policies/return-state.policy';
import { CustomerReturnRepository } from '../infrastructure/repositories/customer-return.repository';
import { ReturnAuthorizationRepository } from '../infrastructure/repositories/return-authorization.repository';
import { ReturnItemRepository } from '../infrastructure/repositories/return-item.repository';
import { serializeCustomerReturn } from './fulfillment.mapper';

export interface CreateCustomerReturnInput {
  returnAuthorizationId: string;
  itemIds: string[];
  stockLocationId?: string;
}

@Injectable()
export class CustomerReturnService {
  constructor(
    private readonly customerReturnRepository: CustomerReturnRepository,
    private readonly returnAuthorizationRepository: ReturnAuthorizationRepository,
    private readonly returnItemRepository: ReturnItemRepository,
    private readonly salesFacade: SalesFacade,
    private readonly storeFacade: StoreFacade,
    private readonly inventoryFacade: InventoryFacade,
  ) {}

  async createCustomerReturn(input: CreateCustomerReturnInput) {
    if (input.itemIds.length === 0) {
      throw new ReturnItemScopeException('itemIds no puede estar vacío');
    }
    const uniqueIds = new Set(input.itemIds);
    if (uniqueIds.size !== input.itemIds.length) {
      throw new ReturnItemScopeException('itemIds contiene entradas duplicadas');
    }

    const authorization = await this.returnAuthorizationRepository.findAuthorizationByIdOrThrow(
      input.returnAuthorizationId,
    );
    if (!canTransitionReturnAuthorizationState(authorization.state, ReturnAuthorizationState.RECEIVED)) {
      throw new ReturnAuthorizationContextException(
        `ReturnAuthorization ${input.returnAuthorizationId} debe estar autorizada antes de crear una devolución de cliente`,
      );
    }

    const orderContext = await this.salesFacade.getFulfillmentContext(authorization.order_id ?? '');

    if (input.stockLocationId) {
      await this.inventoryFacade.getStockLocation(input.stockLocationId);
    }

    if (orderContext.storeId) {
      await this.storeFacade.validateStoreAccess(orderContext.storeId);
    }

    const items = await this.returnItemRepository.listReturnItemsByAuthorization(
      input.returnAuthorizationId,
    );
    const itemMap = new Map(items.map((item) => [item.id, item]));

    for (const itemId of input.itemIds) {
      const item = itemMap.get(itemId);
      if (!item) {
        throw new ReturnItemScopeException(
          `ReturnItem ${itemId} no pertenece a ReturnAuthorization ${input.returnAuthorizationId}`,
        );
      }

      if (item.customer_return_id) {
        throw new ReturnItemScopeException(
          `ReturnItem ${itemId} ya está asociado a CustomerReturn ${item.customer_return_id}`,
        );
      }
    }

    const customerReturn = await this.customerReturnRepository.createCustomerReturn({
      stock_location_id: input.stockLocationId ?? authorization.stock_location_id ?? null,
      store_id: orderContext.storeId ?? null,
    });
    const attached = await this.customerReturnRepository.attachItemsToCustomerReturn(
      customerReturn.id,
      input.itemIds,
    );

    for (const itemId of input.itemIds) {
      const item = itemMap.get(itemId);
      if (!item?.inventory_unit_id) {
        continue;
      }

      await this.inventoryFacade.updateInventoryUnitState(item.inventory_unit_id, 'returned', false);
    }

    if (authorization.state === ReturnAuthorizationState.AUTHORIZED) {
      await this.returnAuthorizationRepository.updateAuthorization(input.returnAuthorizationId, {
        state: ReturnAuthorizationState.RECEIVED,
      });
    }

    return serializeCustomerReturn(attached);
  }

  async getCustomerReturnById(customerReturnId: string) {
    const customerReturn = await this.customerReturnRepository.findCustomerReturnByIdOrThrow(
      customerReturnId,
    );
    return serializeCustomerReturn(customerReturn);
  }
}