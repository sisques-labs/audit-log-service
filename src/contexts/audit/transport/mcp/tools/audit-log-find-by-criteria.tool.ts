import { AuditLogFindByCriteriaQuery } from '@/contexts/audit/application/queries/find-by-criteria/audit-log-find-by-criteria.query';
import { auditLogFindByCriteriaSchema } from '@/contexts/audit/transport/mcp/schemas/audit-log-find-by-criteria.schema';
import { McpTool } from '@/core/mcp/domain/decorators/mcp-tool.decorator';
import { IMcpTool } from '@/core/mcp/domain/interfaces/mcp-tool.interface';
import { Injectable, Logger } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { Criteria } from '@sisques-labs/nestjs-kit';

@McpTool()
@Injectable()
export class AuditLogFindByCriteriaMcpTool implements IMcpTool {
  private readonly logger = new Logger(AuditLogFindByCriteriaMcpTool.name);

  readonly name = 'audit_log_find_by_criteria';
  readonly title = 'List audit logs';
  readonly description =
    'Returns a paginated list of audit logs ordered by most recent first.';
  readonly inputSchema = auditLogFindByCriteriaSchema;

  constructor(private readonly queryBus: QueryBus) {}

  async execute(args: Record<string, unknown>): Promise<CallToolResult> {
    const { page, perPage } = args as { page?: number; perPage?: number };
    this.logger.log(
      `Finding audit logs: page=${page ?? '-'} perPage=${perPage ?? '-'}`,
    );

    const criteria = new Criteria([], [], {
      page: page ?? 1,
      perPage: perPage ?? 20,
    });

    const result = await this.queryBus.execute(
      new AuditLogFindByCriteriaQuery({ criteria }),
    );

    return { content: [{ type: 'text', text: JSON.stringify(result) }] };
  }
}
