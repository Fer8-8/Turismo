import { Module } from '@nestjs/common';
import { AssetService } from './asset.service';
import { SlugService } from './slug.service';
import { AssetResolver } from './asset.resolver';
import { AssetFacade } from './facades/asset.facade';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [AssetService, SlugService, AssetResolver, AssetFacade],
  exports: [AssetFacade],
})
export class AssetModule {}
