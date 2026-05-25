import { Injectable } from '@nestjs/common';
import {
  OrderService,
  CreateOrderInput,
  OrderHistoryFilters,
} from '../application/order.service';
import { LineItemService, AddLineItemInput, UpdateLineItemInput } from '../application/line-item.service';
import { OrderAddressService, AssignAddressInput } from '../application/order-address.service';
import { OrderPricingService } from '../application/order-pricing.service';

// salesfacade — única interfaz pública del dominio sales.
// pagos, cumplimiento y otros dominios que necesiten datos de orden
// deben usar solo esta facade. nunca inyectar servicios internos.
@Injectable()
export class SalesFacade {
  constructor(
    private readonly orderService: OrderService,
    private readonly lineItemService: LineItemService,
    private readonly orderAddressService: OrderAddressService,
    private readonly pricingService: OrderPricingService,
  ) {}

  // ─── ciclo de vida de orden ───────────────────────────────

  createOrder(input: CreateOrderInput) {
    return this.orderService.createOrder(input);
  }

  getOrder(orderId: string) {
    return this.orderService.getOrder(orderId);
  }

  getOrderByNumber(number: string) {
    return this.orderService.getOrderByNumber(number);
  }

  cancelOrder(orderId: string, reason?: string) {
    return this.orderService.cancelOrder(orderId, reason);
  }

  markOrderPending(orderId: string) {
    return this.orderService.markOrderPending(orderId);
  }

  approveOrder(orderId: string) {
    return this.orderService.approveOrder(orderId);
  }

  // ─── historial de orden ───────────────────────────────────

  getOrderHistory(filters: OrderHistoryFilters) {
    return this.orderService.getOrderHistory(filters);
  }

  getOwnedOrder(orderId: string, userId: string, storeId?: string) {
    return this.orderService.getOwnedOrder(orderId, userId, storeId);
  }

  validateOrderOwnership(orderId: string, userId: string, storeId?: string) {
    return this.orderService.validateOrderOwnership(orderId, userId, storeId);
  }

  // ─── artículos de línea ──────────────────────────────────

  addLineItem(input: AddLineItemInput) {
    return this.lineItemService.addLineItem(input);
  }

  updateLineItemQuantity(input: UpdateLineItemInput) {
    return this.lineItemService.updateQuantity(input);
  }

  removeLineItem(orderId: string, lineItemId: string) {
    return this.lineItemService.removeLineItem(orderId, lineItemId);
  }

  getLineItems(orderId: string) {
    return this.lineItemService.getLineItems(orderId);
  }

  // ─── direcciones ─────────────────────────────────────────

  assignAddresses(input: AssignAddressInput) {
    return this.orderAddressService.assignAddresses(input);
  }

  // ─── precios ─────────────────────────────────────────────

  recalculateTotals(orderId: string, stateId?: string) {
    return this.pricingService.recalculate(orderId, { stateId });
  }

  async recalculateOrderTotals(orderId: string) {
    await this.pricingService.recalculate(orderId);
    return this.orderService.getOrder(orderId);
  }

  getPaymentContext(orderId: string) {
    return this.orderService.getPaymentContext(orderId);
  }

  getFulfillmentContext(orderId: string) {
    return this.orderService.getFulfillmentContext(orderId);
  }

  getCommercialContext(orderId: string) {
    return this.orderService.getCommercialContext(orderId);
  }
}
