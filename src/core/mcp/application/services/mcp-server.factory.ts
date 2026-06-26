import {
  MCP_SERVER_NAME,
  MCP_SERVER_VERSION,
} from '@/core/mcp/domain/constants/mcp-tool.constants';
import { IMcpToolContext } from '@/core/mcp/domain/interfaces/mcp-tool-context.interface';
import { McpToolRegistry } from '@/core/mcp/application/services/mcp-tool-registry.service';
import { Injectable } from '@nestjs/common';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

/**
 * Builds a fresh {@link McpServer} for each incoming MCP request (stateless
 * Streamable HTTP). Every tool registered on the server is dispatched through
 * the CQRS bus, so the server itself stays a thin transport wrapper.
 */
@Injectable()
export class McpServerFactory {
  constructor(private readonly toolRegistry: McpToolRegistry) {}

  create(context: IMcpToolContext): McpServer {
    const server = new McpServer({
      name: MCP_SERVER_NAME,
      version: MCP_SERVER_VERSION,
    });

    for (const tool of this.toolRegistry.getTools()) {
      server.registerTool(
        tool.name,
        {
          title: tool.title,
          description: tool.description,
          inputSchema: tool.inputSchema,
        },
        (args: Record<string, unknown>) => tool.execute(args, context),
      );
    }

    return server;
  }
}
