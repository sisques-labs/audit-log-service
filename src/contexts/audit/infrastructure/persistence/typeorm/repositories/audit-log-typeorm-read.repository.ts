import { IAuditLogReadRepository } from '@/contexts/audit/domain/repositories/read/audit-log-read.repository';
import { AuditLogViewModel } from '@/contexts/audit/domain/view-models/audit-log/audit-log.view-model';
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
export class AuditLogTypeOrmReadRepository
  extends BaseDatabaseRepository
  implements IAuditLogReadRepository
{
  constructor(
    @InjectRepository(AuditLogTypeOrmEntity)
    private readonly repository: Repository<AuditLogTypeOrmEntity>,
    private readonly mapper: AuditLogTypeOrmMapper,
  ) {
    super();
  }

  async findById(id: string): Promise<AuditLogViewModel | null> {
    const entity = await this.repository.findOne({ where: { id } });
    return entity ? this.mapper.toViewModel(entity) : null;
  }

  async findByCriteria(
    criteria: Criteria,
  ): Promise<PaginatedResult<AuditLogViewModel>> {
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
    const items = entities.map((entity) => this.mapper.toViewModel(entity));

    return new PaginatedResult(items, total, page, limit);
  }

  // Audit logs are append-only; reads never persist. Present to satisfy the read port.
  async save(): Promise<void> {}

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
