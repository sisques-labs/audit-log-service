import { HealthController } from '@/core/health/transport/rest/controllers/health.controller';
import { Module } from '@nestjs/common';

@Module({
  controllers: [HealthController],
})
export class HealthModule {}
