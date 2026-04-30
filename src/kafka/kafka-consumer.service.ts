import { CreateAuditLogCommand } from '@/core/audit-log-context/application/commands/create-audit-log/create-audit-log.command';
import { KAFKA_CLIENT_ID, KAFKA_CONSUMER_GROUP_ID } from '@/kafka/kafka.constants';
import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CommandBus } from '@nestjs/cqrs';
import { SchemaRegistryService } from '@sisques-labs/nestjs-kit';
import { Admin, Consumer, Kafka, KafkaMessage } from 'kafkajs';

@Injectable()
export class KafkaConsumerService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(KafkaConsumerService.name);

  private kafka: Kafka;
  private admin: Admin;
  private consumer: Consumer;

  constructor(
    private readonly configService: ConfigService,
    private readonly commandBus: CommandBus,
    private readonly schemaRegistry: SchemaRegistryService,
  ) {}

  async onModuleInit(): Promise<void> {
    const brokers = this.configService
      .get<string>('KAFKA_BROKERS', '')
      .split(',')
      .map((b) => b.trim())
      .filter(Boolean);

    if (brokers.length === 0) {
      this.logger.warn('KAFKA_BROKERS not configured — Kafka consumer will not start');
      return;
    }

    const clientId = this.configService.get<string>('KAFKA_CLIENT_ID', KAFKA_CLIENT_ID);
    const groupId = this.configService.get<string>('KAFKA_CONSUMER_GROUP_ID', KAFKA_CONSUMER_GROUP_ID);

    this.kafka = new Kafka({
      clientId,
      brokers,
      retry: { initialRetryTime: 100, retries: 8 },
      connectionTimeout: 10000,
      requestTimeout: 30000,
    });

    this.admin = this.kafka.admin();
    this.consumer = this.kafka.consumer({ groupId, allowAutoTopicCreation: false });

    await this.admin.connect();
    const allTopics = await this.admin.listTopics();
    await this.admin.disconnect();

    const topics = allTopics.filter((t) => !t.startsWith('_'));

    this.logger.log(`Discovered ${topics.length} user topics: ${topics.join(', ')}`);

    if (topics.length === 0) {
      this.logger.warn('No Kafka topics found — consumer will not subscribe');
      return;
    }

    await this.consumer.connect();

    for (const topic of topics) {
      await this.consumer.subscribe({ topic, fromBeginning: false });
      this.logger.log(`Subscribed to topic: ${topic}`);
    }

    await this.consumer.run({
      eachMessage: async ({ topic, message }) => {
        await this.handleMessage(topic, message);
      },
    });

    this.logger.log('Kafka consumer running');
  }

  async onModuleDestroy(): Promise<void> {
    if (this.consumer) {
      await this.consumer.disconnect();
    }
  }

  private async handleMessage(topic: string, message: KafkaMessage): Promise<void> {
    if (!message.value) {
      this.logger.warn(`Received empty message on topic ${topic}`);
      return;
    }

    try {
      let raw: Record<string, any>;

      try {
        raw = await this.schemaRegistry.decode<Record<string, any>>(message.value);
        // Avro payload uses `data` for the event payload; map to top-level for command
        if (raw.data && typeof raw.data === 'object') {
          raw = { ...raw, ...raw.data };
        }
      } catch {
        this.logger.debug(`Topic ${topic}: not an Avro message, falling back to JSON`);
        raw = JSON.parse(message.value.toString()) as Record<string, any>;
      }

      const command = new CreateAuditLogCommand({
        eventId: raw.eventId ?? crypto.randomUUID(),
        eventType: raw.eventType ?? 'UnknownEvent',
        topic,
        aggregateRootId: raw.aggregateRootId ?? 'unknown',
        aggregateRootType: raw.aggregateRootType ?? 'unknown',
        entityId: raw.entityId ?? 'unknown',
        entityType: raw.entityType ?? 'unknown',
        occurredAt: raw.ocurredAt ?? raw.occurredAt ?? new Date(),
        payload: raw,
      });

      await this.commandBus.execute(command);

      this.logger.debug(`Audit log created for event ${command.eventType.value} from topic ${topic}`);
    } catch (error) {
      this.logger.error(
        `Failed to process message from topic ${topic}: ${(error as Error).message}`,
        (error as Error).stack,
      );
    }
  }
}
