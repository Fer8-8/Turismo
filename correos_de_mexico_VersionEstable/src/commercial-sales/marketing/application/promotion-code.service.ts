import { Injectable } from '@nestjs/common';
import { PromotionRepository } from '../infrastructure/repositories/promotion.repository';
import { EventBusService } from '../../../core/shared';
import {
  isPromotionWithinWindow,
  isPromotionWithinUsageLimit,
} from '../domain/policies/promotion-eligibility.policy';
import {
  PromoCodeNotFoundException,
  PromotionInactiveException,
  PromotionExpiredException,
  PromotionNotStartedException,
  PromotionUsageLimitExceededException,
} from '../domain/exceptions/promotion.exceptions';
import { PromoCodeValidatedEvent } from '../domain/events/promo-code-validated.event';
import { PromoCodeRejectedEvent } from '../domain/events/promo-code-rejected.event';

export interface PromoCodeValidationResult {
  promotionId: string;
  name: string | null;
  code: string;
  valid: boolean;
}

@Injectable()
export class PromotionCodeService {
  constructor(
    private readonly promotionRepo: PromotionRepository,
    private readonly eventBus: EventBusService,
  ) {}

  // valida un código de promoción y devuelve los detalles básicos de la promoción.
  // lanza una excepción específica para cada fallo de validación.
  async validate(code: string): Promise<PromoCodeValidationResult> {
    let promotion;
    try {
      promotion = await this.promotionRepo.findByCodeOrThrow(code);
    } catch {
      throw new PromoCodeNotFoundException(code);
    }

    if (!promotion.active) {
      throw new PromotionInactiveException(promotion.id);
    }

    const now = new Date();

    if (promotion.starts_at && promotion.starts_at > now) {
      throw new PromotionNotStartedException(promotion.id);
    }

    if (promotion.expires_at && promotion.expires_at < now) {
      throw new PromotionExpiredException(promotion.id);
    }

    if (!isPromotionWithinUsageLimit(promotion as any)) {
      throw new PromotionUsageLimitExceededException(promotion.id);
    }

    await this.eventBus.emit(
      new PromoCodeValidatedEvent(code, promotion.id),
    );

    return {
      promotionId: promotion.id,
      name: promotion.name ?? null,
      code: promotion.code ?? code,
      valid: true,
    };
  }

  // devuelve el estado de validación sin lanzar excepciones — útil para verificaciones suaves.
  async check(code: string): Promise<{
    valid: boolean;
    promotionId: string | null;
    code: string | null;
    reason: string | null;
  }> {
    try {
      const result = await this.validate(code);
      return {
        valid: true,
        promotionId: result.promotionId,
        code: result.code,
        reason: null,
      };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'error desconocido';
      await this.eventBus.emit(new PromoCodeRejectedEvent(code, message));
      return { valid: false, promotionId: null, code, reason: message };
    }
  }

  // verifica si una promoción tiene una regla basada en código que requiere exactamente este código.
  isCodeMatch(ruleCode: string | null, providedCode: string | undefined): boolean {
    if (!ruleCode) return false;
    if (!providedCode) return false;
    return ruleCode.trim().toUpperCase() === providedCode.trim().toUpperCase();
  }

  // verificación rápida de existencia — no valida el estado.
  async exists(code: string): Promise<boolean> {
    try {
      await this.promotionRepo.findByCodeOrThrow(code);
      return true;
    } catch {
      return false;
    }
  }

  // devuelve una promoción si el código se encuentra y está dentro de su ventana.
  // se usa en tuberías de evaluación.
  async findUsable(code: string) {
    try {
      const p = await this.promotionRepo.findByCodeOrThrow(code);
      if (!isPromotionWithinWindow(p as any) || !isPromotionWithinUsageLimit(p as any)) return null;
      return p;
    } catch {
      return null;
    }
  }
}