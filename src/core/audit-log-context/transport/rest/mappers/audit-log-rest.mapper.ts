import { AuditLogViewModel } from '@/core/audit-log-context/domain/view-models/audit-log/audit-log.view-model';
import {
  AuditLogRestResponseDto,
  PaginatedAuditLogRestResponseDto,
} from '@/core/audit-log-context/transport/rest/dtos/responses/audit-log-response.dto';
import { Injectable, Logger } from '@nestjs/common';
import { PaginatedResult } from '@sisques-labs/nestjs-kit';

@Injectable()
export class AuditLogRestMapper {
  private readonly logger = new Logger(AuditLogRestMapper.name);

  toResponseDto(viewModel: AuditLogViewModel): AuditLogRestResponseDto {
    this.logger.log(`Converting audit log view model with id ${viewModel.id} to response dto`);

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

  toPaginatedResponseDto(
    paginatedResult: PaginatedResult<AuditLogViewModel>,
  ): PaginatedAuditLogRestResponseDto {
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
