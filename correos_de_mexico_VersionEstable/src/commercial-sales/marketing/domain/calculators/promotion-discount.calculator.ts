import { PromotionActionType } from '../enums/promotion-action-type.enum';
import { InvalidActionPreferencesException } from '../exceptions/promotion.exceptions';

export interface FixedDiscountPreferences {
  amount: number;
}

export interface PercentDiscountPreferences {
  percent: number;
}

export type ActionPreferences = FixedDiscountPreferences | PercentDiscountPreferences;

// analizar y validar la cadena json de preferencias de acción. lanza excepción en entrada inválida.
export function parseActionPreferences(
  type: string,
  raw: string | null,
): ActionPreferences {
  if (!raw) throw new InvalidActionPreferencesException(type);

  let parsed: Record<string, unknown>;
  try {
    parsed = JSON.parse(raw) as Record<string, unknown>;
  } catch {
    throw new InvalidActionPreferencesException(type);
  }

  if (
    type === PromotionActionType.ORDER_FIXED_DISCOUNT ||
    type === PromotionActionType.LINE_ITEM_FIXED_DISCOUNT
  ) {
    if (typeof parsed.amount !== 'number' || parsed.amount < 0) {
      throw new InvalidActionPreferencesException(type);
    }
    return { amount: parsed.amount as number };
  }

  if (
    type === PromotionActionType.ORDER_PERCENT_DISCOUNT ||
    type === PromotionActionType.LINE_ITEM_PERCENT_DISCOUNT
  ) {
    if (
      typeof parsed.percent !== 'number' ||
      parsed.percent < 0 ||
      parsed.percent > 100
    ) {
      throw new InvalidActionPreferencesException(type);
    }
    return { percent: parsed.percent as number };
  }

  throw new InvalidActionPreferencesException(type);
}

// calcular descuento para una acción a nivel de orden. devuelve el monto de descuento positivo.
export function calculateOrderDiscount(
  type: string,
  preferences: ActionPreferences,
  itemTotal: number,
): number {
  if (type === PromotionActionType.ORDER_FIXED_DISCOUNT) {
    const pref = preferences as FixedDiscountPreferences;
    return parseFloat(Math.min(pref.amount, itemTotal).toFixed(2));
  }

  if (type === PromotionActionType.ORDER_PERCENT_DISCOUNT) {
    const pref = preferences as PercentDiscountPreferences;
    const pct = Math.max(0, Math.min(100, pref.percent));
    return parseFloat(((pct / 100) * itemTotal).toFixed(2));
  }

  return 0;
}

// calcular descuento para una acción a nivel de artículo de línea. devuelve el monto de descuento positivo.
export function calculateLineDiscount(
  type: string,
  preferences: ActionPreferences,
  lineSubtotal: number,
): number {
  if (type === PromotionActionType.LINE_ITEM_FIXED_DISCOUNT) {
    const pref = preferences as FixedDiscountPreferences;
    return parseFloat(Math.min(pref.amount, lineSubtotal).toFixed(2));
  }

  if (type === PromotionActionType.LINE_ITEM_PERCENT_DISCOUNT) {
    const pref = preferences as PercentDiscountPreferences;
    const pct = Math.max(0, Math.min(100, pref.percent));
    return parseFloat(((pct / 100) * lineSubtotal).toFixed(2));
  }

  return 0;
}

// devuelve verdadero cuando el tipo de acción opera a nivel de orden.
export function isOrderLevelAction(type: string): boolean {
  return (
    type === PromotionActionType.ORDER_FIXED_DISCOUNT ||
    type === PromotionActionType.ORDER_PERCENT_DISCOUNT
  );
}

// devuelve verdadero cuando el tipo de acción opera a nivel de artículo de línea.
export function isLineLevelAction(type: string): boolean {
  return (
    type === PromotionActionType.LINE_ITEM_FIXED_DISCOUNT ||
    type === PromotionActionType.LINE_ITEM_PERCENT_DISCOUNT
  );
}
