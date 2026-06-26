/**
 * Per-request context handed to every MCP tool.
 *
 * The audit-log service is unauthenticated and not multi-tenant, so there is no
 * user/space identity to carry. The type is kept (empty) so the transport, the
 * server factory and the tool contract stay symmetric with the rest of the
 * platform and can grow a real context later without a breaking change.
 */
export type IMcpToolContext = Record<string, never>;
