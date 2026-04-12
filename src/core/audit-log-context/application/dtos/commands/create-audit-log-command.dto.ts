export interface ICreateAuditLogCommandDto {
  eventId: string;
  eventType: string;
  topic: string;
  aggregateRootId: string;
  aggregateRootType: string;
  entityId: string;
  entityType: string;
  occurredAt: Date | string;
  payload: Record<string, any>;
}
