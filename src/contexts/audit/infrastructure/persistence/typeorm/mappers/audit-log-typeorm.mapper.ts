import { AuditLogAggregate } from '@/contexts/audit/domain/aggregates/audit-log/audit-log.aggregate';
import { AuditLogAggregateBuilder } from '@/contexts/audit/domain/builders/audit-log/audit-log-aggregate.builder';
import { AuditLogViewModel } from '@/contexts/audit/domain/view-models/audit-log/audit-log.view-model';
import { AuditLogTypeOrmEntity } from '@/contexts/audit/infrastructure/persistence/typeorm/entities/audit-log.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AuditLogTypeOrmMapper {
  constructor(
    private readonly auditLogAggregateBuilder: AuditLogAggregateBuilder,
  ) {}

  public toAggregate(entity: AuditLogTypeOrmEntity): AuditLogAggregate {
    return this.hydrateBuilder(entity).build();
  }

  public toViewModel(entity: AuditLogTypeOrmEntity): AuditLogViewModel {
    return this.hydrateBuilder(entity).buildViewModel();
  }

  public toEntity(aggregate: AuditLogAggregate): AuditLogTypeOrmEntity {
    const primitives = aggregate.toPrimitives();
    const entity = new AuditLogTypeOrmEntity();

    entity.id = primitives.id;
    entity.eventId = primitives.eventId;
    entity.eventType = primitives.eventType;
    entity.topic = primitives.topic;
    entity.aggregateRootId = primitives.aggregateRootId;
    entity.aggregateRootType = primitives.aggregateRootType;
    entity.entityId = primitives.entityId;
    entity.entityType = primitives.entityType;
    entity.occurredAt = primitives.occurredAt;
    entity.payload = primitives.payload;
    entity.createdAt = primitives.createdAt;
    entity.updatedAt = primitives.updatedAt;

    return entity;
  }

  private hydrateBuilder(
    entity: AuditLogTypeOrmEntity,
  ): AuditLogAggregateBuilder {
    return this.auditLogAggregateBuilder
      .withId(entity.id)
      .withEventId(entity.eventId)
      .withEventType(entity.eventType)
      .withTopic(entity.topic)
      .withAggregateRootId(entity.aggregateRootId)
      .withAggregateRootType(entity.aggregateRootType)
      .withEntityId(entity.entityId)
      .withEntityType(entity.entityType)
      .withOccurredAt(entity.occurredAt)
      .withPayload((entity.payload ?? {}) as Record<string, any>)
      .withCreatedAt(entity.createdAt)
      .withUpdatedAt(entity.updatedAt);
  }
}
