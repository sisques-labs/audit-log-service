import { AuditLogContextModule } from '@/core/audit-log-context/audit-log-context.module';
import { Module } from '@nestjs/common';

@Module({
  imports: [AuditLogContextModule],
  exports: [AuditLogContextModule],
})
export class CoreModule {}
