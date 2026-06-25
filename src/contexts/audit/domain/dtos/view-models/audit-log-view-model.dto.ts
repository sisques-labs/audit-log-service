export interface IAuditLogViewModelDto {
  id: string;
  eventId: string;
  eventType: string;
  topic: string;
  aggregateRootId: string;
  aggregateRootType: string;
  entityId: string;
  entityType: string;
  occurredAt: Date;
  payload: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}
