export class AuditLogFindByIdQuery {
  public readonly id: string;

  constructor(props: { id: string }) {
    this.id = props.id;
  }
}
