import { MCP_TOOL_METADATA } from '@/core/mcp/domain/constants/mcp-tool.constants';
import { SetMetadata } from '@nestjs/common';

/**
 * Marks a provider as an MCP tool.
 *
 * Apply alongside `@Injectable()` on a class implementing `IMcpTool`. The class
 * must still be registered in its bounded-context module's providers (e.g. in a
 * `MCP_TOOLS` array). At bootstrap, {@link McpToolRegistry} discovers every
 * provider carrying this metadata and registers it on the per-request MCP server.
 */
export const McpTool = (): ClassDecorator =>
  SetMetadata(MCP_TOOL_METADATA, true);
