import { CreateAuditLogCommand } from '@/core/audit-log-context/application/commands/create-audit-log/create-audit-log.command';
import { AuditLogAggregate } from '@/core/audit-log-context/domain/aggregates/audit-log/audit-log.aggregate';
import { AuditLogAggregateBuilder } from '@/core/audit-log-context/domain/builders/audit-log/audit-log-aggregate.builder';
import {
  AUDIT_LOG_WRITE_REPOSITORY_TOKEN,
  IAuditLogWriteRepository,
} from '@/core/audit-log-context/domain/repositories/audit-log-write.repository';
import { Inject, Logger } from '@nestjs/common';
import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { BaseCommandHandler } from '@sisques-labs/nestjs-kit';
import { DateValueObject } from '@sisques-labs/nestjs-kit';

@CommandHandler(CreateAuditLogCommand)
export class CreateAuditLogCommandHandler
  extends BaseCommandHandler<CreateAuditLogCommand, AuditLogAggregate>
  implements ICommandHandler<CreateAuditLogCommand>
{
  private readonly logger = new Logger(CreateAuditLogCommandHandler.name);

  constructor(
    @Inject(AUDIT_LOG_WRITE_REPOSITORY_TOKEN)
    private readonly auditLogWriteRepository: IAuditLogWriteRepository,
    private readonly auditLogAggregateBuilder: AuditLogAggregateBuilder,
    eventBus: EventBus,
  ) {
    super(eventBus);
  }

  async execute(command: CreateAuditLogCommand): Promise<string> {
    this.logger.log(`Executing create audit log command for event: ${command.eventType.value}`);

    const now = new DateValueObject(new Date());

    const aggregate = this.auditLogAggregateBuilder
      .reset()
      .withId(command.id)
      .withEventId(command.eventId)
      .withEventType(command.eventType)
      .withTopic(command.topic)
      .withAggregateRootId(command.aggregateRootId)
      .withAggregateRootType(command.aggregateRootType)
      .withEntityId(command.entityId)
      .withEntityType(command.entityType)
      .withOccurredAt(command.occurredAt)
      .withPayload(command.payload)
      .withCreatedAt(now)
      .withUpdatedAt(now)
      .build();

    await this.auditLogWriteRepository.save(aggregate);

    return aggregate.id.value;
  }
}
