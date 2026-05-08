# audit-log-service

Immutable event store that captures every domain event from the system. Subscribes to all Kafka topics automatically, persists events as audit log records, and provides a read-only query interface for compliance, debugging, and analytics.

## Tech Stack

- **NestJS 10** — CQRS, DDD, Hexagonal Architecture
- **MongoDB** — append-only persistence (write-once, never updated)
- **GraphQL** (Apollo Server 4) + **REST** (read-only)
- **Kafka** + **Confluent Schema Registry** (Avro + JSON fallback) — event consumption
- **pnpm** — package manager

## Getting Started

```bash
pnpm install
cp .env.example .env   # fill in required values
pnpm start:dev
```

## Environment Variables

| Variable | Default | Required | Description |
|---|---|---|---|
| `PORT` | `3001` | | HTTP server port |
| `APP_NAME` | `audit-log-service` | | Service identifier |
| `LOG_LEVEL` | `info` | | Winston log level |
| `MONGODB_URI` | `mongodb://localhost:27017` | ✓ | MongoDB connection string |
| `MONGODB_DATABASE` | `audit-log-service` | | Database name |
| `KAFKA_BROKERS` | `localhost:9092` | ✓ | Comma-separated Kafka brokers |
| `KAFKA_CLIENT_ID` | `audit-log-service` | | Kafka client identifier |
| `KAFKA_CONSUMER_GROUP_ID` | `audit-log-consumer-group` | | Kafka consumer group |
| `SCHEMA_REGISTRY_HOST` | `http://localhost:8081` | | Confluent Schema Registry URL |
| `NODE_AUTH_TOKEN` | | ✓ | GitHub token with `read:packages` for `@sisques-labs` packages |

## API

### REST

| Method | Path | Description |
|---|---|---|
| `GET` | `/audit-logs` | List audit logs (query: `page`, `perPage`) |
| `GET` | `/audit-logs/:id` | Get audit log entry by ID |

### GraphQL

```graphql
# Queries
auditLog(id: String!): AuditLogResponseDto
auditLogs(criteria: BaseFindByCriteriaInput): PaginatedAuditLogResultDto
```

## Domain

### AuditLog Aggregate (immutable)

```typescript
{
  id: string;                        // UUID of the audit record
  eventId: string;                   // source event ID
  eventType: string;                 // e.g. "PromptCreatedEvent"
  topic: string;                     // Kafka topic where event was consumed
  aggregateRootId: string;           // domain aggregate ID
  aggregateRootType: string;         // e.g. "PromptAggregate"
  entityId: string;
  entityType: string;
  occurredAt: Date;                  // when the original event happened
  payload: Record<string, unknown>;  // full original event payload
  createdAt: Date;
  updatedAt: Date;
}
```

### Kafka Consumption

At startup the service calls `listTopics()` and subscribes to **every non-system topic** (excludes topics prefixed with `_`). Any new service that publishes to Kafka is automatically captured without configuration changes.

**Decoding strategy:**
1. Attempt Avro decode via Schema Registry
2. Fall back to JSON if Avro fails

## Development

```bash
pnpm start:dev      # watch mode
pnpm test           # unit tests
pnpm test:cov       # coverage
pnpm test:e2e       # e2e tests
pnpm lint           # ESLint --fix
pnpm build          # production build
```

### Git Hooks

Installed via **Husky**:

- **pre-commit** — `lint-staged`: runs ESLint `--fix` on staged `.ts` files
- **pre-push** — runs `pnpm build && pnpm test`

## Architecture

```
src/
├── context/
│   └── audit-log-context/
│       ├── application/      # CreateAuditLog command, queries
│       ├── domain/           # aggregate, value objects, repository interface
│       └── infrastructure/   # MongoDB repository, mapper
├── kafka/                    # consumer (auto-discovers all topics)
└── support/                  # logging, config
```

### Event Capture Flow

```
Kafka topic (any) → KafkaConsumerService → CreateAuditLogCommand → AuditLogAggregate → MongoDB
```

Follows **DDD + CQRS + Hexagonal Architecture** per [sisques-labs NestJS conventions](https://github.com/sisques-labs/ai-registry).
