import { KafkaConsumerService } from '@/kafka/kafka-consumer.service';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { SchemaRegistryModule } from '@sisques-labs/nestjs-kit';

@Module({
  imports: [
    CqrsModule,
    SchemaRegistryModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        host: configService.get<string>('SCHEMA_REGISTRY_HOST', 'http://localhost:8081'),
      }),
    }),
  ],
  providers: [KafkaConsumerService],
  exports: [KafkaConsumerService],
})
export class KafkaModule {}
