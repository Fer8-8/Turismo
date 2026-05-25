import { Module } from '@nestjs/common';
import { SharedModule } from './shared/shared.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { AddressModule } from './address/address.module';
import { StateModule } from './state/state.module';
import { StoreModule } from './store/store.module';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [
    PrismaModule,
    SharedModule,
    AuthModule,
    UserModule,
    AddressModule,
    StateModule,
    StoreModule,
  ],
  exports: [
    SharedModule,
    AuthModule,
    UserModule,
    AddressModule,
    StateModule,
    StoreModule,
  ],
})
export class CoreModule {}
