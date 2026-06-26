import { AuditLogAggregate } from '@/contexts/audit/domain/aggregates/audit-log/audit-log.aggregate';
import { AuditLogViewModel } from '@/contexts/audit/domain/view-models/audit-log/audit-log.view-model';
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
import { Injectable } from '@nestjs/common';
import {
  BaseBuilder,
  DateValueObject,
  FieldIsRequiredException,
} from '@sisques-labs/nestjs-kit';

@Injectable()
export class AuditLogAggregateBuilder extends BaseBuilder<
  AuditLogAggregate,
  AuditLogViewModel
> {
  private _eventId!: string;
  private _eventType!: string;
  private _topic!: string;
  private _aggregateRootId!: string;
  private _aggregateRootType!: string;
  private _entityId!: string;
  private _entityType!: string;
  private _occurredAt!: Date;
  private _payload: Record<string, any> = {};

  withEventId(eventId: string): this {
    this._eventId = eventId;
    return this;
  }

  withEventType(eventType: string): this {
    this._eventType = eventType;
    return this;
  }

  withTopic(topic: string): this {
    this._topic = topic;
    return this;
  }

  withAggregateRootId(aggregateRootId: string): this {
    this._aggregateRootId = aggregateRootId;
    return this;
  }

  withAggregateRootType(aggregateRootType: string): this {
    this._aggregateRootType = aggregateRootType;
    return this;
  }

  withEntityId(entityId: string): this {
    this._entityId = entityId;
    return this;
  }

  withEntityType(entityType: string): this {
    this._entityType = entityType;
    return this;
  }

  withOccurredAt(occurredAt: Date): this {
    this._occurredAt = occurredAt;
    return this;
  }

  withPayload(payload: Record<string, any>): this {
    this._payload = payload;
    return this;
  }

  public override build(): AuditLogAggregate {
    this.validate();
    return new AuditLogAggregate({
      id: new AuditLogId(this._id),
      eventId: new AuditLogEventId(this._eventId),
      eventType: new AuditLogEventType(this._eventType),
      topic: new AuditLogTopic(this._topic),
      aggregateRootId: new AuditLogAggregateRootId(this._aggregateRootId),
      aggregateRootType: new AuditLogAggregateRootType(this._aggregateRootType),
      entityId: new AuditLogEntityId(this._entityId),
      entityType: new AuditLogEntityType(this._entityType),
      occurredAt: new AuditLogOccurredAt(this._occurredAt),
      payload: new AuditLogPayload(this._payload),
      createdAt: new DateValueObject(this._createdAt),
      updatedAt: new DateValueObject(this._updatedAt),
    });
  }

  public override buildViewModel(): AuditLogViewModel {
    this.validate();
    return new AuditLogViewModel({
      id: this._id,
      eventId: this._eventId,
      eventType: this._eventType,
      topic: this._topic,
      aggregateRootId: this._aggregateRootId,
      aggregateRootType: this._aggregateRootType,
      entityId: this._entityId,
      entityType: this._entityType,
      occurredAt: this._occurredAt,
      payload: this._payload,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
    });
  }

  public override validate(): void {
    super.validate();
    if (!this._eventId) throw new FieldIsRequiredException('eventId');
    if (!this._eventType) throw new FieldIsRequiredException('eventType');
    if (!this._topic) throw new FieldIsRequiredException('topic');
    if (!this._aggregateRootId)
      throw new FieldIsRequiredException('aggregateRootId');
    if (!this._aggregateRootType)
      throw new FieldIsRequiredException('aggregateRootType');
    if (!this._entityId) throw new FieldIsRequiredException('entityId');
    if (!this._entityType) throw new FieldIsRequiredException('entityType');
    if (!this._occurredAt) throw new FieldIsRequiredException('occurredAt');
  }
}
