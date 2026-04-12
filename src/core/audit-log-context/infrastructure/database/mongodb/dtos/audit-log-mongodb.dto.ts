import { BaseMongoDto } from '@sisques-labs/nestjs-kit';

export type AuditLogMongoDbDto = BaseMongoDto & {
  eventId: string;
  eventType: string;
  topic: string;
  aggregateRootId: string;
  aggregateRootType: string;
  entityId: string;
  entityType: string;
  occurredAt: Date;
  payload: Record<string, any>;
};
