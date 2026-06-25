import { kafkaConfig } from '@/core/config/kafka.config';
import { KafkaConsumerService } from '@/core/messaging/infrastructure/kafka/kafka-consumer.service';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';
import { SchemaRegistryModule } from '@sisques-labs/nestjs-kit';

/**
 * Wires the inbound Kafka consumer that turns domain events into audit logs.
 *
 * The consumer subscribes to every topic whose name starts with one of the
 * `KAFKA_TOPIC_PREFIXES`, decodes the payload (Avro via Schema Registry, JSON
 * fallback) and dispatches a `CreateAuditLogCommand` through the CQRS bus.
 */
@Module({
  imports: [
    CqrsModule,
    ConfigModule.forFeature(kafkaConfig),
    SchemaRegistryModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        host: configService.get<string>(
          'SCHEMA_REGISTRY_HOST',
          'http://localhost:8081',
        ),
      }),
    }),
  ],
  providers: [KafkaConsumerService],
  exports: [KafkaConsumerService],
})
export class MessagingModule {}
