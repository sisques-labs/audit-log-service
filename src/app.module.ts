import '@sisques-labs/nestjs-kit/registered-enums';

import { CoreModule } from '@/core/core.module';
import { SupportModule } from '@/support/support.module';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { HealthModule } from './health/health.module';
import { KafkaModule } from './kafka/kafka.module';

const FEATURES = [CoreModule];
const SUPPORT = [SupportModule];

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
    KafkaModule,
    ...FEATURES,
    ...SUPPORT,
  ],
})
export class AppModule {}
