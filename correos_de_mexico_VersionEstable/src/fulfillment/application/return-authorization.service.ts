import { Injectable } from '@nestjs/common';
import { ReturnApprovedEvent, EventBusService } from '../../core/shared';
import { SalesFacade } from '../../commercial-sales/sales/facades/sales.facade';
import { StoreFacade } from '../../core/store/facades/store.facade';
import { InventoryFacade } from '../../inventory/inventory.facade';
import { ReturnAuthorizationRepository } from '../infrastructure/repositories/return-authorization.repository';
import { ReturnAuthorizationFilters } from '../infrastructure/repositories/return-repository.types';
import { ReturnReasonRepository } from '../infrastructure/repositories/return-reason.repository';
import { ReturnAuthorizationState } from '../domain/enums/return-authorization-state.enum';
import { ReturnItemAcceptanceStatus } from '../domain/enums/return-item-acceptance-status.enum';
import {
  ReturnAuthorizationContextException,
  ReturnAuthorizationStateTransitionException,
} from '../domain/exceptions/fulfillment.exceptions';
import {
  canTransitionReturnAuthorizationState,
} from '../domain/policies/return-state.policy';
import {
  serializeReturnAuthorization,
} from './fulfillment.mapper';

export interface CreateReturnAuthorizationInput {
  orderId: string;
  reasonId?: string;
  stockLocationId?: string;
  memo?: string;
}

export interface UpdateReturnAuthorizationStateInput {
  returnAuthorizationId: string;
  memo?: string;
  reintegrateAcceptedItems?: boolean;
  locationId?: string;
}

@Injectable()
export class ReturnAuthorizationService {
  constructor(
    private readonly returnAuthorizationRepository: ReturnAuthorizationRepository,
    private readonly returnReasonRepository: ReturnReasonRepository,
    private readonly salesFacade: SalesFacade,
    private readonly storeFacade: StoreFacade,
    private readonly inventoryFacade: InventoryFacade,
    private readonly eventBus: EventBusService,
  ) {}

  async createReturnAuthorization(input: CreateReturnAuthorizationInput) {
    const orderContext = await this.salesFacade.getFulfillmentContext(input.orderId);
    if (orderContext.storeId) {
      await this.storeFacade.validateStoreAccess(orderContext.storeId);
    }

    if (input.reasonId) {
      const reason = await this.returnReasonRepository.findReasonByIdOrThrow(input.reasonId);
      if (!reason.active) {
        throw new ReturnAuthorizationContextException(
          `ReturnAuthorizationReason ${input.reasonId} no está activa`,
        );
      }
    }

    if (input.stockLocationId) {
      await this.inventoryFacade.getStockLocation(input.stockLocationId);
    }

    const authorization = await this.returnAuthorizationRepository.createAuthorization({
      order_id: input.orderId,
      memo: input.memo ?? null,
      state: ReturnAuthorizationState.REQUESTED,
      stock_location_id: input.stockLocationId ?? null,
      return_authorization_reason_id: input.reasonId ?? null,
    });

    return serializeReturnAuthorization(authorization);
  }

  async getReturnAuthorizationById(returnAuthorizationId: string) {
    const authorization = await this.returnAuthorizationRepository.findAuthorizationByIdOrThrow(
      returnAuthorizationId,
    );
    return serializeReturnAuthorization(authorization);
  }

  async listReturnAuthorizations(filters: ReturnAuthorizationFilters) {
    const authorizations = await this.returnAuthorizationRepository.listAuthorizations(filters);
    return authorizations.map((authorization) => serializeReturnAuthorization(authorization));
  }

  async authorizeReturnAuthorization(input: UpdateReturnAuthorizationStateInput) {
    return this.transitionAuthorization(input.returnAuthorizationId, ReturnAuthorizationState.AUTHORIZED, {
      memo: input.memo,
    });
  }

  async rejectReturnAuthorization(input: UpdateReturnAuthorizationStateInput) {
    return this.transitionAuthorization(input.returnAuthorizationId, ReturnAuthorizationState.REJECTED, {
      memo: input.memo,
    });
  }

  async cancelReturnAuthorization(input: UpdateReturnAuthorizationStateInput) {
    return this.transitionAuthorization(input.returnAuthorizationId, ReturnAuthorizationState.CANCELLED, {
      memo: input.memo,
    });
  }

  async approveReturnAuthorization(input: UpdateReturnAuthorizationStateInput) {
    const authorization = await this.returnAuthorizationRepository.findAuthorizationByIdOrThrow(
      input.returnAuthorizationId,
    );
    const acceptedItems = authorization.returnItems.filter(
      (item) => item.acceptance_status === ReturnItemAcceptanceStatus.ACCEPTED,
    );

    if (!acceptedItems.length) {
      throw new ReturnAuthorizationContextException(
        `ReturnAuthorization ${input.returnAuthorizationId} no tiene artículos aceptados para aprobar`,
      );
    }

    const pendingItems = authorization.returnItems.filter(
      (item) => item.acceptance_status === ReturnItemAcceptanceStatus.PENDING,
    );

    if (pendingItems.length) {
      throw new ReturnAuthorizationContextException(
        `ReturnAuthorization ${input.returnAuthorizationId} aún tiene evaluaciones de artículos pendientes`,
      );
    }

    if (input.reintegrateAcceptedItems) {
      for (const item of acceptedItems) {
        if (
          !item.resellable ||
          !item.inventory_unit_id ||
          item.inventoryUnit?.state === 'reintegrated'
        ) {
          continue;
        }

        if (input.locationId) {
          await this.inventoryFacade.getStockLocation(input.locationId);
        }

        await this.inventoryFacade.updateInventoryUnitState(
          item.inventory_unit_id,
          'reintegrated',
          false,
        );
      }
    }

    const updated = await this.transitionAuthorization(
      input.returnAuthorizationId,
      ReturnAuthorizationState.APPROVED,
      { memo: input.memo },
      false,
    );

    await this.eventBus.emit(
      new ReturnApprovedEvent(
        input.returnAuthorizationId,
        authorization.order_id ?? '',
        acceptedItems.map((item) => item.id),
      ),
    );

    return updated;
  }

  private async transitionAuthorization(
    returnAuthorizationId: string,
    nextState: ReturnAuthorizationState,
    data: { memo?: string },
    reload = true,
  ) {
    const authorization = await this.returnAuthorizationRepository.findAuthorizationByIdOrThrow(
      returnAuthorizationId,
    );
    if (!canTransitionReturnAuthorizationState(authorization.state, nextState)) {
      throw new ReturnAuthorizationStateTransitionException(authorization.state, nextState);
    }

    const updated = await this.returnAuthorizationRepository.updateAuthorization(
      returnAuthorizationId,
      {
      ...(data.memo !== undefined ? { memo: data.memo } : {}),
      state: nextState,
      },
    );

    if (!reload) {
      return serializeReturnAuthorization(updated);
    }

    const fresh = await this.returnAuthorizationRepository.findAuthorizationByIdOrThrow(
      returnAuthorizationId,
    );
    return serializeReturnAuthorization(fresh);
  }
}