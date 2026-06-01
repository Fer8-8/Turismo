import { Module } from '@nestjs/common';
import { UserSessionService } from './user_session.service';
import { UserSessionResolver } from './user_session.resolver';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [UserSessionResolver, UserSessionService],
})
export class UserSessionModule {}
