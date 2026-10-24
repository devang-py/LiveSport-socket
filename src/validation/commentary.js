import { z } from 'zod';

export const createCommentarySchema = z.object({
  minute: z.number().int().nonnegative().optional(),
  sequence: z.number().int().nonnegative(),
  period: z.string().min(1).optional(),
  eventType: z.string().min(1),
  actor: z.string().min(1).optional(),
  team: z.string().min(1).optional(),
  message: z.string().min(1),
  metadata: z.record(z.string(), z.any()).optional(),
  tags: z.array(z.string()).optional(),
});
