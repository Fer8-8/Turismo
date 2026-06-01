import { Module } from '@nestjs/common';
import { UserfeaturescacheService } from './userfeaturescache.service';
import { UserfeaturescacheResolver } from './userfeaturescache.resolver';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  providers: [UserfeaturescacheResolver, UserfeaturescacheService],
  imports: [PrismaModule],
})
export class UserfeaturescacheModule {}
