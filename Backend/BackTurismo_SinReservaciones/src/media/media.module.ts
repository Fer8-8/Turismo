import { Module } from '@nestjs/common';
import { MediaService } from './media.service';
import { MediaResolver } from './media.resolver';
import { HttpModule } from '@nestjs/axios';
import { PrismaService } from 'src/prisma/prisma.service';
import { StorageModule } from '../storage/storage.module';
import { MediaController } from './media.controller';

@Module({
  imports: [StorageModule, HttpModule],
  providers: [MediaResolver, MediaService, PrismaService],
  controllers: [MediaController]
})
export class MediaModule { }
