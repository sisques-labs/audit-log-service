import { kafkaConfig } from '@/core/config/kafka.config';
import { KafkaConsumerService } from '@/core/messaging/infrastructure/kafka/kafka-consumer.service';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CqrsModule } from '@nestjs/cqrs';

/**
 * Wires the inbound Kafka consumer that turns domain events into audit logs.
 *
 * The consumer subscribes to every topic whose name starts with one of the
 * `KAFKA_TOPIC_PREFIXES`, parses the plain JSON event envelope and dispatches a
 * `CreateAuditLogCommand` through the CQRS bus.
 */
@Module({
  imports: [CqrsModule, ConfigModule.forFeature(kafkaConfig)],
  providers: [KafkaConsumerService],
  exports: [KafkaConsumerService],
})
export class MessagingModule {}
