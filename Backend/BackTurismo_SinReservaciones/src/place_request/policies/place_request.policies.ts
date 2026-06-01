import { User } from 'src/users/entities/user.entity';
import { Role } from '@prisma/client';
import { request_status } from '../enums/status.enum';
import { NotFoundException, BadRequestException } from '@nestjs/common';

export class PlaceRequestPolicies {
  /**
   * Verifica si el usuario actual tiene permiso de ver/acceder a un PlaceRequest específico
   */
  static checkCanView(user: User, request: { id_user: string, place_json: any }) {
    // Los usuarios normales y partners solo pueden ver sus propias peticiones
    if ((user.role === Role.partner || user.role === Role.user) && request.id_user !== user.id) {
      throw new NotFoundException("Place request no encontrada");
    }

    // Los adminState solo pueden ver peticiones que correspondan a su Estado
    if (user.role === Role.adminState) {
      const state_id = request.place_json?.state_id;

      if (state_id !== user.managedStateId) {
        throw new NotFoundException("Place request no encontrada");
      }
    }
  }

  /**
   * Verifica si el usuario actual tiene permisos suficientes para intentar modificar el 'status'
   */
  static checkCanUpdateStatus(user: User, newStatus?: request_status) {
    if ((user.role === Role.partner || user.role === Role.user) && newStatus && newStatus !== request_status.pending) {
      throw new BadRequestException("No tienes permisos para aprobar o rechazar solicitudes");
    }
  }

  /**
   * Verifica si la petición original aún permite ser editada
   */
  static checkIsModifiable(currentStatus: request_status) {
    if (currentStatus !== request_status.pending) {
      throw new BadRequestException("Solo se pueden modificar solicitudes pendientes");
    }
  }
}
