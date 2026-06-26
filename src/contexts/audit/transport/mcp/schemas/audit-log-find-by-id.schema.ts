import { z } from 'zod';

/** Input schema for the `audit_log_find_by_id` MCP tool. */
export const auditLogFindByIdSchema = {
  id: z.string().uuid().describe('Id of the audit log'),
};
