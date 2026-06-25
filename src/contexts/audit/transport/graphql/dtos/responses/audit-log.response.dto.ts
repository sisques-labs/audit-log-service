import { Field, ID, ObjectType } from '@nestjs/graphql';
import { BasePaginatedResultDto } from '@sisques-labs/nestjs-kit';

@ObjectType('AuditLog')
export class AuditLogResponseDto {
  @Field(() => ID)
  id: string;

  @Field()
  eventId: string;

  @Field()
  eventType: string;

  @Field()
  topic: string;

  @Field()
  aggregateRootId: string;

  @Field()
  aggregateRootType: string;

  @Field()
  entityId: string;

  @Field()
  entityType: string;

  @Field()
  occurredAt: Date;

  @Field({ description: 'Full event payload serialized as JSON string' })
  payload: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

@ObjectType('PaginatedAuditLogResultDto')
export class PaginatedAuditLogResultDto extends BasePaginatedResultDto {
  @Field(() => [AuditLogResponseDto], {
    description: 'The audit logs in the current page',
  })
  items: AuditLogResponseDto[];
}
