import { AuditLogFindByCriteriaQuery } from '@/contexts/audit/application/queries/find-by-criteria/audit-log-find-by-criteria.query';
import { AuditLogFindByIdQuery } from '@/contexts/audit/application/queries/find-by-id/audit-log-find-by-id.query';
import { AuditLogViewModel } from '@/contexts/audit/domain/view-models/audit-log/audit-log.view-model';
import {
  AuditLogRestResponseDto,
  PaginatedAuditLogRestResponseDto,
} from '@/contexts/audit/transport/rest/dtos/responses/audit-log-response.dto';
import { AuditLogRestMapper } from '@/contexts/audit/transport/rest/mappers/audit-log-rest.mapper';
import { Controller, Get, Logger, Param, Query } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { Criteria, PaginatedResult } from '@sisques-labs/nestjs-kit';

@Controller('audit-logs')
export class AuditLogQueriesController {
  private readonly logger = new Logger(AuditLogQueriesController.name);

  constructor(
    private readonly queryBus: QueryBus,
    private readonly auditLogRestMapper: AuditLogRestMapper,
  ) {}

  @Get(':id')
  async findById(@Param('id') id: string): Promise<AuditLogRestResponseDto> {
    this.logger.log(`GET /audit-logs/${id}`);

    const viewModel = await this.queryBus.execute<
      AuditLogFindByIdQuery,
      AuditLogViewModel
    >(new AuditLogFindByIdQuery({ id }));

    return this.auditLogRestMapper.toResponseDto(viewModel);
  }

  @Get()
  async findAll(
    @Query('page') page = '1',
    @Query('perPage') perPage = '20',
  ): Promise<PaginatedAuditLogRestResponseDto> {
    this.logger.log('GET /audit-logs');

    const criteria = new Criteria([], [], {
      page: Number(page),
      perPage: Number(perPage),
    });

    const result = await this.queryBus.execute<
      AuditLogFindByCriteriaQuery,
      PaginatedResult<AuditLogViewModel>
    >(new AuditLogFindByCriteriaQuery({ criteria }));

    return this.auditLogRestMapper.toPaginatedResponseDto(result);
  }
}
