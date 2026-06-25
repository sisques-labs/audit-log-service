import { IAuditLogViewModelDto } from '@/contexts/audit/domain/dtos/view-models/audit-log-view-model.dto';
import { AuditLogPrimitives } from '@/contexts/audit/domain/primitives/audit-log.primitives';
import { BaseViewModel } from '@sisques-labs/nestjs-kit';

export class AuditLogViewModel extends BaseViewModel {
  private _eventId: string;
  private _eventType: string;
  private _topic: string;
  private _aggregateRootId: string;
  private _aggregateRootType: string;
  private _entityId: string;
  private _entityType: string;
  private _occurredAt: Date;
  private _payload: Record<string, any>;

  constructor(props: IAuditLogViewModelDto) {
    super(props);
    this._eventId = props.eventId;
    this._eventType = props.eventType;
    this._topic = props.topic;
    this._aggregateRootId = props.aggregateRootId;
    this._aggregateRootType = props.aggregateRootType;
    this._entityId = props.entityId;
    this._entityType = props.entityType;
    this._occurredAt = props.occurredAt;
    this._payload = props.payload;
  }

  public static fromPrimitives(
    primitives: AuditLogPrimitives,
  ): AuditLogViewModel {
    return new AuditLogViewModel({
      id: primitives.id,
      eventId: primitives.eventId,
      eventType: primitives.eventType,
      topic: primitives.topic,
      aggregateRootId: primitives.aggregateRootId,
      aggregateRootType: primitives.aggregateRootType,
      entityId: primitives.entityId,
      entityType: primitives.entityType,
      occurredAt: primitives.occurredAt,
      payload: primitives.payload,
      createdAt: primitives.createdAt,
      updatedAt: primitives.updatedAt,
    });
  }

  public get eventId(): string {
    return this._eventId;
  }

  public get eventType(): string {
    return this._eventType;
  }

  public get topic(): string {
    return this._topic;
  }

  public get aggregateRootId(): string {
    return this._aggregateRootId;
  }

  public get aggregateRootType(): string {
    return this._aggregateRootType;
  }

  public get entityId(): string {
    return this._entityId;
  }

  public get entityType(): string {
    return this._entityType;
  }

  public get occurredAt(): Date {
    return this._occurredAt;
  }

  public get payload(): Record<string, any> {
    return this._payload;
  }
}
