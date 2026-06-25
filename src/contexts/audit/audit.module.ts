import { CreateAuditLogCommandHandler } from '@/contexts/audit/application/commands/create-audit-log/create-audit-log.command-handler';
import { AuditLogFindByCriteriaQueryHandler } from '@/contexts/audit/application/queries/find-by-criteria/audit-log-find-by-criteria.query-handler';
import { AuditLogFindByIdQueryHandler } from '@/contexts/audit/application/queries/find-by-id/audit-log-find-by-id.query-handler';
import { AssertAuditLogViewModelExistsService } from '@/contexts/audit/application/services/read/assert-audit-log-view-model-exists/assert-audit-log-view-model-exists.service';
import { AuditLogAggregateBuilder } from '@/contexts/audit/domain/builders/audit-log/audit-log-aggregate.builder';
import { AUDIT_LOG_READ_REPOSITORY } from '@/contexts/audit/domain/repositories/read/audit-log-read.repository';
import { AUDIT_LOG_WRITE_REPOSITORY } from '@/contexts/audit/domain/repositories/write/audit-log-write.repository';
import { AuditLogTypeOrmEntity } from '@/contexts/audit/infrastructure/persistence/typeorm/entities/audit-log.entity';
import { AuditLogTypeOrmMapper } from '@/contexts/audit/infrastructure/persistence/typeorm/mappers/audit-log-typeorm.mapper';
import { AuditLogTypeOrmReadRepository } from '@/contexts/audit/infrastructure/persistence/typeorm/repositories/audit-log-typeorm-read.repository';
import { AuditLogTypeOrmWriteRepository } from '@/contexts/audit/infrastructure/persistence/typeorm/repositories/audit-log-typeorm-write.repository';
import { AuditLogGraphqlMapper } from '@/contexts/audit/transport/graphql/mappers/audit-log-graphql.mapper';
import { AuditLogQueriesResolver } from '@/contexts/audit/transport/graphql/resolvers/audit-log-queries.resolver';
import { AuditLogQueriesController } from '@/contexts/audit/transport/rest/controllers/audit-log-queries.controller';
import { AuditLogRestMapper } from '@/contexts/audit/transport/rest/mappers/audit-log-rest.mapper';
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';

const COMMAND_HANDLERS = [CreateAuditLogCommandHandler];

const QUERY_HANDLERS = [
  AuditLogFindByIdQueryHandler,
  AuditLogFindByCriteriaQueryHandler,
];

const DOMAIN_BUILDERS = [AuditLogAggregateBuilder];

const APPLICATION_SERVICES = [AssertAuditLogViewModelExistsService];

const INFRASTRUCTURE_ENTITIES = [AuditLogTypeOrmEntity];

const INFRASTRUCTURE_MAPPERS = [AuditLogTypeOrmMapper];

const INFRASTRUCTURE_REPOSITORIES = [
  {
    provide: AUDIT_LOG_WRITE_REPOSITORY,
    useClass: AuditLogTypeOrmWriteRepository,
  },
  {
    provide: AUDIT_LOG_READ_REPOSITORY,
    useClass: AuditLogTypeOrmReadRepository,
  },
];

const REST_CONTROLLERS = [AuditLogQueriesController];
const REST_PROVIDERS = [AuditLogRestMapper];

const GRAPHQL_PROVIDERS = [AuditLogQueriesResolver, AuditLogGraphqlMapper];

@Module({
  imports: [CqrsModule, TypeOrmModule.forFeature(INFRASTRUCTURE_ENTITIES)],
  controllers: [...REST_CONTROLLERS],
  providers: [
    ...COMMAND_HANDLERS,
    ...QUERY_HANDLERS,
    ...DOMAIN_BUILDERS,
    ...APPLICATION_SERVICES,
    ...INFRASTRUCTURE_MAPPERS,
    ...INFRASTRUCTURE_REPOSITORIES,
    ...REST_PROVIDERS,
    ...GRAPHQL_PROVIDERS,
  ],
})
export class AuditModule {}
