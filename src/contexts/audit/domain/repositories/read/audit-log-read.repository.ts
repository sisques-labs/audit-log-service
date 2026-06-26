import { AuditLogViewModel } from '@/contexts/audit/domain/view-models/audit-log/audit-log.view-model';
import { IBaseReadRepository } from '@sisques-labs/nestjs-kit';

export const AUDIT_LOG_READ_REPOSITORY = Symbol('AUDIT_LOG_READ_REPOSITORY');

export type IAuditLogReadRepository = IBaseReadRepository<AuditLogViewModel>;
