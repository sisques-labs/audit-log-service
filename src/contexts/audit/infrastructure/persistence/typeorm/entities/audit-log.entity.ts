import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('audit_logs')
@Index('IDX_audit_logs_topic', ['topic'])
@Index('IDX_audit_logs_event_type', ['eventType'])
@Index('IDX_audit_logs_aggregate_root_id', ['aggregateRootId'])
@Index('IDX_audit_logs_occurred_at', ['occurredAt'])
export class AuditLogTypeOrmEntity {
  @PrimaryColumn({ type: 'uuid' })
  id!: string;

  @Column({ name: 'event_id', type: 'varchar', length: 255, nullable: false })
  eventId!: string;

  @Column({ name: 'event_type', type: 'varchar', length: 255, nullable: false })
  eventType!: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  topic!: string;

  @Column({
    name: 'aggregate_root_id',
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  aggregateRootId!: string;

  @Column({
    name: 'aggregate_root_type',
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  aggregateRootType!: string;

  @Column({ name: 'entity_id', type: 'varchar', length: 255, nullable: false })
  entityId!: string;

  @Column({
    name: 'entity_type',
    type: 'varchar',
    length: 255,
    nullable: false,
  })
  entityType!: string;

  @Column({ name: 'occurred_at', type: 'timestamptz', nullable: false })
  occurredAt!: Date;

  @Column({ type: 'jsonb', nullable: false, default: {} })
  payload!: Record<string, unknown>;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt!: Date;
}
