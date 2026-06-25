import { AuditLogFindByCriteriaQuery } from '@/contexts/audit/application/queries/find-by-criteria/audit-log-find-by-criteria.query';
import {
  AUDIT_LOG_READ_REPOSITORY,
  IAuditLogReadRepository,
} from '@/contexts/audit/domain/repositories/read/audit-log-read.repository';
import { AuditLogViewModel } from '@/contexts/audit/domain/view-models/audit-log/audit-log.view-model';
import { Inject, Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { PaginatedResult } from '@sisques-labs/nestjs-kit';

@QueryHandler(AuditLogFindByCriteriaQuery)
export class AuditLogFindByCriteriaQueryHandler implements IQueryHandler<AuditLogFindByCriteriaQuery> {
  private readonly logger = new Logger(AuditLogFindByCriteriaQueryHandler.name);

  constructor(
    @Inject(AUDIT_LOG_READ_REPOSITORY)
    private readonly auditLogReadRepository: IAuditLogReadRepository,
  ) {}

  async execute(
    query: AuditLogFindByCriteriaQuery,
  ): Promise<PaginatedResult<AuditLogViewModel>> {
    this.logger.log('Executing find audit logs by criteria query');

    return this.auditLogReadRepository.findByCriteria(query.criteria);
  }
}
