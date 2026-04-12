import { AuditLogAggregate } from '@/core/audit-log-context/domain/aggregates/audit-log/audit-log.aggregate';
import { AuditLogAggregateBuilder } from '@/core/audit-log-context/domain/builders/audit-log/audit-log-aggregate.builder';
import { AuditLogViewModel } from '@/core/audit-log-context/domain/view-models/audit-log/audit-log.view-model';
import { AuditLogMongoDbDto } from '@/core/audit-log-context/infrastructure/database/mongodb/dtos/audit-log-mongodb.dto';
import { Injectable, Logger } from '@nestjs/common';
import { BaseMongoDBMapper } from '@sisques-labs/nestjs-kit';

@Injectable()
export class AuditLogMongoDBMapper extends BaseMongoDBMapper<
  AuditLogViewModel,
  AuditLogMongoDbDto,
  AuditLogAggregate
> {
  private readonly logger = new Logger(AuditLogMongoDBMapper.name);

  constructor(private readonly auditLogAggregateBuilder: AuditLogAggregateBuilder) {
    super();
  }

  public toViewModel(doc: AuditLogMongoDbDto): AuditLogViewModel {
    this.logger.log(`Converting MongoDB document to audit log view model with id ${doc.id}`);

    return new AuditLogViewModel({
      id: doc.id,
      eventId: doc.eventId,
      eventType: doc.eventType,
      topic: doc.topic,
      aggregateRootId: doc.aggregateRootId,
      aggregateRootType: doc.aggregateRootType,
      entityId: doc.entityId,
      entityType: doc.entityType,
      occurredAt: this.normalizeMongoDate(doc.occurredAt),
      payload: doc.payload ?? {},
      createdAt: this.normalizeMongoDate(doc.createdAt),
      updatedAt: this.normalizeMongoDate(doc.updatedAt),
    });
  }

  public fromViewModelToMongoData(viewModel: AuditLogViewModel): AuditLogMongoDbDto {
    return {
      id: viewModel.id,
      eventId: viewModel.eventId,
      eventType: viewModel.eventType,
      topic: viewModel.topic,
      aggregateRootId: viewModel.aggregateRootId,
      aggregateRootType: viewModel.aggregateRootType,
      entityId: viewModel.entityId,
      entityType: viewModel.entityType,
      occurredAt: viewModel.occurredAt,
      payload: viewModel.payload,
      createdAt: viewModel.createdAt,
      updatedAt: viewModel.updatedAt,
    };
  }

  public fromAggregateToMongoData(aggregate: AuditLogAggregate): AuditLogMongoDbDto {
    return {
      id: aggregate.id.value,
      eventId: aggregate.eventId.value,
      eventType: aggregate.eventType.value,
      topic: aggregate.topic.value,
      aggregateRootId: aggregate.aggregateRootId.value,
      aggregateRootType: aggregate.aggregateRootType.value,
      entityId: aggregate.entityId.value,
      entityType: aggregate.entityType.value,
      occurredAt: aggregate.occurredAt.value,
      payload: aggregate.payload.value,
      createdAt: aggregate.createdAt.value,
      updatedAt: aggregate.updatedAt.value,
    };
  }

  public toAggregate(doc: AuditLogMongoDbDto): AuditLogAggregate {
    return this.auditLogAggregateBuilder
      .reset()
      .fromPrimitives({
        id: doc.id,
        eventId: doc.eventId,
        eventType: doc.eventType,
        topic: doc.topic,
        aggregateRootId: doc.aggregateRootId,
        aggregateRootType: doc.aggregateRootType,
        entityId: doc.entityId,
        entityType: doc.entityType,
        occurredAt: this.normalizeMongoDate(doc.occurredAt),
        payload: doc.payload ?? {},
        createdAt: this.normalizeMongoDate(doc.createdAt),
        updatedAt: this.normalizeMongoDate(doc.updatedAt),
      })
      .build();
  }
}
