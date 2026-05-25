import { Injectable } from '@nestjs/common';
import { PromotionRepository } from '../infrastructure/repositories/promotion.repository';
import { PromotionRuleRepository } from '../infrastructure/repositories/promotion-rule.repository';
import { PromotionActionRepository } from '../infrastructure/repositories/promotion-action.repository';
import { PromotionCodeService } from './promotion-code.service';
import { MatchPolicy } from '../domain/enums/match-policy.enum';
import { PromotionRuleType } from '../domain/enums/promotion-rule-type.enum';
import {
  isPromotionEligible,
} from '../domain/policies/promotion-eligibility.policy';
import {
  parseActionPreferences,
  calculateOrderDiscount,
  calculateLineDiscount,
  isOrderLevelAction,
  isLineLevelAction,
} from '../domain/calculators/promotion-discount.calculator';

export interface OrderCandidateLine {
  lineItemId: string;
  variantId: string | null;
  // identificador del producto de la variante, necesario para la evaluación de regla de producto.
  productId: string | null;
  quantity: number;
  unitPrice: number;
  lineSubtotal: number;
}

export interface OrderCandidateInput {
  orderId: string;
  userId: string | null;
  storeId: string | null;
  currency: string | null;
  itemTotal: number;
  // opcional: código de promoción ingresado por el usuario para promociones activadas por código.
  promoCode?: string;
  lineItems: OrderCandidateLine[];
}

export interface LineAdjustment {
  lineItemId: string;
  promoTotal: number;
}

export interface OrderEvaluationResult {
  // suma de todos los descuentos de promoción a nivel de orden como montos negativos.
  orderPromoTotal: number;
  // montos de descuento de promoción por línea como montos negativos.
  lineAdjustments: LineAdjustment[];
  // total de todos los descuentos (orden + línea) como un monto negativo.
  adjustmentTotal: number;
  // ids de promociones que fueron aplicadas.
  appliedPromotionIds: string[];
}

interface RuleMatchResult {
  matched: boolean;
  scopesLines: boolean;
  lineItemIds: string[];
}

interface PromotionMatchResult {
  matched: boolean;
  eligibleLineItemIds: Set<string>;
}

type FullPromotion = Awaited<
  ReturnType<PromotionRepository['findActiveByStore']>
>[number];
type FullRule = Awaited<
  ReturnType<PromotionRuleRepository['findByPromotion']>
>[number];

@Injectable()
export class PromotionEvaluatorService {
  constructor(
    private readonly promotionRepo: PromotionRepository,
    private readonly ruleRepo: PromotionRuleRepository,
    private readonly actionRepo: PromotionActionRepository,
    private readonly codeService: PromotionCodeService,
  ) {}

  // evalúa todas las promociones aplicables para un candidato de orden.
  // devuelve totales de descuento agregados listos para que las ventas persistan.
  async evaluate(input: OrderCandidateInput): Promise<OrderEvaluationResult> {
    const promotions = input.storeId
      ? await this.promotionRepo.findActiveByStore(input.storeId)
      : await this.promotionRepo.findActiveGlobal();

    const eligible = promotions.filter((p) => isPromotionEligible(p));

    const lineAccumulator = new Map<string, number>();
    for (const li of input.lineItems) {
      lineAccumulator.set(li.lineItemId, 0);
    }

    let orderPromoTotal = 0;
    const appliedPromotionIds: string[] = [];

    for (const promotion of eligible) {
      const rules = await this.ruleRepo.findByPromotion(promotion.id);
      const matches = await this.promotionMatchesInput(
        promotion,
        rules,
        input,
      );
      if (!matches.matched) continue;

      const actions = await this.actionRepo.findByPromotion(promotion.id);
      appliedPromotionIds.push(promotion.id);

      for (const action of actions) {
        if (!action.type || !action.preferences) continue;

        let prefs: ReturnType<typeof parseActionPreferences>;
        try {
          prefs = parseActionPreferences(action.type, action.preferences);
        } catch {
          continue; // skip misconfigured actions
        }

        if (isOrderLevelAction(action.type)) {
          const discount = -calculateOrderDiscount(
            action.type,
            prefs,
            input.itemTotal,
          );
          orderPromoTotal = parseFloat(
            (orderPromoTotal + discount).toFixed(2),
          );
        } else if (isLineLevelAction(action.type)) {
          const eligibleLines = input.lineItems.filter((li) =>
            matches.eligibleLineItemIds.has(li.lineItemId),
          );

          for (const li of eligibleLines) {
            const lineDiscount = -calculateLineDiscount(
              action.type,
              prefs,
              li.lineSubtotal,
            );
            const existing = lineAccumulator.get(li.lineItemId) ?? 0;
            lineAccumulator.set(
              li.lineItemId,
              parseFloat((existing + lineDiscount).toFixed(2)),
            );
          }
        }
      }
    }

    const lineAdjustments: LineAdjustment[] = [];
    let linePromoTotal = 0;
    for (const [lineItemId, promoTotal] of lineAccumulator.entries()) {
      if (promoTotal !== 0) {
        lineAdjustments.push({ lineItemId, promoTotal });
        linePromoTotal = parseFloat((linePromoTotal + promoTotal).toFixed(2));
      }
    }

    const adjustmentTotal = parseFloat(
      (orderPromoTotal + linePromoTotal).toFixed(2),
    );

    return {
      orderPromoTotal,
      lineAdjustments,
      adjustmentTotal,
      appliedPromotionIds,
    };
  }

  // ─── Rule matching ───────────────────────────────────────

  private async promotionMatchesInput(
    promotion: FullPromotion,
    rules: FullRule[],
    input: OrderCandidateInput,
  ): Promise<PromotionMatchResult> {
    const allLineIds = new Set(input.lineItems.map((li) => li.lineItemId));
    if (rules.length === 0) {
      return { matched: true, eligibleLineItemIds: allLineIds };
    }

    const policy = (promotion.match_policy ?? 'all') as MatchPolicy;
    const results = await Promise.all(
      rules.map((rule) => this.ruleMatches(rule, input)),
    );
    const matchedResults = results.filter((result) => result.matched);

    if (policy === MatchPolicy.ALL && matchedResults.length !== results.length) {
      return { matched: false, eligibleLineItemIds: new Set<string>() };
    }

    if (policy === MatchPolicy.ANY && matchedResults.length === 0) {
      return { matched: false, eligibleLineItemIds: new Set<string>() };
    }

    const lineScopedMatches = matchedResults.filter((result) => result.scopesLines);

    if (lineScopedMatches.length === 0) {
      return { matched: true, eligibleLineItemIds: allLineIds };
    }

    if (policy === MatchPolicy.ALL) {
      let eligibleLineIds = new Set(lineScopedMatches[0].lineItemIds);
      for (const result of lineScopedMatches.slice(1)) {
        eligibleLineIds = new Set(
          [...eligibleLineIds].filter((id) => result.lineItemIds.includes(id)),
        );
      }

      return { matched: true, eligibleLineItemIds: eligibleLineIds };
    }

    const eligibleLineIds = new Set<string>();
    for (const result of lineScopedMatches) {
      for (const lineItemId of result.lineItemIds) {
        eligibleLineIds.add(lineItemId);
      }
    }

    return { matched: true, eligibleLineItemIds: eligibleLineIds };
  }

  private async ruleMatches(
    rule: FullRule,
    input: OrderCandidateInput,
  ): Promise<RuleMatchResult> {
    const type = rule.type as PromotionRuleType | null;

    switch (type) {
      case PromotionRuleType.PRODUCT:
        return this.matchProductRule(rule, input);

      case PromotionRuleType.VARIANT:
        return this.matchVariantRule(rule, input);

      case PromotionRuleType.USER:
        return this.matchUserRule(rule, input);

      case PromotionRuleType.CODE:
        return this.matchCodeRule(rule, input);

      default:
        return { matched: false, scopesLines: false, lineItemIds: [] };
    }
  }

  private matchProductRule(
    rule: FullRule,
    input: OrderCandidateInput,
  ): RuleMatchResult {
    const ruleProductIds = new Set(
      rule.productPromotionRules.map((ppr) => ppr.product_id).filter(Boolean),
    );
    const matchingLineIds = input.lineItems
      .filter((li) => li.productId && ruleProductIds.has(li.productId))
      .map((li) => li.lineItemId);

    return {
      matched: matchingLineIds.length > 0,
      scopesLines: true,
      lineItemIds: matchingLineIds,
    };
  }

  private matchVariantRule(
    rule: FullRule,
    input: OrderCandidateInput,
  ): RuleMatchResult {
    if (!rule.preferences) {
      return { matched: false, scopesLines: true, lineItemIds: [] };
    }
    let parsed: { variant_ids?: string[] };
    try {
      parsed = JSON.parse(rule.preferences) as { variant_ids?: string[] };
    } catch {
      return { matched: false, scopesLines: true, lineItemIds: [] };
    }
    const ruleVariantIds = new Set(parsed.variant_ids ?? []);
    const matchingLineIds = input.lineItems
      .filter((li) => li.variantId && ruleVariantIds.has(li.variantId))
      .map((li) => li.lineItemId);

    return {
      matched: matchingLineIds.length > 0,
      scopesLines: true,
      lineItemIds: matchingLineIds,
    };
  }

  private matchUserRule(
    rule: FullRule,
    input: OrderCandidateInput,
  ): RuleMatchResult {
    if (!input.userId) {
      return { matched: false, scopesLines: false, lineItemIds: [] };
    }
    const allowedUsers = new Set(
      rule.promotionRuleUsers.map((pru) => pru.user_id).filter(Boolean),
    );
    return {
      matched: allowedUsers.size > 0 && allowedUsers.has(input.userId),
      scopesLines: false,
      lineItemIds: [],
    };
  }

  private matchCodeRule(
    rule: FullRule,
    input: OrderCandidateInput,
  ): RuleMatchResult {
    return {
      matched: this.codeService.isCodeMatch(rule.code ?? null, input.promoCode),
      scopesLines: false,
      lineItemIds: [],
    };
  }
}
