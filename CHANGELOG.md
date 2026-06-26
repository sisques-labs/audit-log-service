# Changelog

All notable changes to this project will be documented in this file.
## [0.1.0-alpha.1] - 2026-06-25

### Bug Fixes
- **audit:** Insert audit logs instead of save to guarantee persistence (936afe3)

### Chore
- **deps:** Upgrade nestjs-kit to 0.10.2, add pg and TypeORM migration scripts (3385127)
- **env:** Update default PORT in .env.example from 3001 to 3002 (f8032fe)
- **schema:** Remove health query from GraphQL schema (0e10f86)

### Features
- **audit:** Replace MongoDB with PostgreSQL/TypeORM, align to inventory pattern (273882b)
- **audit:** Expose audit-log queries as MCP tools (0a6f105)
- **health:** Replace GraphQL health resolver with gardenia REST health module (ab881ac)

### Refactor
- **messaging:** Remove schema registry, consume plain JSON event envelopes (acda98c)
- **audit:** Extend BaseBuilder in AuditLogAggregateBuilder and use it in the mapper (a67d95d)
## [0.1.0-alpha.0] - 2026-06-25

### Bug Fixes
- **ci:** Add packageManager field for pnpm auto-detection in CI (8359d86)
- **ci:** Remove NODE_AUTH_TOKEN and secret mount for public npm packages (205514c)
- **docker:** Guard husky prepare script so pnpm prune --prod succeeds (0da492a)

### CI
- Add CI workflow, Docker release, Dockerfile and .npmrc (cc64bd0)

### Chore
- First commit (db0829e)
- Update package.json and pnpm-lock.yaml with new dependencies, enhance build scripts, and configure TypeScript paths (98ecbcc)
- Update @sisques-labs/nestjs-kit to version 0.7.0 and add @kafkajs/confluent-schema-registry as a new dependency (7012958)
- Update @sisques-labs/nestjs-kit to version 0.7.1, add @nestjs/axios as a new dependency, and remove duplicate entries in package.json (43894ce)
- Add SCHEMA_REGISTRY_HOST to .env.example for Kafka integration (6145762)
- Add husky pre-commit lint-staged and pre-push build+test (333a7b3)

### Documentation
- Rewrite README with architecture, API, env vars and dev workflow (1424df6)

### Features
- Integrate Schema Registry for Kafka consumer to handle Avro messages (09246bb)
- Align structure with gardenia-api and consume Kafka topics by prefix (4df6647)

