import { randomUUID } from 'crypto';
import { ReimbursementStatus } from '../../domain/enums/reimbursement-status.enum';
import { ReimbursementTypeKind } from '../../domain/enums/reimbursement-type-kind.enum';

export interface ReimbursementFilters {
  orderId?: string;
  customerReturnId?: string;
  status?: ReimbursementStatus;
  take?: number;
  skip?: number;
}

export interface CreateReimbursementData {
  order_id?: string | null;
  customer_return_id?: string | null;
  reimbursement_status: ReimbursementStatus;
  total?: number | null;
}

export interface UpdateReimbursementData {
  reimbursement_status?: ReimbursementStatus;
  total?: number | null;
}

export interface CreateReimbursementTypeData {
  name: string;
  active?: boolean;
  mutable?: boolean;
  type?: ReimbursementTypeKind | null;
}

export interface UpdateReimbursementTypeData {
  name?: string;
  active?: boolean;
  type?: ReimbursementTypeKind | null;
}

export interface CreateReimbursementCreditData {
  reimbursement_id: string;
  amount: number;
  creditable_id?: string | null;
  creditable_type?: string | null;
}

export const REIMBURSEMENT_CREDIT_INCLUDE = {} as const;

export const REIMBURSEMENT_INCLUDE = {
  order: {
    select: { id: true, number: true },
  },
  customerReturn: {
    select: { id: true, number: true },
  },
  reimbursementCredits: true,
  returnItems: {
    include: {
      preferredReimbursementType: {
        select: { id: true, name: true, type: true },
      },
      overrideReimbursementType: {
        select: { id: true, name: true, type: true },
      },
    },
    orderBy: { created_at: 'asc' as const },
  },
  refunds: {
    select: {
      id: true,
      amount: true,
      state: true,
      transaction_id: true,
      created_at: true,
    },
  },
} as const;

export function generateReimbursementNumber(): string {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = randomUUID().replace(/-/g, '').slice(0, 6).toUpperCase();
  return `RB${ts}${rand}`;
}
