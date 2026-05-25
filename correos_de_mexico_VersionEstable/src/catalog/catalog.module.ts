import { Module } from '@nestjs/common';
import { ProductModule } from './product/product.module';
import { CatalogSubModule } from './catalog/catalog.module';
import { AssetModule } from './asset/asset.module';
import { PrismaModule } from '../prisma/prisma.module';

/**
 * catalog domain
 * agrupa: product, catalog, asset
 */
@Module({
  imports: [
    PrismaModule,
    ProductModule,
    CatalogSubModule,
    AssetModule,
  ],
  exports: [
    ProductModule,
    CatalogSubModule,
    AssetModule,
  ],
})
export class CatalogModule {}
