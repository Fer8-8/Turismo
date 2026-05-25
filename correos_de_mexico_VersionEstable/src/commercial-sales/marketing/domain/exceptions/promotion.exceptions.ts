import {
  AppNotFoundException,
  BusinessException,
} from '../../../../core/shared';

export class PromotionNotFoundException extends AppNotFoundException {
  constructor(id: string) {
    super('Promotion', id);
  }
}

export class PromotionRuleNotFoundException extends AppNotFoundException {
  constructor(id: string) {
    super('PromotionRule', id);
  }
}

export class PromotionActionNotFoundException extends AppNotFoundException {
  constructor(id: string) {
    super('PromotionAction', id);
  }
}

export class PromotionCategoryNotFoundException extends AppNotFoundException {
  constructor(id: string) {
    super('PromotionCategory', id);
  }
}

export class PromoCodeNotFoundException extends BusinessException {
  constructor(code: string) {
    super(`Código promocional "${code}" no encontrado`, 'PROMO_CODE_NOT_FOUND');
  }
}

export class PromotionInactiveException extends BusinessException {
  constructor(id: string) {
    super(`La promoción ${id} no está activa`, 'PROMOTION_INACTIVE');
  }
}

export class PromotionExpiredException extends BusinessException {
  constructor(id: string) {
    super(`La promoción ${id} ha expirado`, 'PROMOTION_EXPIRED');
  }
}

export class PromotionNotStartedException extends BusinessException {
  constructor(id: string) {
    super(`La promoción ${id} aún no ha iniciado`, 'PROMOTION_NOT_STARTED');
  }
}

export class PromotionUsageLimitExceededException extends BusinessException {
  constructor(id: string) {
    super(
      `La promoción ${id} ha alcanzado su límite de uso`,
      'PROMOTION_USAGE_LIMIT_EXCEEDED',
    );
  }
}

export class PromotionAlreadyAssignedToStoreException extends BusinessException {
  constructor(promotionId: string, storeId: string) {
    super(
      `La promoción ${promotionId} ya está asignada a la tienda ${storeId}`,
      'PROMOTION_ALREADY_ASSIGNED',
    );
  }
}

export class PromotionNotAssignedToStoreException extends BusinessException {
  constructor(promotionId: string, storeId: string) {
    super(
      `La promoción ${promotionId} no está asignada a la tienda ${storeId}`,
      'PROMOTION_NOT_ASSIGNED',
    );
  }
}

export class InvalidActionPreferencesException extends BusinessException {
  constructor(actionType: string) {
    super(
      `Parámetros inválidos para la acción de tipo "${actionType}"`,
      'INVALID_ACTION_PREFERENCES',
    );
  }
}
