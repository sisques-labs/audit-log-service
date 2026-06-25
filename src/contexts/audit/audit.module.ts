import { CreateAuditLogCommandHandler } from '@/contexts/audit/application/commands/create-audit-log/create-audit-log.command-handler';
import { AuditLogFindByCriteriaQueryHandler } from '@/contexts/audit/application/queries/find-by-criteria/audit-log-find-by-criteria.query-handler';
import { AuditLogFindByIdQueryHandler } from '@/contexts/audit/application/queries/find-by-id/audit-log-find-by-id.query-handler';
import { AuditLogAggregateBuilder } from '@/contexts/audit/domain/builders/audit-log/audit-log-aggregate.builder';
import { AUDIT_LOG_WRITE_REPOSITORY_TOKEN } from '@/contexts/audit/domain/repositories/audit-log-write.repository';
import { AuditLogMongoDBMapper } from '@/contexts/audit/infrastructure/database/mongodb/mappers/audit-log-mongodb.mapper';
import { AuditLogMongoWriteRepository } from '@/contexts/audit/infrastructure/database/mongodb/repositories/audit-log-mongodb-write.repository';
import { AuditLogGraphqlMapper } from '@/contexts/audit/transport/graphql/mappers/audit-log-graphql.mapper';
import { AuditLogQueriesResolver } from '@/contexts/audit/transport/graphql/resolvers/audit-log-queries.resolver';
import { AuditLogQueriesController } from '@/contexts/audit/transport/rest/controllers/audit-log-queries.controller';
import { AuditLogRestMapper } from '@/contexts/audit/transport/rest/mappers/audit-log-rest.mapper';
import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { MongoModule } from '@sisques-labs/nestjs-kit';

const RESOLVERS = [AuditLogQueriesResolver];

const QUERY_HANDLERS = [
  AuditLogFindByIdQueryHandler,
  AuditLogFindByCriteriaQueryHandler,
];

const COMMAND_HANDLERS = [CreateAuditLogCommandHandler];

const BUILDERS = [AuditLogAggregateBuilder];

const MAPPERS = [
  AuditLogMongoDBMapper,
  AuditLogGraphqlMapper,
  AuditLogRestMapper,
];

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
export class AuditModule {}
