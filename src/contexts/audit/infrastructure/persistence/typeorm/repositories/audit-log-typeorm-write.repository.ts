import { AuditLogAggregate } from '@/contexts/audit/domain/aggregates/audit-log/audit-log.aggregate';
import { IAuditLogWriteRepository } from '@/contexts/audit/domain/repositories/write/audit-log-write.repository';
import { AuditLogTypeOrmEntity } from '@/contexts/audit/infrastructure/persistence/typeorm/entities/audit-log.entity';
import { AuditLogTypeOrmMapper } from '@/contexts/audit/infrastructure/persistence/typeorm/mappers/audit-log-typeorm.mapper';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  BaseDatabaseRepository,
  Criteria,
  FilterOperator,
  PaginatedResult,
} from '@sisques-labs/nestjs-kit';
import { Repository } from 'typeorm';

@Injectable()
export class AuditLogTypeOrmWriteRepository
  extends BaseDatabaseRepository
  implements IAuditLogWriteRepository
{
  constructor(
    @InjectRepository(AuditLogTypeOrmEntity)
    private readonly repository: Repository<AuditLogTypeOrmEntity>,
    private readonly mapper: AuditLogTypeOrmMapper,
  ) {
    super();
  }

  async findById(id: string): Promise<AuditLogAggregate | null> {
    const entity = await this.repository.findOne({ where: { id } });
    return entity ? this.mapper.toAggregate(entity) : null;
  }

  async findByCriteria(
    criteria: Criteria,
  ): Promise<PaginatedResult<AuditLogAggregate>> {
    const { page, limit, skip } = await this.calculatePagination(criteria);

    const qb = this.repository.createQueryBuilder('log');

    for (const filter of criteria.filters) {
      if (filter.operator === FilterOperator.LIKE) {
        qb.andWhere(`LOWER(log.${filter.field}) LIKE :${filter.field}`, {
          [filter.field]: `%${String(filter.value).toLowerCase()}%`,
        });
      } else {
        qb.andWhere(`log.${filter.field} = :${filter.field}`, {
          [filter.field]: filter.value,
        });
      }
    }

    qb.orderBy('log.occurred_at', 'DESC').skip(skip).take(limit);

    const [entities, total] = await qb.getManyAndCount();
    const items = entities.map((entity) => this.mapper.toAggregate(entity));

    return new PaginatedResult(items, total, page, limit);
  }

  async save(aggregate: AuditLogAggregate): Promise<AuditLogAggregate> {
    const entity = this.mapper.toEntity(aggregate);
    await this.repository.save(entity);
    return this.mapper.toAggregate(entity);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
