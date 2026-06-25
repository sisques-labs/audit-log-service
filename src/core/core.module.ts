import { AuditModule } from '@/contexts/audit/audit.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [AuditModule],
  exports: [AuditModule],
})
export class CoreModule {}
