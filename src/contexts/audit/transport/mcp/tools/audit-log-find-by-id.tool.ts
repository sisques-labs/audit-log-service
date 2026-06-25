import { AuditLogFindByIdQuery } from '@/contexts/audit/application/queries/find-by-id/audit-log-find-by-id.query';
import { auditLogFindByIdSchema } from '@/contexts/audit/transport/mcp/schemas/audit-log-find-by-id.schema';
import { McpTool } from '@/core/mcp/domain/decorators/mcp-tool.decorator';
import { IMcpTool } from '@/core/mcp/domain/interfaces/mcp-tool.interface';
import { Injectable, Logger } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { CallToolResult } from '@modelcontextprotocol/sdk/types.js';

@McpTool()
@Injectable()
export class AuditLogFindByIdMcpTool implements IMcpTool {
  private readonly logger = new Logger(AuditLogFindByIdMcpTool.name);

  readonly name = 'audit_log_find_by_id';
  readonly title = 'Find audit log by id';
  readonly description = 'Returns a single audit log by its id.';
  readonly inputSchema = auditLogFindByIdSchema;

  constructor(private readonly queryBus: QueryBus) {}

  async execute(args: Record<string, unknown>): Promise<CallToolResult> {
    const { id } = args as { id: string };
    this.logger.log(`Finding audit log by id: ${id}`);

    const result = await this.queryBus.execute(
      new AuditLogFindByIdQuery({ id }),
    );

    return {
      content: [{ type: 'text', text: JSON.stringify(result ?? null) }],
    };
  }
}
