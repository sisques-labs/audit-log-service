import { join } from 'path';
import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

/**
 * TypeORM / PostgreSQL configuration for the audit-log store.
 *
 * Entities are auto-loaded from the feature modules (`autoLoadEntities`).
 * Migrations run on boot by default; set `DATABASE_MIGRATIONS_RUN=false` to opt out.
 */
export const postgresConfig = registerAs(
  'postgres',
  (): TypeOrmModuleOptions => ({
    type: (process.env.DATABASE_DRIVER ?? 'postgres') as 'postgres',
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT ?? '5432', 10),
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_DATABASE,
    synchronize: process.env.DATABASE_SYNCHRONIZE === 'true',
    autoLoadEntities: true,
    migrationsRun: process.env.DATABASE_MIGRATIONS_RUN !== 'false',
    migrations: [join(__dirname, '../../database/migrations/*{.ts,.js}')],
  }),
);
