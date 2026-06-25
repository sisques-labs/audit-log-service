import { AuditLogNotFoundException } from '@/contexts/audit/domain/exceptions/audit-log-not-found.exception';
import { HttpStatus } from '@nestjs/common';
import { BaseException } from '@sisques-labs/nestjs-kit';

export function resolveAuditExceptionStatus(
  exception: BaseException,
): HttpStatus | null {
  if (exception instanceof AuditLogNotFoundException) {
    return HttpStatus.NOT_FOUND;
  }
  return null;
}
