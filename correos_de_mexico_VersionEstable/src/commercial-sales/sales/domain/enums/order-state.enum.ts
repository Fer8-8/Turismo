export enum OrderState {
  CART = 'cart',
  ADDRESS = 'address',
  PENDING = 'pending',
  APPROVED = 'approved',
  CANCELLED = 'cancelled',
}

export const ORDER_STATE_TRANSITIONS: Record<OrderState, OrderState[]> = {
  [OrderState.CART]: [OrderState.ADDRESS, OrderState.CANCELLED],
  [OrderState.ADDRESS]: [OrderState.PENDING, OrderState.CANCELLED],
  [OrderState.PENDING]: [OrderState.APPROVED, OrderState.CANCELLED],
  [OrderState.APPROVED]: [OrderState.CANCELLED],
  [OrderState.CANCELLED]: [],
};
