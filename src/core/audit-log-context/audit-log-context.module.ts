import { CreateAuditLogCommandHandler } from '@/core/audit-log-context/application/commands/create-audit-log/create-audit-log.command-handler';
import { AuditLogFindByCriteriaQueryHandler } from '@/core/audit-log-context/application/queries/find-by-criteria/audit-log-find-by-criteria.query-handler';
import { AuditLogFindByIdQueryHandler } from '@/core/audit-log-context/application/queries/find-by-id/audit-log-find-by-id.query-handler';
import { AuditLogAggregateBuilder } from '@/core/audit-log-context/domain/builders/audit-log/audit-log-aggregate.builder';
import { AUDIT_LOG_WRITE_REPOSITORY_TOKEN } from '@/core/audit-log-context/domain/repositories/audit-log-write.repository';
import { AuditLogMongoDBMapper } from '@/core/audit-log-context/infrastructure/database/mongodb/mappers/audit-log-mongodb.mapper';
import { AuditLogMongoWriteRepository } from '@/core/audit-log-context/infrastructure/database/mongodb/repositories/audit-log-mongodb-write.repository';
import { AuditLogGraphqlMapper } from '@/core/audit-log-context/transport/graphql/mappers/audit-log-graphql.mapper';
import { AuditLogQueriesResolver } from '@/core/audit-log-context/transport/graphql/resolvers/audit-log-queries.resolver';
import { AuditLogQueriesController } from '@/core/audit-log-context/transport/rest/controllers/audit-log-queries.controller';
import { AuditLogRestMapper } from '@/core/audit-log-context/transport/rest/mappers/audit-log-rest.mapper';
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { MongoModule } from '@sisques-labs/nestjs-kit';

const RESOLVERS = [AuditLogQueriesResolver];

const QUERY_HANDLERS = [AuditLogFindByIdQueryHandler, AuditLogFindByCriteriaQueryHandler];

const COMMAND_HANDLERS = [CreateAuditLogCommandHandler];

const BUILDERS = [AuditLogAggregateBuilder];

const MAPPERS = [AuditLogMongoDBMapper, AuditLogGraphqlMapper, AuditLogRestMapper];

const REPOSITORIES = [
  {
    provide: AUDIT_LOG_WRITE_REPOSITORY_TOKEN,
    useClass: AuditLogMongoWriteRepository,
  },
];

@Module({
  imports: [CqrsModule, MongoModule],
  controllers: [AuditLogQueriesController],
  providers: [
    ...RESOLVERS,
    ...QUERY_HANDLERS,
    ...COMMAND_HANDLERS,
    ...REPOSITORIES,
    ...BUILDERS,
    ...MAPPERS,
  ],
})
export class AuditLogContextModule {}
