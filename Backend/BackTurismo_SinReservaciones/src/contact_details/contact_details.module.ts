import { Module } from '@nestjs/common';
import { ContactDetailsResolver } from './contact_details.resolver';
import { ContactDetailsService } from './contact_details.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [ContactDetailsResolver, ContactDetailsService]
})
export class ContactDetailsModule {}
