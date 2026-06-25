import { AuditLogFindByCriteriaQuery } from '@/contexts/audit/application/queries/find-by-criteria/audit-log-find-by-criteria.query';
import { AuditLogFindByIdQuery } from '@/contexts/audit/application/queries/find-by-id/audit-log-find-by-id.query';
import { AuditLogAggregate } from '@/contexts/audit/domain/aggregates/audit-log/audit-log.aggregate';
import { AuditLogViewModel } from '@/contexts/audit/domain/view-models/audit-log/audit-log.view-model';
import {
  AuditLogResponseDto,
  PaginatedAuditLogResultDto,
} from '@/contexts/audit/transport/graphql/dtos/responses/audit-log.response.dto';
import { AuditLogGraphqlMapper } from '@/contexts/audit/transport/graphql/mappers/audit-log-graphql.mapper';
import { Logger } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { Args, Query, Resolver } from '@nestjs/graphql';
import {
  BaseFindByCriteriaInput,
  Criteria,
  PaginatedResult,
} from '@sisques-labs/nestjs-kit';

@Resolver(() => AuditLogResponseDto)
export class AuditLogQueriesResolver {
  private readonly logger = new Logger(AuditLogQueriesResolver.name);

  constructor(
    private readonly queryBus: QueryBus,
    private readonly auditLogGraphqlMapper: AuditLogGraphqlMapper,
  ) {}

  @Query(() => AuditLogResponseDto)
  async auditLog(@Args('id') id: string): Promise<AuditLogResponseDto> {
    this.logger.log(`Resolving auditLog query for id: ${id}`);

    const aggregate = await this.queryBus.execute<
      AuditLogFindByIdQuery,
      AuditLogAggregate
    >(new AuditLogFindByIdQuery({ id }));

    const viewModel = AuditLogViewModel.fromPrimitives(
      aggregate.toPrimitives(),
    );
    return this.auditLogGraphqlMapper.toResponseDto(viewModel);
  }

  @Query(() => PaginatedAuditLogResultDto)
  async auditLogs(
    @Args('criteria', { type: () => BaseFindByCriteriaInput, nullable: true })
    criteriaInput?: BaseFindByCriteriaInput,
  ): Promise<PaginatedAuditLogResultDto> {
    this.logger.log('Resolving auditLogs query');

    const criteria = new Criteria(
      criteriaInput?.filters ?? [],
      criteriaInput?.sorts ?? [],
      criteriaInput?.pagination ?? { page: 1, perPage: 20 },
    );

    const result = await this.queryBus.execute<
      AuditLogFindByCriteriaQuery,
      PaginatedResult<AuditLogAggregate>
    >(new AuditLogFindByCriteriaQuery({ criteria }));

    const viewModels = result.items.map((agg) =>
      AuditLogViewModel.fromPrimitives(agg.toPrimitives()),
    );

    return this.auditLogGraphqlMapper.toPaginatedResponseDto(
      new PaginatedResult(
        viewModels,
        result.total,
        result.page,
        result.perPage,
      ),
    );
  }
}
