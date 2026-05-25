import { Injectable } from '@nestjs/common';
import { OrderRepository } from '../infrastructure/repositories/order.repository';
import { LineItemRepository } from '../infrastructure/repositories/line-item.repository';
import { OrderValidationService } from './order-validation.service';
import { OrderPricingService } from './order-pricing.service';
import { OrderStateService } from './order-state.service';
import { EventBusService, OrderCreatedEvent, OrderCancelledEvent } from '../../../core/shared';
import { UserFacade } from '../../../core/user/facades/user.facade';
import { OrderApprovedEvent } from '../domain/events/order-approved.event';
import { OrderPendingEvent } from '../domain/events/order-pending.event';
import {
  calculateOutstandingBalance,
  isFulfillabeOrderState,
  isPayableOrderState,
} from '../domain/policies/order-commercial.policy';
import { OrderOwnershipException } from '../domain/exceptions/order.exceptions';

export interface CreateOrderInput {
  userId: string;
  storeId: string;
  currency?: string;
  channel?: string;
  lineItems: Array<{ variantId: string; quantity: number }>;
}

export interface OrderHistoryFilters {
  userId: string;
  storeId?: string;
  state?: string;
  page?: number;
  take?: number;
}

export interface OrderPaymentContext {
  orderId: string;
  state: string | null;
  storeId: string | null;
  currency: string | null;
  total: number;
  paymentTotal: number;
  outstandingBalance: number;
  payable: boolean;
}

export interface OrderFulfillmentContext {
  orderId: string;
  state: string | null;
  storeId: string | null;
  shipAddressId: string | null;
  billAddressId: string | null;
  fulfillable: boolean;
  lineItems: Array<{
    id: string;
    variantId: string | null;
    quantity: number;
    price: number;
  }>;
}

@Injectable()
export class OrderService {
  constructor(
    private readonly orderRepo: OrderRepository,
    private readonly lineItemRepo: LineItemRepository,
    private readonly validationService: OrderValidationService,
    private readonly pricingService: OrderPricingService,
    private readonly orderStateService: OrderStateService,
    private readonly eventBus: EventBusService,
    private readonly userFacade: UserFacade,
  ) {}

  async createOrder(input: CreateOrderInput) {
    const { userId, storeId, lineItems } = input;

    // 1. validar precondiciones
    await this.validationService.validateUserExists(userId);
    await this.validationService.validateStoreAccess(storeId);

    // 2. validar y resolver todas las variantes por adelantado (fallar rápido)
    const resolvedItems = await Promise.all(
      lineItems.map((li) =>
        this.validationService.validateAndResolveVariant({
          variantId: li.variantId,
          quantity: li.quantity,
          checkInventory: true,
        }).then((data) => ({ ...data, quantity: li.quantity })),
      ),
    );

    // 3. derivar correo electrónico del usuario
    const userProfile = await this.userFacade.getMinimalProfile(userId);
    const email = userProfile.email ?? '';
    const currency = input.currency ?? resolvedItems[0]?.currency ?? 'MXN';

    // 4. crear la cáscara de la orden
    const order = await this.orderRepo.create({
      user_id: userId,
      store_id: storeId,
      currency,
      email,
      channel: input.channel,
    });

    // 5. insertar artículos de línea
    for (const item of resolvedItems) {
      await this.lineItemRepo.create({
        order_id: order.id,
        variant_id: item.variantId,
        quantity: item.quantity,
        price: item.basePrice,
        currency: item.currency,
        cost_price: item.costPrice,
        tax_category_id: item.taxCategoryId,
      });
    }

    // 6. calcular totales iniciales (sin dirección aún, los impuestos pueden ser cero)
    await this.pricingService.recalculate(order.id);

    // 7. emitir evento
    const fresh = await this.orderRepo.findByIdOrThrow(order.id);
    await this.eventBus.emit(
      new OrderCreatedEvent(
        fresh.id,
        storeId,
        userId,
        fresh.lineItems.map((li) => li.id),
        Number(fresh.total),
      ),
    );

    return fresh;
  }

  getOrder(orderId: string) {
    return this.orderRepo.findByIdOrThrow(orderId);
  }

  async getOwnedOrder(orderId: string, userId: string, storeId?: string) {
    const order = await this.orderRepo.findByIdForUser(orderId, userId, storeId);
    if (!order) {
      throw new OrderOwnershipException(orderId, userId);
    }

    return order;
  }

  async validateOrderOwnership(orderId: string, userId: string, storeId?: string) {
    await this.getOwnedOrder(orderId, userId, storeId);
    return true;
  }

  getOrderByNumber(number: string) {
    return this.orderRepo.findByNumber(number);
  }

  getOrderHistory(filters: OrderHistoryFilters) {
    return this.orderRepo.findByUser(filters);
  }

  async markOrderPending(orderId: string) {
    const order = await this.orderRepo.findByIdOrThrow(orderId);
    await this.pricingService.recalculate(orderId, {
      stateId: order.shipAddress?.state_id ?? undefined,
    });
    await this.orderStateService.markPending(orderId);

    const pending = await this.orderRepo.findByIdOrThrow(orderId);
    await this.eventBus.emit(
      new OrderPendingEvent(
        pending.id,
        pending.store_id ?? '',
        pending.user_id ?? '',
        Number(pending.total),
      ),
    );

    return pending;
  }

  async approveOrder(orderId: string) {
    await this.orderStateService.markApproved(orderId);

    const approved = await this.orderRepo.findByIdOrThrow(orderId);
    await this.eventBus.emit(
      new OrderApprovedEvent(
        approved.id,
        approved.store_id ?? '',
        approved.user_id ?? '',
        Number(approved.total),
      ),
    );

    return approved;
  }

  async cancelOrder(orderId: string, reason = 'manual_cancellation') {
    await this.orderStateService.cancelOrder(orderId);

    const cancelled = await this.orderRepo.findByIdOrThrow(orderId);

    await this.eventBus.emit(
      new OrderCancelledEvent(
        cancelled.id,
        cancelled.store_id ?? '',
        reason,
      ),
    );

    return cancelled;
  }

  async getPaymentContext(orderId: string): Promise<OrderPaymentContext> {
    const order = await this.orderRepo.findByIdOrThrow(orderId);
    const total = Number(order.total);
    const paymentTotal = Number(order.payment_total);
    const outstandingBalance = calculateOutstandingBalance(total, paymentTotal);

    return {
      orderId: order.id,
      state: order.state,
      storeId: order.store_id,
      currency: order.currency,
      total,
      paymentTotal,
      outstandingBalance,
      payable:
        isPayableOrderState(order.state) && outstandingBalance > 0,
    };
  }

  async getFulfillmentContext(orderId: string): Promise<OrderFulfillmentContext> {
    const order = await this.orderRepo.findByIdOrThrow(orderId);
    const fulfillable =
      isFulfillabeOrderState(order.state) &&
      !!order.ship_address_id &&
      order.lineItems.length > 0;

    return {
      orderId: order.id,
      state: order.state,
      storeId: order.store_id,
      shipAddressId: order.ship_address_id,
      billAddressId: order.bill_address_id,
      fulfillable,
      lineItems: order.lineItems.map((li) => ({
        id: li.id,
        variantId: li.variant_id,
        quantity: li.quantity,
        price: Number(li.price),
      })),
    };
  }

  async getCommercialContext(orderId: string) {
    const payment = await this.getPaymentContext(orderId);
    const fulfillment = await this.getFulfillmentContext(orderId);
    const order = await this.orderRepo.findByIdOrThrow(orderId);

    return {
      orderId: order.id,
      number: order.number,
      state: order.state,
      storeId: order.store_id,
      userId: order.user_id,
      total: payment.total,
      paymentTotal: payment.paymentTotal,
      outstandingBalance: payment.outstandingBalance,
      payable: payment.payable,
      fulfillable: fulfillment.fulfillable,
      itemCount: order.item_count,
      approvedAt: order.approved_at,
      canceledAt: order.canceled_at,
    };
  }
}
