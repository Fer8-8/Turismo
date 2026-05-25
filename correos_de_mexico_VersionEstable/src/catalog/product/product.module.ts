import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { VariantService } from './variant.service';
import { PriceService } from './price.service';
import { ProductResolver } from './product.resolver';
import { ProductFacade } from './facades/product.facade';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [
    ProductService,
    VariantService,
    PriceService,
    ProductResolver,
    ProductFacade,
  ],
  exports: [ProductFacade],
})
export class ProductModule {}
