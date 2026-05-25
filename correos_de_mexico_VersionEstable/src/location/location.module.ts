import { Module } from '@nestjs/common';
import { GeographyModule } from './geography/geography.module';
import { TaxModule } from './tax/tax.module';

@Module({
  imports: [GeographyModule, TaxModule],
  exports: [GeographyModule, TaxModule],
})
export class LocationModule {}
