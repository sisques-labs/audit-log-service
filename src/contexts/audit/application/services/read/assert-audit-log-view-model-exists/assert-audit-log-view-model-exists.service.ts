import {
  AUDIT_LOG_READ_REPOSITORY,
  IAuditLogReadRepository,
} from '@/contexts/audit/domain/repositories/read/audit-log-read.repository';
import { AuditLogNotFoundException } from '@/contexts/audit/domain/exceptions/audit-log-not-found.exception';
import { AuditLogViewModel } from '@/contexts/audit/domain/view-models/audit-log/audit-log.view-model';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class AssertAuditLogViewModelExistsService {
  constructor(
    @Inject(AUDIT_LOG_READ_REPOSITORY)
    private readonly auditLogReadRepository: IAuditLogReadRepository,
  ) {}

  async execute(id: string): Promise<AuditLogViewModel> {
    const auditLog = await this.auditLogReadRepository.findById(id);
    if (!auditLog) {
      throw new AuditLogNotFoundException(id);
    }
    return auditLog;
  }
}
