import { Injectable } from '@nestjs/common';
import { LineItemRepository } from '../infrastructure/repositories/line-item.repository';
import { OrderStateService } from './order-state.service';
import { OrderValidationService } from './order-validation.service';
import { OrderPricingService } from './order-pricing.service';
import {
  LineItemQuantityException,
  DuplicateLineItemException,
} from '../domain/exceptions/order.exceptions';
import { calculateLineSubtotal } from '../domain/calculators/order-totals.calculator';

export interface AddLineItemInput {
  orderId: string;
  variantId: string;
  quantity: number;
}

export interface UpdateLineItemInput {
  lineItemId: string;
  orderId: string;
  quantity: number;
}

@Injectable()
export class LineItemService {
  constructor(
    private readonly lineItemRepo: LineItemRepository,
    private readonly orderStateService: OrderStateService,
    private readonly validationService: OrderValidationService,
    private readonly pricingService: OrderPricingService,
  ) {}

  async addLineItem(input: AddLineItemInput) {
    const { orderId, variantId, quantity } = input;

    if (quantity <= 0) throw new LineItemQuantityException(quantity);

    const order = await this.orderStateService.assertOrderIsEditable(orderId);

    // prevenir variantes duplicadas en la misma orden
    const existing = await this.lineItemRepo.findByOrderAndVariant(
      orderId,
      variantId,
    );
    if (existing) {
      throw new DuplicateLineItemException(variantId);
    }

    const variantData = await this.validationService.validateAndResolveVariant({
      variantId,
      quantity,
      checkInventory: true,
    });

    const lineItem = await this.lineItemRepo.create({
      order_id: orderId,
      variant_id: variantId,
      quantity,
      price: variantData.basePrice,
      currency: variantData.currency,
      cost_price: variantData.costPrice,
      tax_category_id: variantData.taxCategoryId,
    });

    await this.recalculateOrderTotals(orderId, order.shipAddress?.state_id ?? undefined);

    return lineItem;
  }

  async updateQuantity(input: UpdateLineItemInput) {
    const { lineItemId, orderId, quantity } = input;

    if (quantity <= 0) throw new LineItemQuantityException(quantity);

    const order = await this.orderStateService.assertOrderIsEditable(orderId);

    const lineItem = await this.lineItemRepo.findByIdOrThrow(lineItemId);

    await this.validationService.validateAndResolveVariant({
      variantId: lineItem.variant_id!,
      quantity,
      checkInventory: true,
    });

    const updated = await this.lineItemRepo.update(lineItemId, { quantity });

    await this.recalculateOrderTotals(orderId, order.shipAddress?.state_id ?? undefined);

    return updated;
  }

  async removeLineItem(orderId: string, lineItemId: string) {
    const order = await this.orderStateService.assertOrderIsEditable(orderId);

    await this.lineItemRepo.findByIdOrThrow(lineItemId);
    await this.lineItemRepo.delete(lineItemId);

    await this.recalculateOrderTotals(orderId, order.shipAddress?.state_id ?? undefined);
  }

  getLineItems(orderId: string) {
    return this.lineItemRepo.findByOrder(orderId);
  }

  // ayuda de subtotal expuesta para recálculo de precios.
  computeLineSubtotal(price: number, quantity: number): number {
    return calculateLineSubtotal(price, quantity);
  }

  private async recalculateOrderTotals(orderId: string, stateId?: string) {
    await this.pricingService.recalculate(orderId, { stateId });
  }
}
