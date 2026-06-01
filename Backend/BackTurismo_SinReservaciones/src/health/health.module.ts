// src/health/health.module.ts
import { Module } from '@nestjs/common';
import { HealthResolver } from './health.resolver';

@Module({
  providers: [HealthResolver],
})
export class HealthModule {}
