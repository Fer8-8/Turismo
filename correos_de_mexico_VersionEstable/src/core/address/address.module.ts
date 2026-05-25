import { Module } from '@nestjs/common';
import { AddressService } from './address.service';
import { AddressResolver } from './address.resolver';
import { AddressFacade } from './facades/address.facade';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [AddressService, AddressResolver, AddressFacade],
  exports: [AddressService, AddressFacade],
})
export class AddressModule {}
