import { AuditLogAggregate } from '@/contexts/audit/domain/aggregates/audit-log/audit-log.aggregate';
import { IBaseWriteRepository } from '@sisques-labs/nestjs-kit';

export const AUDIT_LOG_WRITE_REPOSITORY = Symbol('AUDIT_LOG_WRITE_REPOSITORY');

export type IAuditLogWriteRepository = IBaseWriteRepository<AuditLogAggregate>;
