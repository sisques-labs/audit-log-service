import { AuditLogFindByCriteriaQuery } from '@/core/audit-log-context/application/queries/find-by-criteria/audit-log-find-by-criteria.query';
import { AuditLogFindByIdQuery } from '@/core/audit-log-context/application/queries/find-by-id/audit-log-find-by-id.query';
import { AuditLogAggregate } from '@/core/audit-log-context/domain/aggregates/audit-log/audit-log.aggregate';
import { AuditLogViewModel } from '@/core/audit-log-context/domain/view-models/audit-log/audit-log.view-model';
import {
  AuditLogRestResponseDto,
  PaginatedAuditLogRestResponseDto,
} from '@/core/audit-log-context/transport/rest/dtos/responses/audit-log-response.dto';
import { AuditLogRestMapper } from '@/core/audit-log-context/transport/rest/mappers/audit-log-rest.mapper';
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

    const aggregate = await this.queryBus.execute<AuditLogFindByIdQuery, AuditLogAggregate>(
      new AuditLogFindByIdQuery({ id }),
    );

    const viewModel = AuditLogViewModel.fromPrimitives(aggregate.toPrimitives());
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
      PaginatedResult<AuditLogAggregate>
    >(new AuditLogFindByCriteriaQuery({ criteria }));

    const viewModels = result.items.map((agg) =>
      AuditLogViewModel.fromPrimitives(agg.toPrimitives()),
    );

    return this.auditLogRestMapper.toPaginatedResponseDto(
      new PaginatedResult(viewModels, result.total, result.page, result.perPage),
    );
  }
}
