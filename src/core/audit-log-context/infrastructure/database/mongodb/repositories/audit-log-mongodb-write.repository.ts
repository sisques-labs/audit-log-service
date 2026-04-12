import { AuditLogAggregate } from '@/core/audit-log-context/domain/aggregates/audit-log/audit-log.aggregate';
import { IAuditLogWriteRepository } from '@/core/audit-log-context/domain/repositories/audit-log-write.repository';
import { AuditLogMongoDbDto } from '@/core/audit-log-context/infrastructure/database/mongodb/dtos/audit-log-mongodb.dto';
import { AuditLogMongoDBMapper } from '@/core/audit-log-context/infrastructure/database/mongodb/mappers/audit-log-mongodb.mapper';
import { Injectable, Logger } from '@nestjs/common';
import {
  BaseMongoDatabaseRepository,
  Criteria,
  MongoService,
  PaginatedResult,
} from '@sisques-labs/nestjs-kit';

@Injectable()
export class AuditLogMongoWriteRepository
  extends BaseMongoDatabaseRepository
  implements IAuditLogWriteRepository
{
  private readonly collectionName = 'audit-logs';

  constructor(
    mongoService: MongoService,
    private readonly auditLogMongoDBMapper: AuditLogMongoDBMapper,
  ) {
    super(mongoService);
    this.logger = new Logger(AuditLogMongoWriteRepository.name);
  }

  async findById(id: string): Promise<AuditLogAggregate | null> {
    this.logger.log(`Finding audit log by id: ${id}`);

    const collection = this.mongoService.getCollection(this.collectionName);

    const doc = (await collection.findOne({ id })) as unknown as AuditLogMongoDbDto | null;

    return doc ? this.auditLogMongoDBMapper.toAggregate(doc) : null;
  }

  async findByCriteria(criteria: Criteria): Promise<PaginatedResult<AuditLogAggregate>> {
    this.logger.log(`Finding audit logs by criteria: ${JSON.stringify(criteria)}`);

    const collection = this.mongoService.getCollection(this.collectionName);

    const mongoQuery = this.buildMongoQuery(criteria);
    const sortQuery = this.buildSortQuery(criteria);

    const { page, limit, skip } = await this.calculatePagination(criteria);

    const [items, total] = await this.executeQueryWithPagination(
      collection,
      mongoQuery,
      sortQuery,
      skip,
      limit,
    );

    const auditLogs = items.map((doc) =>
      this.auditLogMongoDBMapper.toAggregate(doc as unknown as AuditLogMongoDbDto),
    );

    return new PaginatedResult<AuditLogAggregate>(auditLogs, total, page, limit);
  }

  async save(aggregate: AuditLogAggregate): Promise<AuditLogAggregate> {
    this.logger.log(`Saving audit log with id: ${aggregate.id.value}`);

    const collection = this.mongoService.getCollection(this.collectionName);
    const mongoData = this.auditLogMongoDBMapper.fromAggregateToMongoData(aggregate);

    await collection.replaceOne({ id: aggregate.id.value }, mongoData, { upsert: true });

    return aggregate;
  }

  async delete(id: string): Promise<void> {
    this.logger.log(`Deleting audit log with id: ${id}`);

    const collection = this.mongoService.getCollection(this.collectionName);
    await collection.deleteOne({ id });
  }
}
