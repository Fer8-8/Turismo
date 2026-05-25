import { Injectable } from '@nestjs/common';
import { GatewayCode } from '../domain/enums';
import { GatewayNotActiveException } from '../domain/exceptions';

export interface GatewayConfig {
  code: GatewayCode;
  active: boolean;
  label: string;
}

// servicio mínimo de configuración de gateway.
// para ola 1 se usa configuración in-memory basada en env vars.
// en olas siguientes se puede migrar a tabla de bd.
@Injectable()
export class GatewayService {
  private readonly gateways: GatewayConfig[] = [
    {
      code: GatewayCode.STRIPE,
      active: !!process.env.STRIPE_SECRET_KEY,
      label: 'Stripe',
    },
  ];

  getGatewayConfig(code: GatewayCode): GatewayConfig {
    const config = this.gateways.find((g) => g.code === code);
    if (!config) throw new GatewayNotActiveException(code);
    return config;
  }

  getActiveGateway(): GatewayConfig {
    const active = this.gateways.find((g) => g.active);
    if (!active) throw new GatewayNotActiveException('none');
    return active;
  }

  isGatewayActive(code: GatewayCode): boolean {
    return this.gateways.some((g) => g.code === code && g.active);
  }

  listGateways(): GatewayConfig[] {
    return this.gateways;
  }
}
