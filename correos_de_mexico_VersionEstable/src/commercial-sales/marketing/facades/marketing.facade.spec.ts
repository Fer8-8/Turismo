import { MarketingFacade } from './marketing.facade';

const makePromotionService = () => ({
  getById: jest.fn(),
  getByCode: jest.fn(),
  list: jest.fn(),
  listActive: jest.fn(),
  listByStore: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  activate: jest.fn(),
  deactivate: jest.fn(),
  assignToStore: jest.fn(),
  removeFromStore: jest.fn(),
  isEnabledForStore: jest.fn(),
  getUsageAvailability: jest.fn(),
});

const makeRuleService = () => ({
  getById: jest.fn(),
  listByPromotion: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
});

const makeActionService = () => ({
  getById: jest.fn(),
  listByPromotion: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
});

const makeEvaluatorService = () => ({
  evaluate: jest.fn(),
  findActiveGlobal: jest.fn(),
});

const makeCodeService = () => ({
  check: jest.fn(),
  validate: jest.fn(),
  findUsable: jest.fn(),
  isCodeMatch: jest.fn(),
  exists: jest.fn(),
});

const makeOrderLinkService = () => ({
  link: jest.fn(),
  getAppliedPromotions: jest.fn(),
  isLinked: jest.fn(),
});

const makeCategoryService = () => ({
  list: jest.fn(),
  getById: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  assignPromotion: jest.fn(),
  listPromotions: jest.fn(),
});

const makeFacade = () => {
  const promotionService = makePromotionService();
  const ruleService = makeRuleService();
  const actionService = makeActionService();
  const evaluatorService = makeEvaluatorService();
  const codeService = makeCodeService();
  const orderLinkService = makeOrderLinkService();
  const categoryService = makeCategoryService();
  const facade = new MarketingFacade(
    promotionService as any,
    ruleService as any,
    actionService as any,
    evaluatorService as any,
    codeService as any,
    orderLinkService as any,
    categoryService as any,
  );
  return {
    facade,
    promotionService,
    ruleService,
    actionService,
    evaluatorService,
    codeService,
    orderLinkService,
    categoryService,
  };
};

describe('MarketingFacade', () => {
  describe('createPromotion', () => {
    it('delegates to promotionService.create', async () => {
      const { facade, promotionService } = makeFacade();
      const input = { name: 'Save10', code: 'SAVE10', active: true };
      const promo = { id: 'promo-1' };
      promotionService.create.mockResolvedValue(promo);

      const result = await facade.createPromotion(input as any);

      expect(promotionService.create).toHaveBeenCalledWith(input);
      expect(result).toBe(promo);
    });
  });

  describe('activatePromotion', () => {
    it('delegates to promotionService.activate', async () => {
      const { facade, promotionService } = makeFacade();
      promotionService.activate.mockResolvedValue({ id: 'promo-1', active: true });

      await facade.activatePromotion('promo-1');

      expect(promotionService.activate).toHaveBeenCalledWith('promo-1');
    });
  });

  describe('deactivatePromotion', () => {
    it('delegates to promotionService.deactivate', async () => {
      const { facade, promotionService } = makeFacade();
      promotionService.deactivate.mockResolvedValue({ id: 'promo-1', active: false });

      await facade.deactivatePromotion('promo-1');

      expect(promotionService.deactivate).toHaveBeenCalledWith('promo-1');
    });
  });

  describe('assignPromotionToStore', () => {
    it('delegates to promotionService.assignToStore', async () => {
      const { facade, promotionService } = makeFacade();
      promotionService.assignToStore.mockResolvedValue(undefined);

      await facade.assignPromotionToStore('promo-1', 'store-1');

      expect(promotionService.assignToStore).toHaveBeenCalledWith('promo-1', 'store-1');
    });
  });

  describe('evaluateOrderPromotions', () => {
    it('delegates to evaluatorService.evaluate with the candidate input', async () => {
      const { facade, evaluatorService } = makeFacade();
      const input = {
        orderId: 'ord-1',
        userId: 'u-1',
        storeId: 's-1',
        itemTotal: 300,
        lineItems: [{ variantId: 'var-1', productId: 'prod-1', quantity: 3, lineSubtotal: 300 }],
      };
      const promoResult = { orderPromoTotal: -30, linePromoTotal: 0, lineAdjustments: [] };
      evaluatorService.evaluate.mockResolvedValue(promoResult);

      const result = await facade.evaluateOrderPromotions(input as any);

      expect(evaluatorService.evaluate).toHaveBeenCalledWith(input);
      expect(result).toBe(promoResult);
    });
  });

  describe('validatePromoCode', () => {
    it('delegates to codeService.check', async () => {
      const { facade, codeService } = makeFacade();
      codeService.check.mockResolvedValue({ valid: true, reason: null });

      const result = await facade.validatePromoCode('SAVE10');

      expect(codeService.check).toHaveBeenCalledWith('SAVE10');
      expect(result).toEqual({ valid: true, reason: null });
    });
  });

  describe('findUsablePromotion', () => {
    it('delegates to codeService.findUsable', async () => {
      const { facade, codeService } = makeFacade();
      const promo = { id: 'promo-1', code: 'SAVE10' };
      codeService.findUsable.mockResolvedValue(promo);

      const result = await facade.findUsablePromotion('SAVE10');

      expect(codeService.findUsable).toHaveBeenCalledWith('SAVE10');
      expect(result).toBe(promo);
    });
  });

  describe('linkPromotionToOrder', () => {
    it('delegates to orderLinkService.link with promo_total', async () => {
      const { facade, orderLinkService } = makeFacade();
      const input = { orderId: 'ord-1', promotionId: 'promo-1', promo_total: -50 };
      orderLinkService.link.mockResolvedValue(undefined);

      await facade.linkPromotionToOrder(input as any);

      expect(orderLinkService.link).toHaveBeenCalledWith(input, -50);
    });

    it('uses 0 as promo_total when not provided', async () => {
      const { facade, orderLinkService } = makeFacade();
      const input = { orderId: 'ord-1', promotionId: 'promo-1' };
      orderLinkService.link.mockResolvedValue(undefined);

      await facade.linkPromotionToOrder(input as any);

      expect(orderLinkService.link).toHaveBeenCalledWith(input, 0);
    });
  });

  describe('getAppliedPromotions', () => {
    it('delegates to orderLinkService.getAppliedPromotions', async () => {
      const { facade, orderLinkService } = makeFacade();
      const links = [{ promotionId: 'promo-1' }];
      orderLinkService.getAppliedPromotions.mockResolvedValue(links);

      const result = await facade.getAppliedPromotions('ord-1');

      expect(orderLinkService.getAppliedPromotions).toHaveBeenCalledWith('ord-1');
      expect(result).toBe(links);
    });
  });

  describe('boundary: forbidden methods', () => {
    it('does not expose createOrder', () => {
      const { facade } = makeFacade();
      expect((facade as any).createOrder).toBeUndefined();
    });

    it('does not expose cancelOrder', () => {
      const { facade } = makeFacade();
      expect((facade as any).cancelOrder).toBeUndefined();
    });

    it('does not expose markOrderPending', () => {
      const { facade } = makeFacade();
      expect((facade as any).markOrderPending).toBeUndefined();
    });

    it('does not expose addLineItem', () => {
      const { facade } = makeFacade();
      expect((facade as any).addLineItem).toBeUndefined();
    });

    it('does not expose getPaymentContext', () => {
      const { facade } = makeFacade();
      expect((facade as any).getPaymentContext).toBeUndefined();
    });

    it('does not expose getFulfillmentContext', () => {
      const { facade } = makeFacade();
      expect((facade as any).getFulfillmentContext).toBeUndefined();
    });
  });
});
