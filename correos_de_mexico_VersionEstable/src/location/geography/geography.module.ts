import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { CountryService } from './country.service';
import { GeoStateService } from './state.service';
import { GeographyResolver } from './geography.resolver';
import { GeographyFacade } from './facades/geography.facade';

@Module({
  imports: [PrismaModule],
  providers: [CountryService, GeoStateService, GeographyResolver, GeographyFacade],
  exports: [GeographyFacade],
})
export class GeographyModule {}
