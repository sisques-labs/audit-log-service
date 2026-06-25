import { BaseException } from '@sisques-labs/nestjs-kit';

export class AuditLogNotFoundException extends BaseException {
  constructor(id: string) {
    super(`Audit log with id '${id}' was not found`);
  }
}
