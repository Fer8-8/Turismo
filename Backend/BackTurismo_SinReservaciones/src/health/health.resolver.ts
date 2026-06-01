// src/health/health.resolver.ts
import { Resolver, Query } from '@nestjs/graphql';

@Resolver()
export class HealthResolver {
  @Query(() => String)
  health() {
    return 'ok';
  }
}
