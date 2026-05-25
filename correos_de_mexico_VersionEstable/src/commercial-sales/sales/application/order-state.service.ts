import { Injectable } from '@nestjs/common';
import { OrderRepository } from '../infrastructure/repositories/order.repository';
import { OrderState, ORDER_STATE_TRANSITIONS } from '../domain/enums/order-state.enum';
import {
  OrderAlreadyCancelledException,
  InvalidOrderStateTransitionException,
  OrderNotEditableException,
  OrderNotFulfillabeException,
  OrderNotPayableException,
} from '../domain/exceptions/order.exceptions';
import {
  isFulfillabeOrderState,
  isPayableOrderState,
} from '../domain/policies/order-commercial.policy';

@Injectable()
export class OrderStateService {
  constructor(private readonly orderRepo: OrderRepository) {}

  async assertOrderIsEditable(orderId: string) {
    const order = await this.orderRepo.findByIdOrThrow(orderId);
    if (!this.isEditableState(order.state ?? '')) {
      throw new OrderNotEditableException(orderId, order.state ?? '');
    }

    return order;
  }

  async transitionTo(orderId: string, targetState: OrderState): Promise<void> {
    const order = await this.orderRepo.findByIdOrThrow(orderId);
    const currentState = order.state as OrderState;

    if (currentState === OrderState.CANCELLED) {
      throw new OrderAlreadyCancelledException(orderId);
    }

    const allowed = ORDER_STATE_TRANSITIONS[currentState] ?? [];
    if (!allowed.includes(targetState)) {
      throw new InvalidOrderStateTransitionException(currentState, targetState);
    }

    await this.orderRepo.updateState(orderId, targetState);
  }

  async cancelOrder(orderId: string): Promise<void> {
    const order = await this.orderRepo.findByIdOrThrow(orderId);
    const current = order.state as OrderState;

    if (current === OrderState.CANCELLED) {
      throw new OrderAlreadyCancelledException(orderId);
    }

    await this.orderRepo.updateState(orderId, OrderState.CANCELLED);
  }

  isEditableState(state: string): boolean {
    return state === OrderState.CART || state === OrderState.ADDRESS;
  }

  isPayableState(state?: string | null): boolean {
    return isPayableOrderState(state);
  }

  isFulfillabeState(state?: string | null): boolean {
    return isFulfillabeOrderState(state);
  }

  assertOrderIsPayable(orderId: string, state?: string | null) {
    if (!this.isPayableState(state)) {
      throw new OrderNotPayableException(orderId, state ?? 'unknown');
    }
  }

  assertOrderIsFulfillabe(orderId: string, state?: string | null) {
    if (!this.isFulfillabeState(state)) {
      throw new OrderNotFulfillabeException(orderId, state ?? 'unknown');
    }
  }

  async markPending(orderId: string): Promise<void> {
    await this.transitionTo(orderId, OrderState.PENDING);
  }

  async markApproved(orderId: string): Promise<void> {
    await this.transitionTo(orderId, OrderState.APPROVED);
  }
}
