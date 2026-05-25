import { Module } from '@nestjs/common';
import { TaxonomyService } from './taxonomy.service';
import { TaxonService } from './taxon.service';
import { PropertyService } from './property.service';
import { PrototypeService } from './prototype.service';
import { CatalogResolver } from './catalog.resolver';
import { CatalogFacade } from './facades/catalog.facade';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [
    TaxonomyService,
    TaxonService,
    PropertyService,
    PrototypeService,
    CatalogResolver,
    CatalogFacade,
  ],
  exports: [CatalogFacade],
})
export class CatalogSubModule {}
