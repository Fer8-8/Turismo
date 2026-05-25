import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { MarketingFacade } from '../../facades/marketing.facade';
import {
  PromotionType,
  PromotionCategoryType,
  PromotionUsageAvailabilityType,
  PromotionRuleType,
  PromotionActionType,
  PromotionEvaluationResultType,
  PromoCodeValidationType,
  OrderPromotionLinkType,
} from './types';
import {
  CreatePromotionInput,
  UpdatePromotionInput,
  PromotionFilterInput,
  CreatePromotionCategoryInput,
  UpdatePromotionCategoryInput,
  AssignPromotionCategoryInput,
  CreatePromotionRuleInput,
  UpdatePromotionRuleInput,
  CreatePromotionActionInput,
  UpdatePromotionActionInput,
  ValidatePromoCodeInput,
  EvaluateOrderPromotionsInput,
  AssignPromotionStoreInput,
  LinkPromotionOrderInput,
} from './dto';

@Resolver()
export class MarketingResolver {
  constructor(private readonly marketingFacade: MarketingFacade) {}

  // ─── consultas de promoción ────────────────────────────────

  @Query(() => PromotionType, { name: 'promotion' })
  async getPromotion(@Args('id', { type: () => ID }) id: string): Promise<PromotionType> {
    return this.marketingFacade.getPromotionById(id) as any;
  }

  @Query(() => PromotionType, { name: 'promotionByCode' })
  async getPromotionByCode(@Args('code') code: string): Promise<PromotionType> {
    return this.marketingFacade.getPromotionByCode(code) as any;
  }

  @Query(() => [PromotionType], { name: 'promotions' })
  async listPromotions(@Args('filter', { nullable: true }) filter?: PromotionFilterInput): Promise<PromotionType[]> {
    const parsedFilter = filter ? {
      ...filter,
      since: filter.since ? new Date(filter.since) : undefined,
      until: filter.until ? new Date(filter.until) : undefined,
    } : {};
    return this.marketingFacade.listPromotions(parsedFilter) as any;
  }

  @Query(() => [PromotionType], { name: 'activePromotions' })
  async listActivePromotions(
    @Args('storeId', { type: () => ID, nullable: true }) storeId?: string,
  ): Promise<PromotionType[]> {
    return this.marketingFacade.listActivePromotions(storeId) as any;
  }

  @Query(() => [PromotionType], { name: 'promotionsByStore' })
  async listPromotionsByStore(@Args('storeId', { type: () => ID }) storeId: string): Promise<PromotionType[]> {
    return this.marketingFacade.listPromotionsByStore(storeId) as any;
  }

  @Query(() => [PromotionType], { name: 'promotionsByCategory' })
  async listPromotionsByCategory(
    @Args('categoryId', { type: () => ID }) categoryId: string,
  ): Promise<PromotionType[]> {
    return this.marketingFacade.listPromotionsByCategory(categoryId) as any;
  }

  @Query(() => [PromotionCategoryType], { name: 'promotionCategories' })
  async listPromotionCategories(): Promise<PromotionCategoryType[]> {
    return this.marketingFacade.listPromotionCategories() as any;
  }

  @Query(() => PromotionCategoryType, { name: 'promotionCategory' })
  async getPromotionCategory(@Args('id', { type: () => ID }) id: string): Promise<PromotionCategoryType> {
    return this.marketingFacade.getPromotionCategoryById(id) as any;
  }

  @Query(() => PromotionUsageAvailabilityType, { name: 'promotionUsageAvailability' })
  async getPromotionUsageAvailability(
    @Args('promotionId', { type: () => ID }) promotionId: string,
  ): Promise<PromotionUsageAvailabilityType> {
    return this.marketingFacade.getPromotionUsageAvailability(promotionId) as any;
  }

  // ─── consultas de regla y acción ───────────────────────────

  @Query(() => [PromotionRuleType], { name: 'promotionRules' })
  async listPromotionRules(@Args('promotionId', { type: () => ID }) promotionId: string): Promise<PromotionRuleType[]> {
    return this.marketingFacade.listPromotionRules(promotionId) as any;
  }

  @Query(() => PromotionRuleType, { name: 'promotionRule' })
  async getPromotionRule(@Args('id', { type: () => ID }) id: string): Promise<PromotionRuleType> {
    return this.marketingFacade.getPromotionRuleById(id) as any;
  }

  @Query(() => [PromotionActionType], { name: 'promotionActions' })
  async listPromotionActions(@Args('promotionId', { type: () => ID }) promotionId: string): Promise<PromotionActionType[]> {
    return this.marketingFacade.listPromotionActions(promotionId) as any;
  }

  @Query(() => PromotionActionType, { name: 'promotionAction' })
  async getPromotionAction(@Args('id', { type: () => ID }) id: string): Promise<PromotionActionType> {
    return this.marketingFacade.getPromotionActionById(id) as any;
  }

  @Query(() => [OrderPromotionLinkType], { name: 'orderAppliedPromotions' })
  async getOrderAppliedPromotions(@Args('orderId', { type: () => ID }) orderId: string): Promise<OrderPromotionLinkType[]> {
    return this.marketingFacade.getAppliedPromotions(orderId) as any;
  }

  // ─── mutaciones de promoción ──────────────────────────────

  @Mutation(() => PromotionType, { name: 'createPromotion' })
  async createPromotion(@Args('input') input: CreatePromotionInput): Promise<PromotionType> {
    return this.marketingFacade.createPromotion({
      ...input, // Pasamos todo sin desglosar
      starts_at: input.starts_at ? new Date(input.starts_at) : undefined, // Convertimos la fecha
      expires_at: input.expires_at ? new Date(input.expires_at) : undefined, // Convertimos la fecha
    }) as any;
  }

  @Mutation(() => PromotionType, { name: 'updatePromotion' })
  async updatePromotion(
    @Args('input') input: UpdatePromotionInput,
  ): Promise<PromotionType> {
    return this.marketingFacade.updatePromotion(input.id, {
      ...input,
      starts_at: input.starts_at ? new Date(input.starts_at) : undefined,
      expires_at: input.expires_at ? new Date(input.expires_at) : undefined,
    }) as any;
  }

  @Mutation(() => PromotionCategoryType, { name: 'createPromotionCategory' })
  async createPromotionCategory(@Args('input') input: CreatePromotionCategoryInput): Promise<PromotionCategoryType> {
    return this.marketingFacade.createPromotionCategory(input) as any;
  }

  @Mutation(() => PromotionCategoryType, { name: 'updatePromotionCategory' })
  async updatePromotionCategory(
    @Args('input') input: UpdatePromotionCategoryInput,
  ): Promise<PromotionCategoryType> {
    return this.marketingFacade.updatePromotionCategory(input.id, input) as any;
  }

  @Mutation(() => PromotionType, { name: 'assignPromotionToCategory' })
  async assignPromotionToCategory(@Args('input') input: AssignPromotionCategoryInput): Promise<PromotionType> {
    return this.marketingFacade.assignPromotionToCategory(input.promotionId, input.categoryId) as any;
  }

  @Mutation(() => PromotionType, { name: 'activatePromotion' })
  async activatePromotion(@Args('id', { type: () => ID }) id: string): Promise<PromotionType> {
    return this.marketingFacade.activatePromotion(id) as any;
  }

  @Mutation(() => PromotionType, { name: 'deactivatePromotion' })
  async deactivatePromotion(@Args('id', { type: () => ID }) id: string): Promise<PromotionType> {
    return this.marketingFacade.deactivatePromotion(id) as any;
  }

  @Mutation(() => PromotionType, { name: 'assignPromotionToStore' })
  async assignPromotionToStore(@Args('input') input: AssignPromotionStoreInput): Promise<PromotionType> {
    return this.marketingFacade.assignPromotionToStore(input.promotionId, input.storeId) as any;
  }

  @Mutation(() => PromotionType, { name: 'removePromotionFromStore' })
  async removePromotionFromStore(@Args('input') input: AssignPromotionStoreInput): Promise<PromotionType> {
    return this.marketingFacade.removePromotionFromStore(input.promotionId, input.storeId) as any;
  }

  // ─── mutaciones de regla y acción ─────────────────────────

  @Mutation(() => PromotionRuleType, { name: 'createPromotionRule' })
  async createPromotionRule(@Args('input') input: CreatePromotionRuleInput): Promise<PromotionRuleType> {
    return this.marketingFacade.createPromotionRule({
      promotion_id: input.promotionId,
      type: input.type,
      code: input.code ?? null,
      preferences: input.preferences ?? null,
      product_ids: input.product_ids,
      user_ids: input.user_ids,
    }) as any;
  }

  @Mutation(() => PromotionRuleType, { name: 'updatePromotionRule' })
  async updatePromotionRule(
    @Args('input') input: UpdatePromotionRuleInput,
  ): Promise<PromotionRuleType> {
    return this.marketingFacade.updatePromotionRule(input.id, input as any) as any;
  }

  @Mutation(() => PromotionActionType, { name: 'createPromotionAction' })
  async createPromotionAction(@Args('input') input: CreatePromotionActionInput): Promise<PromotionActionType> {
    return this.marketingFacade.createPromotionAction({
      promotion_id: input.promotionId,
      type: input.type,
      preferences: input.preferences,
      position: input.position,
    }) as any;
  }

  @Mutation(() => PromotionActionType, { name: 'updatePromotionAction' })
  async updatePromotionAction(
    @Args('input') input: UpdatePromotionActionInput,
  ): Promise<PromotionActionType> {
    return this.marketingFacade.updatePromotionAction(input.id, input as any) as any;
  }

  // ─── evaluación y código ────────────────────────────────

  @Mutation(() => PromoCodeValidationType, { name: 'validatePromoCode' })
  async validatePromoCode(@Args('input') input: ValidatePromoCodeInput): Promise<PromoCodeValidationType> {
    return this.marketingFacade.validatePromoCode(input.code) as any;
  }

  @Mutation(() => PromotionEvaluationResultType, { name: 'evaluateOrderPromotions' })
  async evaluateOrderPromotions(@Args('input') input: EvaluateOrderPromotionsInput): Promise<PromotionEvaluationResultType> {
    return this.marketingFacade.evaluateOrderPromotions({
      orderId: input.orderId,
      userId: input.userId ?? null,
      storeId: input.storeId ?? null,
      currency: input.currency ?? null,
      itemTotal: input.itemTotal,
      promoCode: input.promoCode,
      lineItems: input.lineItems.map((li) => ({
        lineItemId: li.lineItemId,
        variantId: li.variantId ?? null,
        productId: li.productId ?? null,
        quantity: li.quantity,
        unitPrice: li.unitPrice,
        lineSubtotal: li.lineSubtotal,
      })),
    }) as any;
  }

  @Mutation(() => OrderPromotionLinkType, { name: 'linkPromotionToOrder' })
  async linkPromotionToOrder(@Args('input') input: LinkPromotionOrderInput): Promise<OrderPromotionLinkType> {
    return this.marketingFacade.linkPromotionToOrder({
      order_id: input.orderId,
      promotion_id: input.promotionId,
      promo_total: input.promoTotal,
      reason: input.reason ?? null,
      evaluation_snapshot: input.evaluationSnapshot ?? null,
    }) as any;
  }
}