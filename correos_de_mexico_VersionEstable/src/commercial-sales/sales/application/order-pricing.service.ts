import { Inject, Injectable } from '@nestjs/common';
import { OrderRepository } from '../infrastructure/repositories/order.repository';
import { TaxFacade } from '../../../location/tax/facades/tax.facade';
import { consolidateOrderTotals } from '../domain/calculators/order-totals.calculator';
import type { OrderTaxInput } from '../../../location/tax/tax-calculation.service';
import {
  PROMOTION_GATEWAY,
} from '../../contracts/promotion-evaluation.contract';
import type { PromotionGateway } from '../../contracts/promotion-evaluation.contract';
import { LineItemRepository } from '../infrastructure/repositories/line-item.repository';

export interface RecalculateOptions {
  // identificador del estado de la dirección de envío para resolver la zona fiscal
  stateId?: string;
}

@Injectable()
export class OrderPricingService {
  constructor(
    private readonly orderRepo: OrderRepository,
    private readonly lineItemRepo: LineItemRepository,
    private readonly taxFacade: TaxFacade,
    @Inject(PROMOTION_GATEWAY)
    private readonly promotionGateway: PromotionGateway,
  ) {}

  // lee todos los artículos de línea para una orden, calcula impuestos a través de taxfacade,
  // actualiza los campos fiscales de cada línea, luego consolida y persiste los totales de la orden.
  // seguro de llamar después de cualquier mutación de artículo de línea.
  async recalculate(
    orderId: string,
    options: RecalculateOptions = {},
  ): Promise<void> {
    const rawLines = await this.orderRepo.findLineItemsForTotals(orderId);

    if (rawLines.length === 0) {
      await this.orderRepo.updateTotals(orderId, {
        item_total: 0,
        adjustment_total: 0,
        promo_total: 0,
        shipment_total: 0,
        additional_tax_total: 0,
        included_tax_total: 0,
        payment_total: 0,
        total: 0,
        item_count: 0,
      });
      return;
    }

    // necesitamos artículos de línea completos para obtener tax_category_id
    const fullOrder = await this.orderRepo.findByIdOrThrow(orderId);
    const lineItems = fullOrder.lineItems;
    const itemTotal = parseFloat(
      lineItems
        .reduce((sum, li) => sum + Number(li.price) * li.quantity, 0)
        .toFixed(2),
    );

    // construir entrada fiscal para cada línea
    const taxLineInputs: OrderTaxInput['line_items'] = lineItems.map((li) => ({
      amount: parseFloat((Number(li.price) * li.quantity).toFixed(2)),
      tax_category_id: li.tax_category_id ?? undefined,
    }));

    const taxResult = await this.taxFacade.calculateOrderTax({
      line_items: taxLineInputs,
      state_id: options.stateId,
    });

    const promotionResult = await this.promotionGateway.evaluateOrderPromotions({
      orderId: fullOrder.id,
      userId: fullOrder.user_id,
      storeId: fullOrder.store_id,
      currency: fullOrder.currency,
      itemTotal,
      lineItems: lineItems.map((li) => ({
        lineItemId: li.id,
        variantId: li.variant_id,
        quantity: li.quantity,
        unitPrice: Number(li.price),
        lineSubtotal: parseFloat((Number(li.price) * li.quantity).toFixed(2)),
      })),
    });

    const linePromoMap = new Map(
      promotionResult.lineAdjustments.map((item) => [item.lineItemId, item.promoTotal]),
    );
    const linePromoTotal = parseFloat(
      promotionResult.lineAdjustments
        .reduce((sum, item) => sum + item.promoTotal, 0)
        .toFixed(2),
    );

    // mapear resultados fiscales de vuelta a artículos de línea (mismo orden posicional)
    const enrichedLines = lineItems.map((li, idx) => {
      const breakdown = taxResult.breakdown[idx];
      const lineSubtotal = parseFloat((Number(li.price) * li.quantity).toFixed(2));
      const includedTax = breakdown?.included_tax ?? 0;
      const linePromoTotal = linePromoMap.get(li.id) ?? 0;
      return {
        id: li.id,
        price: Number(li.price),
        quantity: li.quantity,
        pre_tax_amount: parseFloat((lineSubtotal - includedTax).toFixed(2)),
        adjustment_total: Number(li.adjustment_total),
        promo_total: linePromoTotal,
        additional_tax_total: breakdown?.additional_tax ?? 0,
        included_tax_total: includedTax,
      };
    });

    await this.lineItemRepo.updateManyPricing(
      enrichedLines.map((li) => ({
        id: li.id,
        pre_tax_amount: li.pre_tax_amount,
        additional_tax_total: li.additional_tax_total,
        included_tax_total: li.included_tax_total,
        promo_total: li.promo_total,
        adjustment_total: li.adjustment_total,
      })),
    );

    const totals = consolidateOrderTotals(enrichedLines);
    totals.additional_tax_total = taxResult.additional_tax_total;
    totals.included_tax_total = taxResult.included_tax_total;
    totals.promo_total = parseFloat(
      (promotionResult.orderPromoTotal + linePromoTotal).toFixed(2),
    );
    totals.total = parseFloat(
      (
        totals.item_total +
        totals.adjustment_total +
        totals.promo_total +
        totals.shipment_total +
        totals.additional_tax_total
      ).toFixed(2),
    );

    await this.orderRepo.updateTotals(orderId, totals);
  }
}
