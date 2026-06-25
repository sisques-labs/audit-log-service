import { AuditLogViewModel } from '@/contexts/audit/domain/view-models/audit-log/audit-log.view-model';
import {
  AuditLogResponseDto,
  PaginatedAuditLogResultDto,
} from '@/contexts/audit/transport/graphql/dtos/responses/audit-log.response.dto';
import { Injectable, Logger } from '@nestjs/common';
import { BaseGraphQLMapper, PaginatedResult } from '@sisques-labs/nestjs-kit';

@Injectable()
export class AuditLogGraphqlMapper extends BaseGraphQLMapper<
  AuditLogViewModel,
  AuditLogResponseDto,
  PaginatedAuditLogResultDto
> {
  private readonly logger = new Logger(AuditLogGraphqlMapper.name);

  public toResponseDto(viewModel: AuditLogViewModel): AuditLogResponseDto {
    this.logger.log(
      `Converting audit log view model with id ${viewModel.id} to response dto`,
    );

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
      payload: JSON.stringify(viewModel.payload),
      createdAt: viewModel.createdAt,
      updatedAt: viewModel.updatedAt,
    };
  }

  public toPaginatedResponseDto(
    paginatedResult: PaginatedResult<AuditLogViewModel>,
  ): PaginatedAuditLogResultDto {
    this.logger.log(
      `Converting paginated result of ${paginatedResult.items.length} audit logs to response dto`,
    );

    return {
      items: paginatedResult.items.map((vm) => this.toResponseDto(vm)),
      total: paginatedResult.total,
      page: paginatedResult.page,
      perPage: paginatedResult.perPage,
      totalPages: paginatedResult.totalPages,
    };
  }
}
