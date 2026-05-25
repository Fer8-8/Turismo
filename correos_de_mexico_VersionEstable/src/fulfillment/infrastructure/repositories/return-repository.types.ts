import { randomUUID } from 'crypto';
import { ReturnAuthorizationState } from '../../domain/enums/return-authorization-state.enum';
import { ReturnItemAcceptanceStatus } from '../../domain/enums/return-item-acceptance-status.enum';
import { ReturnItemReceptionStatus } from '../../domain/enums/return-item-reception-status.enum';

export interface ReturnAuthorizationFilters {
  orderId?: string;
  state?: ReturnAuthorizationState;
  reasonId?: string;
  take?: number;
  skip?: number;
}

export interface CreateReturnAuthorizationData {
  order_id: string;
  memo?: string | null;
  state: ReturnAuthorizationState;
  stock_location_id?: string | null;
  return_authorization_reason_id?: string | null;
}

export interface UpdateReturnAuthorizationData {
  memo?: string | null;
  state?: ReturnAuthorizationState;
  stock_location_id?: string | null;
  return_authorization_reason_id?: string | null;
}

export interface CreateReturnReasonData {
  name: string;
  active?: boolean;
  mutable?: boolean;
}

export interface UpdateReturnReasonData {
  name?: string;
  active?: boolean;
  mutable?: boolean;
}

export interface CreateReturnItemData {
  return_authorization_id: string;
  inventory_unit_id: string;
  exchange_variant_id?: string | null;
  pre_tax_amount?: number;
  included_tax_total?: number;
  additional_tax_total?: number;
  reception_status?: ReturnItemReceptionStatus;
  acceptance_status?: ReturnItemAcceptanceStatus;
  acceptance_status_errors?: string | null;
  resellable?: boolean;
}

export interface UpdateReturnItemData {
  exchange_variant_id?: string | null;
  reception_status?: ReturnItemReceptionStatus;
  acceptance_status?: ReturnItemAcceptanceStatus;
  acceptance_status_errors?: string | null;
  customer_return_id?: string | null;
  resellable?: boolean;
}

export interface CreateCustomerReturnData {
  stock_location_id?: string | null;
  store_id?: string | null;
}

export const RETURN_ITEM_INCLUDE = {
  inventoryUnit: {
    include: {
      lineItem: true,
      order: true,
      shipment: true,
      variant: true,
    },
  },
  customerReturn: true,
} as const;

export const RETURN_AUTHORIZATION_INCLUDE = {
  order: {
    include: {
      lineItems: true,
    },
  },
  stockLocation: true,
  returnAuthorizationReason: true,
  returnItems: {
    include: RETURN_ITEM_INCLUDE,
    orderBy: { created_at: 'asc' as const },
  },
} as const;

export const CUSTOMER_RETURN_INCLUDE = {
  stockLocation: true,
  store: true,
  returnItems: {
    include: RETURN_ITEM_INCLUDE,
    orderBy: { created_at: 'asc' as const },
  },
} as const;

export function generateReturnNumber(prefix: string) {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = randomUUID().replace(/-/g, '').slice(0, 6).toUpperCase();
  return `${prefix}${ts}${rand}`;
}