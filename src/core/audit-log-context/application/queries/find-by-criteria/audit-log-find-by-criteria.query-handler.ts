import { AuditLogFindByCriteriaQuery } from '@/core/audit-log-context/application/queries/find-by-criteria/audit-log-find-by-criteria.query';
import { AuditLogAggregate } from '@/core/audit-log-context/domain/aggregates/audit-log/audit-log.aggregate';
import {
  AUDIT_LOG_WRITE_REPOSITORY_TOKEN,
  IAuditLogWriteRepository,
} from '@/core/audit-log-context/domain/repositories/audit-log-write.repository';
import { Inject, Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PaginatedResult } from '@sisques-labs/nestjs-kit';

@QueryHandler(AuditLogFindByCriteriaQuery)
export class AuditLogFindByCriteriaQueryHandler
  implements IQueryHandler<AuditLogFindByCriteriaQuery>
{
  private readonly logger = new Logger(AuditLogFindByCriteriaQueryHandler.name);

  constructor(
    @Inject(AUDIT_LOG_WRITE_REPOSITORY_TOKEN)
    private readonly auditLogWriteRepository: IAuditLogWriteRepository,
  ) {}

  async execute(
    query: AuditLogFindByCriteriaQuery,
  ): Promise<PaginatedResult<AuditLogAggregate>> {
    this.logger.log('Executing find audit logs by criteria query');

    return this.auditLogWriteRepository.findByCriteria(query.criteria);
  }
}
