// funciones de dominio puro para verificaciones de elegibilidad de promoción.
// sin efectos secundarios, determinista, comprobable de forma aislada.

export interface PromotionDateWindow {
  active: boolean;
  starts_at: Date | null;
  expires_at: Date | null;
}

export interface PromotionUsage {
  usage_limit: number | null;
  usage_count: number;
}

// devuelve verdadero si la promoción está activa y dentro de su ventana de fecha configurada.
export function isPromotionWithinWindow(
  promotion: PromotionDateWindow,
  now = new Date(),
): boolean {
  if (!promotion.active) return false;
  if (promotion.starts_at && promotion.starts_at > now) return false;
  if (promotion.expires_at && promotion.expires_at < now) return false;
  return true;
}

// devuelve verdadero si la promoción aún tiene usos disponibles (o no tiene límite de uso).
export function isPromotionWithinUsageLimit(promotion: PromotionUsage): boolean {
  if (promotion.usage_limit === null) return true;
  return promotion.usage_count < promotion.usage_limit;
}

// devuelve verdadero si la promoción es totalmente elegible para su aplicación.
export function isPromotionEligible(
  promotion: PromotionDateWindow & PromotionUsage,
  now = new Date(),
): boolean {
  return (
    isPromotionWithinWindow(promotion, now) &&
    isPromotionWithinUsageLimit(promotion)
  );
}
