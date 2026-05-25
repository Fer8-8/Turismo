import { Injectable } from '@nestjs/common';
import { PromotionService } from '../application/promotion.service';
import { PromotionRuleService } from '../application/promotion-rule.service';
import { PromotionActionService } from '../application/promotion-action.service';
import { PromotionEvaluatorService, OrderCandidateInput } from '../application/promotion-evaluator.service';
import { PromotionCodeService } from '../application/promotion-code.service';
import { PromotionOrderLinkService } from '../application/promotion-order-link.service';
import { PromotionCategoryService } from '../application/promotion-category.service';
import type {
  CreatePromotionInput,
  UpdatePromotionInput,
  PromotionListFilter,
  CreatePromotionRuleInput,
  UpdatePromotionRuleInput,
  CreatePromotionActionInput,
  UpdatePromotionActionInput,
  CreatePromotionCategoryInput,
  UpdatePromotionCategoryInput,
  LinkPromotionToOrderInput,
} from '../application/contracts/marketing.facade.contracts';

// marketingfacade — única interfaz pública del dominio marketing.
// otros dominios deben usar solo esta facade.
@Injectable()
export class MarketingFacade {
  constructor(
    private readonly promotionService: PromotionService,
    private readonly ruleService: PromotionRuleService,
    private readonly actionService: PromotionActionService,
    private readonly evaluatorService: PromotionEvaluatorService,
    private readonly codeService: PromotionCodeService,
    private readonly orderLinkService: PromotionOrderLinkService,
    private readonly categoryService: PromotionCategoryService,
  ) {}

  // ─── crud de promoción ──────────────────────────────────────

  getPromotionById(id: string) {
    return this.promotionService.getById(id);
  }

  getPromotionByCode(code: string) {
    return this.promotionService.getByCode(code);
  }

  listPromotions(filter: PromotionListFilter = {}) {
    return this.promotionService.list(filter);
  }

  listActivePromotions(storeId?: string) {
    return this.promotionService.listActive(storeId);
  }

  listPromotionsByStore(storeId: string) {
    return this.promotionService.listByStore(storeId);
  }

  listPromotionsByCategory(categoryId: string) {
    return this.categoryService.listPromotions(categoryId);
  }

  createPromotion(data: CreatePromotionInput) {
    return this.promotionService.create(data);
  }

  updatePromotion(id: string, data: UpdatePromotionInput) {
    return this.promotionService.update(id, data);
  }

  activatePromotion(id: string) {
    return this.promotionService.activate(id);
  }

  deactivatePromotion(id: string) {
    return this.promotionService.deactivate(id);
  }

  assignPromotionToStore(promotionId: string, storeId: string) {
    return this.promotionService.assignToStore(promotionId, storeId);
  }

  removePromotionFromStore(promotionId: string, storeId: string) {
    return this.promotionService.removeFromStore(promotionId, storeId);
  }

  isPromotionEnabledForStore(promotionId: string, storeId: string) {
    return this.promotionService.isEnabledForStore(promotionId, storeId);
  }

  getPromotionUsageAvailability(promotionId: string) {
    return this.promotionService.getUsageAvailability(promotionId);
  }

  // ─── categorías ───────────────────────────────────────────

  listPromotionCategories() {
    return this.categoryService.list();
  }

  getPromotionCategoryById(id: string) {
    return this.categoryService.getById(id);
  }

  createPromotionCategory(data: CreatePromotionCategoryInput) {
    return this.categoryService.create(data);
  }

  updatePromotionCategory(id: string, data: UpdatePromotionCategoryInput) {
    return this.categoryService.update(id, data);
  }

  assignPromotionToCategory(promotionId: string, categoryId: string) {
    return this.categoryService.assignPromotion(promotionId, categoryId);
  }

  // ─── reglas ───────────────────────────────────────────────

  getPromotionRuleById(id: string) {
    return this.ruleService.getById(id);
  }

  listPromotionRules(promotionId: string) {
    return this.ruleService.listByPromotion(promotionId);
  }

  createPromotionRule(data: CreatePromotionRuleInput) {
    return this.ruleService.create(data);
  }

  updatePromotionRule(id: string, data: UpdatePromotionRuleInput) {
    return this.ruleService.update(id, data);
  }

  // ─── acciones ─────────────────────────────────────────────

  getPromotionActionById(id: string) {
    return this.actionService.getById(id);
  }

  listPromotionActions(promotionId: string) {
    return this.actionService.listByPromotion(promotionId);
  }

  createPromotionAction(data: CreatePromotionActionInput) {
    return this.actionService.create(data);
  }

  updatePromotionAction(id: string, data: UpdatePromotionActionInput) {
    return this.actionService.update(id, data);
  }

  // ─── evaluación ───────────────────────────────────────────

  evaluateOrderPromotions(input: OrderCandidateInput) {
    return this.evaluatorService.evaluate(input);
  }

  // ─── validación de código ─────────────────────────────────────

  validatePromoCode(code: string) {
    return this.codeService.check(code);
  }

  findUsablePromotion(code: string) {
    return this.codeService.findUsable(code);
  }

  // ─── enlaces de orden ───────────────────────────────────

  linkPromotionToOrder(data: LinkPromotionToOrderInput) {
    return this.orderLinkService.link(
      data,
      data.promo_total ?? 0,
    );
  }

  getAppliedPromotions(orderId: string) {
    return this.orderLinkService.getAppliedPromotions(orderId);
  }

  isPromotionLinkedToOrder(orderId: string, promotionId: string) {
    return this.orderLinkService.isLinked(orderId, promotionId);
  }
}
