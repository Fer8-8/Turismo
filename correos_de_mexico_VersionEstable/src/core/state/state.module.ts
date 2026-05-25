import { Module } from '@nestjs/common';
import { StateService } from './state.service';
import { StateFacade } from './facades/state.facade';
import { PrismaModule } from '../../prisma/prisma.module';

// StateResolver fue migrado a GeographyModule (src/location/geography)
// para centralizar toda la geografía en el dominio Location.
@Module({
  imports: [PrismaModule],
  providers: [StateService, StateFacade],
  exports: [StateService, StateFacade],
})
export class StateModule {}
