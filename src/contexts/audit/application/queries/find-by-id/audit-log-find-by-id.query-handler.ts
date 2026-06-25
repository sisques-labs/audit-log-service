import { AuditLogFindByIdQuery } from '@/contexts/audit/application/queries/find-by-id/audit-log-find-by-id.query';
import { AuditLogAggregate } from '@/contexts/audit/domain/aggregates/audit-log/audit-log.aggregate';
import {
  AUDIT_LOG_WRITE_REPOSITORY_TOKEN,
  IAuditLogWriteRepository,
} from '@/contexts/audit/domain/repositories/audit-log-write.repository';
import { Inject, Logger, NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

@QueryHandler(AuditLogFindByIdQuery)
export class AuditLogFindByIdQueryHandler implements IQueryHandler<AuditLogFindByIdQuery> {
  private readonly logger = new Logger(AuditLogFindByIdQueryHandler.name);

  constructor(
    @Inject(AUDIT_LOG_WRITE_REPOSITORY_TOKEN)
    private readonly auditLogWriteRepository: IAuditLogWriteRepository,
  ) {}

  async execute(query: AuditLogFindByIdQuery): Promise<AuditLogAggregate> {
    this.logger.log(`Executing find audit log by id query: ${query.id}`);

    const auditLog = await this.auditLogWriteRepository.findById(query.id);

    if (!auditLog) {
      throw new NotFoundException(`AuditLog with id ${query.id} not found`);
    }

    return auditLog;
  }
}
