import { Injectable } from '@nestjs/common';
import type {
  PromotionGateway,
  PromotionEvaluationInput,
  PromotionEvaluationResult,
} from '../../contracts/promotion-evaluation.contract';
import { PromotionEvaluatorService } from '../application/promotion-evaluator.service';
import { ProductFacade } from '../../../catalog/product/facades/product.facade';

// implementa el contrato promotiongateway esperado por el dominio de ventas.
// cubre la brecha entre el modelo de datos de precios de orden y el evaluador de marketing.
//
// este adaptador:
// 1. enriquece cada artículo de línea con un productid (consultado de la variante).
// 2. delega a promotionevaluatorservice la evaluación real.
// 3. devuelve montos promocionales negativos, para que las ventas los agreguen directamente.
@Injectable()
export class MarketingPromotionGatewayAdapter implements PromotionGateway {
  constructor(
    private readonly evaluator: PromotionEvaluatorService,
    private readonly productFacade: ProductFacade,
  ) {}

  async evaluateOrderPromotions(
    input: PromotionEvaluationInput,
  ): Promise<PromotionEvaluationResult> {
    // enriquecer artículos de línea con ids de producto para evaluar reglas basadas en producto.
    const enrichedLines = await Promise.all(
      input.lineItems.map(async (li) => {
        let productId: string | null = null;
        if (li.variantId) {
          const variant = await this.productFacade
            .getVariantById(li.variantId)
            .catch(() => null);
          productId = (variant as { product?: { id?: string } } | null)?.product?.id ?? null;
        }
        return {
          lineItemId: li.lineItemId,
          variantId: li.variantId ?? null,
          productId,
          quantity: li.quantity,
          unitPrice: li.unitPrice,
          lineSubtotal: li.lineSubtotal,
        };
      }),
    );

    const result = await this.evaluator.evaluate({
      orderId: input.orderId,
      userId: input.userId ?? null,
      storeId: input.storeId ?? null,
      currency: input.currency ?? null,
      itemTotal: input.itemTotal,
      lineItems: enrichedLines,
    });

    return {
      orderPromoTotal: result.orderPromoTotal,
      lineAdjustments: result.lineAdjustments,
      adjustmentTotal: result.adjustmentTotal,
    };
  }
}
