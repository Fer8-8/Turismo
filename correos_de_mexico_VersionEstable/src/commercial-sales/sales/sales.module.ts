import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { CoreModule } from '../../core/core.module';
import { CatalogModule } from '../../catalog/catalog.module';
import { InventoryModule } from '../../inventory/inventory.module';
import { LocationModule } from '../../location/location.module';
// infraestructura
import { OrderRepository } from './infrastructure/repositories/order.repository';
import { LineItemRepository } from './infrastructure/repositories/line-item.repository';
// aplicación
import { OrderValidationService } from './application/order-validation.service';
import { OrderStateService } from './application/order-state.service';
import { LineItemService } from './application/line-item.service';
import { OrderPricingService } from './application/order-pricing.service';
import { OrderAddressService } from './application/order-address.service';
import { OrderService } from './application/order.service';
import {
  PROMOTION_GATEWAY,
} from '../contracts/promotion-evaluation.contract';
import { MarketingModule } from '../marketing/marketing.module';
import { MarketingPromotionGatewayAdapter } from '../marketing/facades/marketing-promotion-gateway.adapter';
// presentación
import { SalesResolver } from './presentation/graphql/sales.resolver';
// fachada
import { SalesFacade } from './facades/sales.facade';

@Module({
  imports: [PrismaModule, CoreModule, CatalogModule, InventoryModule, LocationModule, MarketingModule],
  providers: [
    // infraestructura
    OrderRepository,
    LineItemRepository,
    // aplicación
    OrderValidationService,
    OrderStateService,
    LineItemService,
    OrderPricingService,
    OrderAddressService,
    OrderService,
    {
      provide: PROMOTION_GATEWAY,
      useClass: MarketingPromotionGatewayAdapter,
    },
    // presentación
    SalesResolver,
    // fachada
    SalesFacade,
  ],
  exports: [SalesFacade],
})
export class SalesModule {}
