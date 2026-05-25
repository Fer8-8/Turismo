import { Injectable } from '@nestjs/common';
import { InventoryFacade } from '../../inventory/inventory.facade';
import { ReturnAuthorizationState } from '../domain/enums/return-authorization-state.enum';
import { ReturnItemAcceptanceStatus } from '../domain/enums/return-item-acceptance-status.enum';
import { ReturnItemReceptionStatus } from '../domain/enums/return-item-reception-status.enum';
import {
  ReturnAuthorizationContextException,
  ReturnItemScopeException,
} from '../domain/exceptions/fulfillment.exceptions';
import {
  canTransitionReturnAuthorizationState,
  isReturnAuthorizationTerminalState,
} from '../domain/policies/return-state.policy';
import { ReturnAuthorizationRepository } from '../infrastructure/repositories/return-authorization.repository';
import { ReturnItemRepository } from '../infrastructure/repositories/return-item.repository';
import { serializeReturnItem } from './fulfillment.mapper';

interface InventoryUnitAmountFields {
  quantity?: number | null;
  lineItem?: {
    quantity?: number | null;
    pre_tax_amount?: { toNumber?: () => number } | number | null;
    included_tax_total?: { toNumber?: () => number } | number | null;
    additional_tax_total?: { toNumber?: () => number } | number | null;
  } | null;
}

export interface AddReturnItemInput {
  returnAuthorizationId: string;
  inventoryUnitId: string;
  exchangeVariantId?: string;
  resellable?: boolean;
}

export interface EvaluateReturnItemInput {
  returnItemId: string;
  receptionStatus?: ReturnItemReceptionStatus;
  acceptanceStatus?: ReturnItemAcceptanceStatus;
  acceptanceStatusErrors?: string;
  resellable?: boolean;
  autoReintegrate?: boolean;
  reintegrateToLocationId?: string;
}

@Injectable()
export class ReturnItemService {
  constructor(
    private readonly returnAuthorizationRepository: ReturnAuthorizationRepository,
    private readonly returnItemRepository: ReturnItemRepository,
    private readonly inventoryFacade: InventoryFacade,
  ) {}

  async addReturnItem(input: AddReturnItemInput) {
    const authorization = await this.returnAuthorizationRepository.findAuthorizationByIdOrThrow(
      input.returnAuthorizationId,
    );
    if (isReturnAuthorizationTerminalState(authorization.state)) {
      throw new ReturnItemScopeException(
        `No se pueden agregar artículos a ReturnAuthorization ${input.returnAuthorizationId} en estado terminal`,
      );
    }

    const existingItem = await this.returnItemRepository.findReturnItemByInventoryUnit(
      input.inventoryUnitId,
    );
    if (existingItem) {
      throw new ReturnItemScopeException(
        `InventoryUnit ${input.inventoryUnitId} ya está vinculada a ReturnItem ${existingItem.id}`,
      );
    }

    const inventoryUnit = await this.inventoryFacade.getInventoryUnit(input.inventoryUnitId);
    if (!inventoryUnit.order_id || inventoryUnit.order_id !== authorization.order_id) {
      throw new ReturnItemScopeException(
        `InventoryUnit ${input.inventoryUnitId} no pertenece a la orden ${authorization.order_id}`,
      );
    }

    const amounts = this.resolveReturnItemAmounts(inventoryUnit);

    const item = await this.returnItemRepository.createReturnItem({
      return_authorization_id: input.returnAuthorizationId,
      inventory_unit_id: input.inventoryUnitId,
      exchange_variant_id: input.exchangeVariantId ?? null,
      pre_tax_amount: amounts.preTaxAmount,
      included_tax_total: amounts.includedTaxTotal,
      additional_tax_total: amounts.additionalTaxTotal,
      reception_status: ReturnItemReceptionStatus.PENDING,
      acceptance_status: ReturnItemAcceptanceStatus.PENDING,
      resellable: input.resellable ?? true,
    });

    return serializeReturnItem(item);
  }

  async getReturnItemById(returnItemId: string) {
    const item = await this.returnItemRepository.findReturnItemByIdOrThrow(returnItemId);
    return serializeReturnItem(item);
  }

  async listReturnItemsByAuthorization(returnAuthorizationId: string) {
    await this.returnAuthorizationRepository.findAuthorizationByIdOrThrow(returnAuthorizationId);
    const items = await this.returnItemRepository.listReturnItemsByAuthorization(returnAuthorizationId);
    return items.map((item) => serializeReturnItem(item));
  }

  async evaluateReturnItem(input: EvaluateReturnItemInput) {
    const item = await this.returnItemRepository.findReturnItemByIdOrThrow(input.returnItemId);
    const authorization = await this.returnAuthorizationRepository.findAuthorizationByIdOrThrow(
      item.return_authorization_id ?? '',
    );

    if (
      input.receptionStatus === ReturnItemReceptionStatus.RECEIVED &&
      !canTransitionReturnAuthorizationState(authorization.state, ReturnAuthorizationState.RECEIVED)
    ) {
      throw new ReturnAuthorizationContextException(
        `ReturnAuthorization ${authorization.id} debe estar autorizada antes de recibir artículos`,
      );
    }

    const updated = await this.returnItemRepository.updateReturnItem(input.returnItemId, {
      ...(input.receptionStatus !== undefined ? { reception_status: input.receptionStatus } : {}),
      ...(input.acceptanceStatus !== undefined ? { acceptance_status: input.acceptanceStatus } : {}),
      ...(input.acceptanceStatusErrors !== undefined
        ? { acceptance_status_errors: input.acceptanceStatusErrors || null }
        : {}),
      ...(input.resellable !== undefined ? { resellable: input.resellable } : {}),
    });

    if (input.receptionStatus === ReturnItemReceptionStatus.RECEIVED && updated.inventory_unit_id) {
      await this.inventoryFacade.updateInventoryUnitState(updated.inventory_unit_id, 'returned', false);
    }

    if (
      input.acceptanceStatus === ReturnItemAcceptanceStatus.REJECTED &&
      updated.inventory_unit_id &&
      updated.inventoryUnit?.state !== 'reintegrated'
    ) {
      await this.inventoryFacade.updateInventoryUnitState(
        updated.inventory_unit_id,
        'non_resellable',
        false,
      );
    }

    if (
      input.autoReintegrate &&
      input.acceptanceStatus === ReturnItemAcceptanceStatus.ACCEPTED &&
      updated.inventory_unit_id &&
      updated.resellable &&
      updated.inventoryUnit?.state !== 'reintegrated'
    ) {
      if (input.reintegrateToLocationId) {
        await this.inventoryFacade.getStockLocation(input.reintegrateToLocationId);
      }

      await this.inventoryFacade.updateInventoryUnitState(
        updated.inventory_unit_id,
        'reintegrated',
        false,
      );
    }

    if (
      input.receptionStatus === ReturnItemReceptionStatus.RECEIVED &&
      authorization.state === ReturnAuthorizationState.AUTHORIZED
    ) {
      await this.returnAuthorizationRepository.updateAuthorization(item.return_authorization_id ?? '', {
        state: ReturnAuthorizationState.RECEIVED,
      });
    }

    const fresh = await this.returnItemRepository.findReturnItemByIdOrThrow(input.returnItemId);
    return serializeReturnItem(fresh);
  }

  private resolveReturnItemAmounts(inventoryUnit: InventoryUnitAmountFields) {
    const lineItem = inventoryUnit.lineItem;
    if (!lineItem) {
      return {
        preTaxAmount: 0,
        includedTaxTotal: 0,
        additionalTaxTotal: 0,
      };
    }

    const unitQuantity = Number(inventoryUnit.quantity ?? 1);
    const lineQuantity = Number(lineItem.quantity ?? 1) || 1;
    const ratio = unitQuantity / lineQuantity;

    return {
      preTaxAmount: this.roundAmount(this.toNumber(lineItem.pre_tax_amount) * ratio),
      includedTaxTotal: this.roundAmount(this.toNumber(lineItem.included_tax_total) * ratio),
      additionalTaxTotal: this.roundAmount(
        this.toNumber(lineItem.additional_tax_total) * ratio,
      ),
    };
  }

  private toNumber(value: { toNumber?: () => number } | number | null | undefined) {
    if (value === null || value === undefined) {
      return 0;
    }

    if (typeof value === 'number') {
      return value;
    }

    return value.toNumber?.() ?? Number(value);
  }

  private roundAmount(value: number) {
    return Math.round(value * 10000) / 10000;
  }
}