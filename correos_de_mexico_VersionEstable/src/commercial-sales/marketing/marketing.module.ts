import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { CoreModule } from '../../core/core.module';
import { CatalogModule } from '../../catalog/catalog.module';
// infraestructura
import { PromotionRepository } from './infrastructure/repositories/promotion.repository';
import { PromotionRuleRepository } from './infrastructure/repositories/promotion-rule.repository';
import { PromotionActionRepository } from './infrastructure/repositories/promotion-action.repository';
import { PromotionOrderRepository } from './infrastructure/repositories/promotion-order.repository';
import { PromotionCategoryRepository } from './infrastructure/repositories/promotion-category.repository';
// aplicación
import { PromotionService } from './application/promotion.service';
import { PromotionRuleService } from './application/promotion-rule.service';
import { PromotionActionService } from './application/promotion-action.service';
import { PromotionEvaluatorService } from './application/promotion-evaluator.service';
import { PromotionCodeService } from './application/promotion-code.service';
import { PromotionOrderLinkService } from './application/promotion-order-link.service';
import { PromotionCategoryService } from './application/promotion-category.service';
// presentación
import { MarketingResolver } from './presentation/graphql/marketing.resolver';
// fachadas
import { MarketingFacade } from './facades/marketing.facade';
import { MarketingPromotionGatewayAdapter } from './facades/marketing-promotion-gateway.adapter';

@Module({
  imports: [PrismaModule, CoreModule, CatalogModule],
  providers: [
    // infraestructura
    PromotionRepository,
    PromotionRuleRepository,
    PromotionActionRepository,
    PromotionOrderRepository,
    PromotionCategoryRepository,
    // aplicación
    PromotionService,
    PromotionRuleService,
    PromotionActionService,
    PromotionEvaluatorService,
    PromotionCodeService,
    PromotionOrderLinkService,
    PromotionCategoryService,
    // presentación
    MarketingResolver,
    // fachada y adaptador
    MarketingFacade,
    MarketingPromotionGatewayAdapter,
  ],
  exports: [MarketingFacade, MarketingPromotionGatewayAdapter],
})
export class MarketingModule {}
