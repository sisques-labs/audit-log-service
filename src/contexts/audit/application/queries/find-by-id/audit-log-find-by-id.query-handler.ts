import { AuditLogFindByIdQuery } from '@/contexts/audit/application/queries/find-by-id/audit-log-find-by-id.query';
import { AssertAuditLogViewModelExistsService } from '@/contexts/audit/application/services/read/assert-audit-log-view-model-exists/assert-audit-log-view-model-exists.service';
import { AuditLogViewModel } from '@/contexts/audit/domain/view-models/audit-log/audit-log.view-model';
import { Logger } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';

@QueryHandler(AuditLogFindByIdQuery)
export class AuditLogFindByIdQueryHandler implements IQueryHandler<AuditLogFindByIdQuery> {
  private readonly logger = new Logger(AuditLogFindByIdQueryHandler.name);

  constructor(
    private readonly assertAuditLogViewModelExists: AssertAuditLogViewModelExistsService,
  ) {}

  async execute(query: AuditLogFindByIdQuery): Promise<AuditLogViewModel> {
    this.logger.log(`Executing find audit log by id query: ${query.id}`);

    return this.assertAuditLogViewModelExists.execute(query.id);
  }
}
