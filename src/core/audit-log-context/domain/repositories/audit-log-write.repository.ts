import { AuditLogAggregate } from '@/core/audit-log-context/domain/aggregates/audit-log/audit-log.aggregate';
import { IBaseWriteRepository } from '@sisques-labs/nestjs-kit';

export const AUDIT_LOG_WRITE_REPOSITORY_TOKEN = Symbol('AuditLogWriteRepository');

export interface IAuditLogWriteRepository extends IBaseWriteRepository<AuditLogAggregate> {}
