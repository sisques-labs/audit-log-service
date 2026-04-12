import { StringValueObject } from '@sisques-labs/nestjs-kit';

export class AuditLogEventType extends StringValueObject {
  constructor(value: string) {
    super(value, { minLength: 1, maxLength: 255 });
  }
}
