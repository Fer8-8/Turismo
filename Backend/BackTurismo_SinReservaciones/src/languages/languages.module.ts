import { Module } from '@nestjs/common';
import { LanguagesService } from './languages.service';
import { LanguagesResolver } from './languages.resolver';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  providers: [LanguagesResolver, LanguagesService],
  imports: [PrismaModule]
})
export class LanguagesModule {}
