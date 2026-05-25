import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { UserFacade } from './facades/user.facade';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [UserService, UserResolver, UserFacade],
  exports: [UserService, UserFacade],
})
export class UserModule {}
