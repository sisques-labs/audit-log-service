import { DateValueObject } from '@sisques-labs/nestjs-kit';
import { AuditLogAggregateRootId } from '@/contexts/audit/domain/value-objects/audit-log/audit-log-aggregate-root-id/audit-log-aggregate-root-id.vo';
import { AuditLogAggregateRootType } from '@/contexts/audit/domain/value-objects/audit-log/audit-log-aggregate-root-type/audit-log-aggregate-root-type.vo';
import { AuditLogEntityId } from '@/contexts/audit/domain/value-objects/audit-log/audit-log-entity-id/audit-log-entity-id.vo';
import { AuditLogEntityType } from '@/contexts/audit/domain/value-objects/audit-log/audit-log-entity-type/audit-log-entity-type.vo';
import { AuditLogEventId } from '@/contexts/audit/domain/value-objects/audit-log/audit-log-event-id/audit-log-event-id.vo';
import { AuditLogEventType } from '@/contexts/audit/domain/value-objects/audit-log/audit-log-event-type/audit-log-event-type.vo';
import { AuditLogId } from '@/contexts/audit/domain/value-objects/audit-log/audit-log-id/audit-log-id.vo';
import { AuditLogOccurredAt } from '@/contexts/audit/domain/value-objects/audit-log/audit-log-occurred-at/audit-log-occurred-at.vo';
import { AuditLogPayload } from '@/contexts/audit/domain/value-objects/audit-log/audit-log-payload/audit-log-payload.vo';
import { AuditLogTopic } from '@/contexts/audit/domain/value-objects/audit-log/audit-log-topic/audit-log-topic.vo';

export interface IAuditLog {
  id: AuditLogId;
  eventId: AuditLogEventId;
  eventType: AuditLogEventType;
  topic: AuditLogTopic;
  aggregateRootId: AuditLogAggregateRootId;
  aggregateRootType: AuditLogAggregateRootType;
  entityId: AuditLogEntityId;
  entityType: AuditLogEntityType;
  occurredAt: AuditLogOccurredAt;
  payload: AuditLogPayload;
  createdAt: DateValueObject;
  updatedAt: DateValueObject;
}
