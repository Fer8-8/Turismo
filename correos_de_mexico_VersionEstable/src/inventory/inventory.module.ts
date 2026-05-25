import { Module } from '@nestjs/common';
import { InventoryResolver } from './presentation/inventory.resolver';
import { InventoryFacade } from './inventory.facade';
import { InventoryReservationAppService } from './application/inventory-reservation.app-service';
import { InventoryMovementAppService } from './application/inventory-movement.app-service';
import { InventoryLookupAppService } from './application/inventory-lookup.app-service';
import { InventoryRepository } from './infrastructure/inventory.repository';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [
    PrismaService, // Motor de base de datos
    InventoryRepository, // Capa de Infraestructura
    InventoryReservationAppService, // Capa de Aplicación
    InventoryMovementAppService, // Capa de Aplicación
    InventoryLookupAppService, // Capa de Aplicación
    InventoryFacade, // Puerta de entrada pública
    InventoryResolver, // Capa de Presentación (GraphQL Resolver)
  ],
  exports: [
    InventoryFacade // Exportamos el Facade para que otros módulos puedan usarlo
  ]
})
export class InventoryModule {}