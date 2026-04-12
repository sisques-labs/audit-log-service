import { Criteria } from '@sisques-labs/nestjs-kit';

export class AuditLogFindByCriteriaQuery {
  public readonly criteria: Criteria;

  constructor(props: { criteria: Criteria }) {
    this.criteria = props.criteria;
  }
}
