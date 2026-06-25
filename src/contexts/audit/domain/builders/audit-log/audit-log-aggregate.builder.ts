import { AuditLogAggregate } from '@/contexts/audit/domain/aggregates/audit-log/audit-log.aggregate';
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
import { Injectable, Logger } from '@nestjs/common';
import { DateValueObject } from '@sisques-labs/nestjs-kit';

@Injectable()
export class AuditLogAggregateBuilder {
  private readonly logger = new Logger(AuditLogAggregateBuilder.name);

  private _id: AuditLogId | null = null;
  private _eventId: AuditLogEventId | null = null;
  private _eventType: AuditLogEventType | null = null;
  private _topic: AuditLogTopic | null = null;
  private _aggregateRootId: AuditLogAggregateRootId | null = null;
  private _aggregateRootType: AuditLogAggregateRootType | null = null;
  private _entityId: AuditLogEntityId | null = null;
  private _entityType: AuditLogEntityType | null = null;
  private _occurredAt: AuditLogOccurredAt | null = null;
  private _payload: AuditLogPayload | null = null;
  private _createdAt: DateValueObject | null = null;
  private _updatedAt: DateValueObject | null = null;

  public withId(id: AuditLogId): this {
    this._id = id;
    return this;
  }

  public withEventId(eventId: AuditLogEventId): this {
    this._eventId = eventId;
    return this;
  }

  public withEventType(eventType: AuditLogEventType): this {
    this._eventType = eventType;
    return this;
  }

  public withTopic(topic: AuditLogTopic): this {
    this._topic = topic;
    return this;
  }

  public withAggregateRootId(aggregateRootId: AuditLogAggregateRootId): this {
    this._aggregateRootId = aggregateRootId;
    return this;
  }

  public withAggregateRootType(
    aggregateRootType: AuditLogAggregateRootType,
  ): this {
    this._aggregateRootType = aggregateRootType;
    return this;
  }

  public withEntityId(entityId: AuditLogEntityId): this {
    this._entityId = entityId;
    return this;
  }

  public withEntityType(entityType: AuditLogEntityType): this {
    this._entityType = entityType;
    return this;
  }

  public withOccurredAt(occurredAt: AuditLogOccurredAt): this {
    this._occurredAt = occurredAt;
    return this;
  }

  public withPayload(payload: AuditLogPayload): this {
    this._payload = payload;
    return this;
  }

  public withCreatedAt(createdAt: DateValueObject): this {
    this._createdAt = createdAt;
    return this;
  }

  public withUpdatedAt(updatedAt: DateValueObject): this {
    this._updatedAt = updatedAt;
    return this;
  }

  public fromPrimitives(primitives: AuditLogPrimitives): this {
    this.logger.log(`Populating builder from primitives: ${primitives.id}`);

    this._id = new AuditLogId(primitives.id);
    this._eventId = new AuditLogEventId(primitives.eventId);
    this._eventType = new AuditLogEventType(primitives.eventType);
    this._topic = new AuditLogTopic(primitives.topic);
    this._aggregateRootId = new AuditLogAggregateRootId(
      primitives.aggregateRootId,
    );
    this._aggregateRootType = new AuditLogAggregateRootType(
      primitives.aggregateRootType,
    );
    this._entityId = new AuditLogEntityId(primitives.entityId);
    this._entityType = new AuditLogEntityType(primitives.entityType);
    this._occurredAt = new AuditLogOccurredAt(new Date(primitives.occurredAt));
    this._payload = new AuditLogPayload(primitives.payload);
    this._createdAt = new DateValueObject(new Date(primitives.createdAt));
    this._updatedAt = new DateValueObject(new Date(primitives.updatedAt));

    return this;
  }

  public reset(): this {
    this._id = null;
    this._eventId = null;
    this._eventType = null;
    this._topic = null;
    this._aggregateRootId = null;
    this._aggregateRootType = null;
    this._entityId = null;
    this._entityType = null;
    this._occurredAt = null;
    this._payload = null;
    this._createdAt = null;
    this._updatedAt = null;

    return this;
  }

  public build(): AuditLogAggregate {
    this.logger.log('Building AuditLogAggregate from builder');

    const now = new Date();

    const dto: IAuditLog = {
      id: this._id ?? new AuditLogId(),
      eventId: this._eventId,
      eventType: this._eventType,
      topic: this._topic,
      aggregateRootId: this._aggregateRootId,
      aggregateRootType: this._aggregateRootType,
      entityId: this._entityId,
      entityType: this._entityType,
      occurredAt: this._occurredAt,
      payload: this._payload,
      createdAt: this._createdAt ?? new DateValueObject(now),
      updatedAt: this._updatedAt ?? new DateValueObject(now),
    };

    return new AuditLogAggregate(dto);
  }
}
