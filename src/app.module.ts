import '@sisques-labs/nestjs-kit/registered-enums';

import { AuditModule } from '@/contexts/audit/audit.module';
import { MessagingModule } from '@/core/messaging/messaging.module';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
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
    AuditModule,
    MessagingModule,
  ],
})
export class AppModule {}
