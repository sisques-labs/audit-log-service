import '@sisques-labs/nestjs-kit/registered-enums';

import { AuditModule } from '@/contexts/audit/audit.module';
import { postgresConfig } from '@/core/config/postgres.config';
import { BaseExceptionFilter } from '@/core/filters/base-exception.filter';
import { MessagingModule } from '@/core/messaging/messaging.module';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { join } from 'path';
import { HealthModule } from './health/health.module';
import { SupportModule } from './support/support.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
      load: [postgresConfig],
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) =>
        config.getOrThrow<TypeOrmModuleOptions>('postgres'),
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      playground: false,
      plugins:
        process.env.NODE_ENV === 'production'
          ? []
          : [ApolloServerPluginLandingPageLocalDefault()],
    }),
    HealthModule,
    SupportModule,
    AuditModule,
    MessagingModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: BaseExceptionFilter,
    },
  ],
})
export class AppModule {}
