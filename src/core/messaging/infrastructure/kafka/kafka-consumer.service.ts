import { kafkaConfig } from '@/core/config/kafka.config';
import { CreateAuditLogCommand } from '@/contexts/audit/application/commands/create-audit-log/create-audit-log.command';
import {
  Inject,
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { CommandBus } from '@nestjs/cqrs';
import { SchemaRegistryService } from '@sisques-labs/nestjs-kit';
import { Admin, Consumer, Kafka, KafkaMessage, SASLOptions } from 'kafkajs';

@Injectable()
export class KafkaConsumerService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(KafkaConsumerService.name);

  private kafka: Kafka;
  private admin: Admin;
  private consumer: Consumer;

  constructor(
    @Inject(kafkaConfig.KEY)
    private readonly config: ConfigType<typeof kafkaConfig>,
    private readonly commandBus: CommandBus,
    private readonly schemaRegistry: SchemaRegistryService,
  ) {}

  async onModuleInit(): Promise<void> {
    if (!this.config.enabled) {
      this.logger.warn(
        'Kafka consumer disabled (KAFKA_ENABLED=false) — not starting',
      );
      return;
    }

    if (this.config.brokers.length === 0) {
      this.logger.warn(
        'KAFKA_BROKERS not configured — Kafka consumer will not start',
      );
      return;
    }

    if (this.config.topicPrefixes.length === 0) {
      this.logger.warn(
        'KAFKA_TOPIC_PREFIXES not configured — consumer will not subscribe to any topic',
      );
      return;
    }

    this.kafka = new Kafka({
      clientId: this.config.clientId,
      brokers: this.config.brokers,
      ssl: this.config.ssl,
      sasl: (this.config.sasl ?? undefined) as SASLOptions | undefined,
      retry: { initialRetryTime: 100, retries: 8 },
      connectionTimeout: 10000,
      requestTimeout: 30000,
    });

    this.admin = this.kafka.admin();
    this.consumer = this.kafka.consumer({
      groupId: this.config.groupId,
      allowAutoTopicCreation: false,
    });

    await this.admin.connect();
    const allTopics = await this.admin.listTopics();
    await this.admin.disconnect();

    const topics = allTopics.filter((topic) => this.matchesPrefix(topic));

    this.logger.log(
      `Discovered ${topics.length} topic(s) matching prefixes [${this.config.topicPrefixes.join(', ')}]: ${topics.join(', ')}`,
    );

    if (topics.length === 0) {
      this.logger.warn(
        'No Kafka topics matched the configured prefixes — consumer will not subscribe',
      );
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

  private matchesPrefix(topic: string): boolean {
    return this.config.topicPrefixes.some((prefix) => topic.startsWith(prefix));
  }

  private async handleMessage(
    topic: string,
    message: KafkaMessage,
  ): Promise<void> {
    if (!message.value) {
      this.logger.warn(`Received empty message on topic ${topic}`);
      return;
    }

    try {
      let raw: Record<string, any>;

      try {
        raw = await this.schemaRegistry.decode<Record<string, any>>(
          message.value,
        );
        // Avro payload uses `data` for the event payload; map to top-level for command
        if (raw.data && typeof raw.data === 'object') {
          raw = { ...raw, ...raw.data };
        }
      } catch {
        this.logger.debug(
          `Topic ${topic}: not an Avro message, falling back to JSON`,
        );
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

      this.logger.debug(
        `Audit log created for event ${command.eventType.value} from topic ${topic}`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to process message from topic ${topic}: ${(error as Error).message}`,
        (error as Error).stack,
      );
    }
  }
}
