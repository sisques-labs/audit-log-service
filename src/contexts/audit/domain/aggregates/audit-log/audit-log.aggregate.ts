import { IAuditLog } from '@/contexts/audit/domain/dtos/entities/audit-log.dto';
import { AuditLogPrimitives } from '@/contexts/audit/domain/primitives/audit-log.primitives';
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
import { BaseAggregate } from '@sisques-labs/nestjs-kit';

export class AuditLogAggregate extends BaseAggregate {
  private readonly _id: AuditLogId;
  private readonly _eventId: AuditLogEventId;
  private readonly _eventType: AuditLogEventType;
  private readonly _topic: AuditLogTopic;
  private readonly _aggregateRootId: AuditLogAggregateRootId;
  private readonly _aggregateRootType: AuditLogAggregateRootType;
  private readonly _entityId: AuditLogEntityId;
  private readonly _entityType: AuditLogEntityType;
  private readonly _occurredAt: AuditLogOccurredAt;
  private readonly _payload: AuditLogPayload;

  constructor(props: IAuditLog) {
    super(props.createdAt, props.updatedAt);
    this._id = props.id;
    this._eventId = props.eventId;
    this._eventType = props.eventType;
    this._topic = props.topic;
    this._aggregateRootId = props.aggregateRootId;
    this._aggregateRootType = props.aggregateRootType;
    this._entityId = props.entityId;
    this._entityType = props.entityType;
    this._occurredAt = props.occurredAt;
    this._payload = props.payload;
  }

  public get id(): AuditLogId {
    return this._id;
  }

  public get eventId(): AuditLogEventId {
    return this._eventId;
  }

  public get eventType(): AuditLogEventType {
    return this._eventType;
  }

  public get topic(): AuditLogTopic {
    return this._topic;
  }

  public get aggregateRootId(): AuditLogAggregateRootId {
    return this._aggregateRootId;
  }

  public get aggregateRootType(): AuditLogAggregateRootType {
    return this._aggregateRootType;
  }

  public get entityId(): AuditLogEntityId {
    return this._entityId;
  }

  public get entityType(): AuditLogEntityType {
    return this._entityType;
  }

  public get occurredAt(): AuditLogOccurredAt {
    return this._occurredAt;
  }

  public get payload(): AuditLogPayload {
    return this._payload;
  }

  public toPrimitives(): AuditLogPrimitives {
    return {
      id: this._id.value,
      eventId: this._eventId.value,
      eventType: this._eventType.value,
      topic: this._topic.value,
      aggregateRootId: this._aggregateRootId.value,
      aggregateRootType: this._aggregateRootType.value,
      entityId: this._entityId.value,
      entityType: this._entityType.value,
      occurredAt: this._occurredAt.value,
      payload: this._payload.value,
      createdAt: this._createdAt.value,
      updatedAt: this._updatedAt.value,
    };
  }
}
