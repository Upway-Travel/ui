import { z } from 'zod';

/**
 * Timeline schema — a sequence of events (design §4.2).
 *
 * Two jobs: it shows the agent's work as it happens ("checking award space",
 * "comparing transfer paths", "verifying taxes") so latency reads as visible
 * effort rather than a spinner (§7.1); and it records a sequence of world
 * events with their order and status (§14, the Event weight). A step can note
 * a CHANGED ASSUMPTION so the reader sees what shifted mid-flow. React-free.
 */

export const TimelineStepStatusSchema = z.enum(['done', 'active', 'pending', 'failed', 'skipped']);
export type TimelineStepStatus = z.infer<typeof TimelineStepStatusSchema>;

export const TimelineStepSchema = z.object({
  label: z.string().min(1),
  status: TimelineStepStatusSchema,
  /** A short detail — "4 seats found", "no space on the 12th". */
  detail: z.string().min(1).optional(),
  /** A changed assumption surfaced at this step (§4.2). */
  note: z.string().min(1).optional(),
  /** ISO 8601 or a relative label for when this step happened. */
  at: z.string().min(1).optional(),
});
export type TimelineStep = z.infer<typeof TimelineStepSchema>;

export const TimelineSchema = z.object({
  title: z.string().min(1).optional(),
  steps: z.array(TimelineStepSchema).min(1),
});
export type TimelineData = z.infer<typeof TimelineSchema>;
