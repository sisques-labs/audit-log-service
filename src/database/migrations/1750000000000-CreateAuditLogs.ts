import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateAuditLogs1750000000000 implements MigrationInterface {
  name = 'CreateAuditLogs1750000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "audit_logs" (
        "id" uuid NOT NULL,
        "event_id" character varying(255) NOT NULL,
        "event_type" character varying(255) NOT NULL,
        "topic" character varying(255) NOT NULL,
        "aggregate_root_id" character varying(255) NOT NULL,
        "aggregate_root_type" character varying(255) NOT NULL,
        "entity_id" character varying(255) NOT NULL,
        "entity_type" character varying(255) NOT NULL,
        "occurred_at" TIMESTAMP WITH TIME ZONE NOT NULL,
        "payload" jsonb NOT NULL DEFAULT '{}',
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        CONSTRAINT "PK_audit_logs" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(
      `CREATE INDEX "IDX_audit_logs_topic" ON "audit_logs" ("topic")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_audit_logs_event_type" ON "audit_logs" ("event_type")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_audit_logs_aggregate_root_id" ON "audit_logs" ("aggregate_root_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_audit_logs_occurred_at" ON "audit_logs" ("occurred_at")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_audit_logs_occurred_at"`);
    await queryRunner.query(`DROP INDEX "IDX_audit_logs_aggregate_root_id"`);
    await queryRunner.query(`DROP INDEX "IDX_audit_logs_event_type"`);
    await queryRunner.query(`DROP INDEX "IDX_audit_logs_topic"`);
    await queryRunner.query(`DROP TABLE "audit_logs"`);
  }
}
