import { GatewayService } from './gateway.service';
import { GatewayCode } from '../domain/enums';
import { GatewayNotActiveException } from '../domain/exceptions';

describe('GatewayService', () => {
  describe('with STRIPE_SECRET_KEY configured', () => {
    let service: GatewayService;
    let originalKey: string | undefined;

    beforeEach(() => {
      originalKey = process.env.STRIPE_SECRET_KEY;
      process.env.STRIPE_SECRET_KEY = 'sk_test_123456';
      service = new GatewayService();
    });

    afterEach(() => {
      if (originalKey !== undefined) {
        process.env.STRIPE_SECRET_KEY = originalKey;
      } else {
        delete process.env.STRIPE_SECRET_KEY;
      }
    });

    it('listGateways returns at least the Stripe gateway', () => {
      const list = service.listGateways();
      expect(list.length).toBeGreaterThanOrEqual(1);
      expect(list.find((g) => g.code === GatewayCode.STRIPE)).toBeDefined();
    });

    it('isGatewayActive returns true for STRIPE when key is present', () => {
      expect(service.isGatewayActive(GatewayCode.STRIPE)).toBe(true);
    });

    it('getActiveGateway returns the Stripe config', () => {
      const gw = service.getActiveGateway();
      expect(gw.code).toBe(GatewayCode.STRIPE);
      expect(gw.active).toBe(true);
    });

    it('getGatewayConfig returns correct config for STRIPE', () => {
      const cfg = service.getGatewayConfig(GatewayCode.STRIPE);
      expect(cfg.code).toBe(GatewayCode.STRIPE);
      expect(cfg.label).toBe('Stripe');
    });

    it('getGatewayConfig throws GatewayNotActiveException for unknown gateway code', () => {
      expect(() => service.getGatewayConfig('paypal' as GatewayCode)).toThrow(GatewayNotActiveException);
    });

    it('isGatewayActive returns false for non-existent code', () => {
      expect(service.isGatewayActive('unknown_gateway' as GatewayCode)).toBe(false);
    });
  });

  describe('without STRIPE_SECRET_KEY', () => {
    let service: GatewayService;
    let originalKey: string | undefined;

    beforeEach(() => {
      originalKey = process.env.STRIPE_SECRET_KEY;
      delete process.env.STRIPE_SECRET_KEY;
      service = new GatewayService();
    });

    afterEach(() => {
      if (originalKey !== undefined) {
        process.env.STRIPE_SECRET_KEY = originalKey;
      }
    });

    it('isGatewayActive returns false for STRIPE', () => {
      expect(service.isGatewayActive(GatewayCode.STRIPE)).toBe(false);
    });

    it('getActiveGateway throws GatewayNotActiveException', () => {
      expect(() => service.getActiveGateway()).toThrow(GatewayNotActiveException);
    });

    it('listGateways still returns the gateway entry (inactive)', () => {
      const list = service.listGateways();
      const stripe = list.find((g) => g.code === GatewayCode.STRIPE);
      expect(stripe).toBeDefined();
      expect(stripe!.active).toBe(false);
    });
  });
});
