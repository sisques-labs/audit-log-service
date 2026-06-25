import { StringValueObject } from '@sisques-labs/nestjs-kit';

export class AuditLogEntityType extends StringValueObject {
  constructor(value: string) {
    super(value, { minLength: 1, maxLength: 255 });
  }
}
