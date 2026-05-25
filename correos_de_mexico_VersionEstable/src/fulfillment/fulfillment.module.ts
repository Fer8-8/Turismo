import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { CoreModule } from '../core/core.module';
import { LocationModule } from '../location/location.module';
import { InventoryModule } from '../inventory/inventory.module';
import { SalesModule } from '../commercial-sales/sales/sales.module';
import { PaymentsModule } from '../financial/payments/payments.module';
import { ShipmentRepository } from './infrastructure/repositories/shipment.repository';
import { ShippingMethodRepository } from './infrastructure/repositories/shipping-method.repository';
import { ShippingRateRepository } from './infrastructure/repositories/shipping-rate.repository';
import { ShippingCategoryRepository } from './infrastructure/repositories/shipping-category.repository';
import { ReturnAuthorizationRepository } from './infrastructure/repositories/return-authorization.repository';
import { ReturnReasonRepository } from './infrastructure/repositories/return-reason.repository';
import { ReturnItemRepository } from './infrastructure/repositories/return-item.repository';
import { CustomerReturnRepository } from './infrastructure/repositories/customer-return.repository';
import { ReimbursementRepository } from './infrastructure/repositories/reimbursement.repository';
import { ReimbursementTypeRepository } from './infrastructure/repositories/reimbursement-type.repository';
import { ReimbursementCreditRepository } from './infrastructure/repositories/reimbursement-credit.repository';
import { ShipmentService } from './application/shipment.service';
import { ShipmentStateService } from './application/shipment-state.service';
import { TrackingService } from './application/tracking.service';
import { ShippingMethodService } from './application/shipping-method.service';
import { ShippingRateService } from './application/shipping-rate.service';
import { ShippingCategoryService } from './application/shipping-category.service';
import { ReturnAuthorizationService } from './application/return-authorization.service';
import { ReturnReasonService } from './application/return-reason.service';
import { ReturnItemService } from './application/return-item.service';
import { CustomerReturnService } from './application/customer-return.service';
import { ReimbursementService } from './application/reimbursement.service';
import { ReimbursementTypeService } from './application/reimbursement-type.service';
import { ReimbursementCreditService } from './application/reimbursement-credit.service';
import { FulfillmentResolver } from './presentation/graphql/fulfillment.resolver';
import { FulfillmentFacade } from './facades/fulfillment.facade';

@Module({
  imports: [PrismaModule, CoreModule, LocationModule, InventoryModule, SalesModule, PaymentsModule],
  providers: [
    ShipmentRepository,
    ShippingMethodRepository,
    ShippingRateRepository,
    ShippingCategoryRepository,
    ReturnAuthorizationRepository,
    ReturnReasonRepository,
    ReturnItemRepository,
    CustomerReturnRepository,
    ReimbursementRepository,
    ReimbursementTypeRepository,
    ReimbursementCreditRepository,
    ShipmentService,
    ShipmentStateService,
    TrackingService,
    ShippingMethodService,
    ShippingRateService,
    ShippingCategoryService,
    ReturnAuthorizationService,
    ReturnReasonService,
    ReturnItemService,
    CustomerReturnService,
    ReimbursementService,
    ReimbursementTypeService,
    ReimbursementCreditService,
    FulfillmentResolver,
    FulfillmentFacade,
  ],
  exports: [FulfillmentFacade],
})
export class FulfillmentModule {}