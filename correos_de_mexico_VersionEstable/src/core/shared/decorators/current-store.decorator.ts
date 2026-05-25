import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import type { StoreContext } from '../guards/store-context.interface';

// extrae storecontext del request después del guard
export const CurrentStore = createParamDecorator(
  (_data: unknown, context: ExecutionContext): StoreContext => {
    const gqlContext = GqlExecutionContext.create(context);
    const req = gqlContext.getContext().req;
    return req.storeContext;
  },
);
