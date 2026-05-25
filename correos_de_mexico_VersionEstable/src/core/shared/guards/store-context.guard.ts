import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Reflector } from '@nestjs/core';
import { PrismaService } from '../../../prisma/prisma.service';
import { SKIP_STORE_CONTEXT_KEY } from '../decorators/skip-store-context.decorator';
import { MissingStoreIdException, UnauthorizedAccessException } from '../exceptions';

@Injectable()
export class StoreContextGuard implements CanActivate {
  private readonly logger = new Logger(StoreContextGuard.name);

  constructor(
    private readonly reflector: Reflector,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // valida si handler tiene @skipstorecontext() decorator
    const skip = this.reflector.getAllAndOverride<boolean>(
      SKIP_STORE_CONTEXT_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (skip) {
      this.logger.debug('Skipping store context validation for this handler');
      return true;
    }

    const gqlContext = GqlExecutionContext.create(context);
    const req = gqlContext.getContext().req;
    const storeId = req.headers['x-store-id'] as string | undefined;

    // valida que el header exista
    if (!storeId || storeId.trim() === '') {
      throw new MissingStoreIdException();
    }

    const trimmedStoreId = storeId.trim();

    // valida que la tienda exista en la base
    const store = await this.prisma.store.findUnique({
      where: { id: trimmedStoreId },
    }).catch((error) => {
      this.logger.warn(
        `Failed to validate store existence: ${error.message}`,
      );
      return null;
    });

    if (!store) {
      throw new UnauthorizedAccessException(
        `La tienda con ID "${trimmedStoreId}" no existe o está inactiva`,
      );
    }

    // si el usuario está autenticado, valida acceso a la tienda
    const userId = (req.user?.id || req.user?.sub) as string | undefined;

    if (userId) {
      const hasAccess = await this.validateUserStoreAccess(
        userId,
        trimmedStoreId,
      );

      if (!hasAccess) {
        throw new UnauthorizedAccessException(
          `El usuario no tiene acceso a la tienda "${trimmedStoreId}"`,
        );
      }

      this.logger.debug(
        `Store context validated for user ${userId} in store ${trimmedStoreId}`,
      );
    }

    // inyecta storecontext en el request
    req.storeContext = { storeId: trimmedStoreId };

    this.logger.debug(
      `Store context set: storeId=${trimmedStoreId}, user=${userId || 'anonymous'}`,
    );

    return true;
  }

  // valida que el usuario tenga acceso a la tienda
  // pendiente: implementar según modelo de permisos
  private async validateUserStoreAccess(
    userId: string,
    storeId: string,
  ): Promise<boolean> {
    try {
      // por ahora todos los autenticados tienen acceso
      // en producción: validar store_id, permisos, roles por tienda

      const user = await this.prisma.cdmUser.findUnique({
        where: { id: userId },
      }).catch(() => null);

      if (!user) {
        this.logger.warn(`User ${userId} not found`);
        return false;
      }

      // por ahora cualquier usuario autenticado tiene acceso
      return true;
    } catch (error) {
      this.logger.error(
        `Error validating user store access: ${error.message}`,
      );
      return false;
    }
  }
}
