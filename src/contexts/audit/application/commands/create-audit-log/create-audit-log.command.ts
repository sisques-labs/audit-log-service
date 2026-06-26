import { ICreateAuditLogCommandDto } from '@/contexts/audit/application/dtos/commands/create-audit-log-command.dto';
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

export class CreateAuditLogCommand {
  public readonly id: AuditLogId;
  public readonly eventId: AuditLogEventId;
  public readonly eventType: AuditLogEventType;
  public readonly topic: AuditLogTopic;
  public readonly aggregateRootId: AuditLogAggregateRootId;
  public readonly aggregateRootType: AuditLogAggregateRootType;
  public readonly entityId: AuditLogEntityId;
  public readonly entityType: AuditLogEntityType;
  public readonly occurredAt: AuditLogOccurredAt;
  public readonly payload: AuditLogPayload;

  constructor(props: ICreateAuditLogCommandDto) {
    this.id = new AuditLogId();
    this.eventId = new AuditLogEventId(props.eventId);
    this.eventType = new AuditLogEventType(props.eventType);
    this.topic = new AuditLogTopic(props.topic);
    this.aggregateRootId = new AuditLogAggregateRootId(props.aggregateRootId);
    this.aggregateRootType = new AuditLogAggregateRootType(
      props.aggregateRootType,
    );
    this.entityId = new AuditLogEntityId(props.entityId);
    this.entityType = new AuditLogEntityType(props.entityType);
    this.occurredAt = new AuditLogOccurredAt(new Date(props.occurredAt));
    this.payload = new AuditLogPayload(props.payload);
  }
}
