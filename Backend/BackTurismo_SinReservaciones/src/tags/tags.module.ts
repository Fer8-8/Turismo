import { Module } from '@nestjs/common';
import { TagsService } from './tags.service';
import { TagsResolver } from './tags.resolver';
import { PrismaModule } from 'src/prisma/prisma.module';
@Module({
  providers: [TagsResolver, TagsService],
  imports: [PrismaModule],
})
export class TagsModule {}
