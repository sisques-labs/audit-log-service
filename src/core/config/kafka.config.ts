import { registerAs } from '@nestjs/config';

import {
  KAFKA_CLIENT_ID,
  KAFKA_CONSUMER_GROUP_ID,
} from '@/core/messaging/infrastructure/kafka/kafka.constants';

/**
 * Kafka configuration for the audit-log consumer.
 *
 * The consumer discovers every topic at startup and subscribes only to those
 * whose name starts with one of the configured `topicPrefixes` (a comma-separated
 * list in `KAFKA_TOPIC_PREFIXES`, e.g. `gardenia-api,identity-service`).
 * When the list is empty no topic is consumed — prefixes are opt-in on purpose so
 * the service never accidentally drains the whole cluster.
 */
export type KafkaSaslMechanism = 'plain' | 'scram-sha-256' | 'scram-sha-512';

export interface IKafkaSaslConfig {
  mechanism: KafkaSaslMechanism;
  username: string;
  password: string;
}

export interface IKafkaConfig {
  enabled: boolean;
  clientId: string;
  groupId: string;
  brokers: string[];
  /** Topics are consumed when their name starts with any of these prefixes. */
  topicPrefixes: string[];
  ssl: boolean;
  sasl: IKafkaSaslConfig | null;
}

function parseList(raw: string | undefined): string[] {
  return (raw ?? '')
    .split(',')
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
}

function resolveSasl(): IKafkaSaslConfig | null {
  const username = process.env.KAFKA_SASL_USERNAME?.trim();
  const password = process.env.KAFKA_SASL_PASSWORD?.trim();
  if (!username || !password) {
    return null;
  }
  const mechanism = (process.env.KAFKA_SASL_MECHANISM?.trim() ||
    'plain') as KafkaSaslMechanism;
  return { mechanism, username, password };
}

export const kafkaConfig = registerAs('kafka', (): IKafkaConfig => {
  return {
    enabled: process.env.KAFKA_ENABLED !== 'false',
    clientId: process.env.KAFKA_CLIENT_ID?.trim() || KAFKA_CLIENT_ID,
    groupId:
      process.env.KAFKA_CONSUMER_GROUP_ID?.trim() || KAFKA_CONSUMER_GROUP_ID,
    brokers: parseList(process.env.KAFKA_BROKERS),
    topicPrefixes: parseList(process.env.KAFKA_TOPIC_PREFIXES),
    ssl: process.env.KAFKA_SSL === 'true',
    sasl: resolveSasl(),
  };
});
