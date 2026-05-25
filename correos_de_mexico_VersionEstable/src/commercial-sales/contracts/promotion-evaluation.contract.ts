export interface PromotionEvaluationLineInput {
  lineItemId: string;
  variantId: string | null;
  quantity: number;
  unitPrice: number;
  lineSubtotal: number;
}

export interface PromotionEvaluationInput {
  orderId: string;
  userId: string | null;
  storeId: string | null;
  currency: string | null;
  itemTotal: number;
  lineItems: PromotionEvaluationLineInput[];
}

export interface PromotionLineAdjustment {
  lineItemId: string;
  promoTotal: number;
}

export interface PromotionEvaluationResult {
  // monto promocional negativo a nivel de orden.
  orderPromoTotal: number;
  // montos promocionales negativos a nivel de línea.
  lineAdjustments: PromotionLineAdjustment[];
  // impacto promocional total negativo (orden + líneas).
  adjustmentTotal?: number;
}

export interface PromotionGateway {
  evaluateOrderPromotions(
    input: PromotionEvaluationInput,
  ): Promise<PromotionEvaluationResult>;
}

export const PROMOTION_GATEWAY = Symbol('PROMOTION_GATEWAY');

export class NoopPromotionGateway implements PromotionGateway {
  async evaluateOrderPromotions(): Promise<PromotionEvaluationResult> {
    return {
      orderPromoTotal: 0,
      lineAdjustments: [],
      adjustmentTotal: 0,
    };
  }
}