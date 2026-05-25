import { OrderState } from '../enums/order-state.enum';

export function calculateOutstandingBalance(
  total: number,
  paymentTotal: number,
): number {
  return Math.max(0, parseFloat((total - paymentTotal).toFixed(2)));
}

export function isPayableOrderState(state?: string | null): boolean {
  return state === OrderState.PENDING || state === OrderState.APPROVED;
}

export function isFulfillabeOrderState(state?: string | null): boolean {
  return state === OrderState.APPROVED;
}
