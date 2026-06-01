import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Role } from '@prisma/client';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // Si no hay roles requeridos, se permite el acceso
    if (!requiredRoles) {
      return true;
    }

    const ctx = GqlExecutionContext.create(context);
    const { user } = ctx.getContext().req;

    if (!user) {
      return false;
    }

    // Super admin tiene acceso a todo
    if (user.role === Role.admin) {
      return true;
    }

    // Verificar si el usuario tiene uno de los roles requeridos
    const hasRole = requiredRoles.some((role) => user.role === role);
    if (!hasRole) {
      throw new ForbiddenException('No tienes permisos suficientes para realizar esta acción');
    }

    // Lógica específica para adminState
    if (user.role === Role.adminState) {
      const args = ctx.getArgs();
      
      // Si la operación involucra un estado específico, verificar que sea el que tiene asignado
      const stateId = args.stateId ||
      args.id_state ||
      (args.updateStateInput && args.updateStateInput.id) ||
      (args.createStateInput && args.createStateInput.id) ||
      args.createPlaceInput?.state_id;
      
      if (stateId && stateId !== user.managedStateId) {
        throw new ForbiddenException('Solo puedes administrar la información de tu estado asignado');
      }
      
      // Para mutations que no incluyen explícitamente el stateId en los argumentos (como crear un lugar),
      // se debería validar en el servicio o pasar el stateId del usuario automáticamente.
    }
    /*
    if (user.role === Role.userOwner) {
      const args = ctx.getArgs();
      
      // Si la operación involucra un estado específico, verificar que sea el que tiene asignado
      const placeId = args.placeId || args.id_place || (args.updatePlaceInput && args.updatePlaceInput.id) || (args.createPlaceInput && args.createPlaceInput.id);
      
      if (placeId && placeId !== user.managedPlaceId) {
        throw new ForbiddenException('Solo puedes administrar la información de tu lugar asignado');
      }
    }
    */

    // Lógica para usuario común (lectura)
    if (user.role === Role.user) {
      const info = ctx.getInfo();
      const allowedMutations = ['createPlaceRequest', 'updatePlaceRequest'];
      
      if (info.operation.operation === 'mutation' && !allowedMutations.includes(info.fieldName)) {
        throw new ForbiddenException('Los usuarios solo tienen permisos de lectura');
      }
    }

    return true;
  }
}
