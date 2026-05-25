import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { TaxCategoryService } from './tax-category.service';
import { TaxRateService } from './tax-rate.service';
import { ZoneService } from './zone.service';
import { TaxCalculationService } from './tax-calculation.service';
import { TaxResolver } from './tax.resolver';
import { TaxFacade } from './facades/tax.facade';

@Module({
  imports: [PrismaModule],
  providers: [
    TaxCategoryService,
    TaxRateService,
    ZoneService,
    TaxCalculationService,
    TaxResolver,
    TaxFacade,
  ],
  exports: [TaxFacade],
})
export class TaxModule {}
