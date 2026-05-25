import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { User as AuthUserType } from '../../user/entities/user.entity';

// extrae el usuario autenticado del contexto (http o graphql)
// requiere que el authguard de better asuth haya procesado la request
export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext): AuthUserType | null => {
    if (context.getType<string>() === 'graphql') {
      const ctx = GqlExecutionContext.create(context);
      const req = ctx.getContext().req;
      return req?.session?.user ?? null;
    }

    const request = context.switchToHttp().getRequest();
    return request?.session?.user ?? null;
  },
);
