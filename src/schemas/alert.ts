import { z } from 'zod';
import { SourceReceiptSchema } from './sourceReceipt';

/**
 * Alert schema — something changed (design §4.2).
 *
 * The devaluation/expiry/price-move signal: the holder's points move against
 * them silently, and an open alert is a reason to return (§14, retention).
 * An alert states its severity, the consequence for the holder in plain
 * terms, and exactly one next action — never a wall of options. React-free.
 */

export const AlertSeveritySchema = z.enum(['info', 'watch', 'urgent']);
export type AlertSeverity = z.infer<typeof AlertSeveritySchema>;

export const AlertSchema = z.object({
  severity: AlertSeveritySchema,
  /** Short headline — "Aeroplan devalues 1 August". */
  title: z.string().min(1),
  /** What it means for this holder, in plain terms (§13). */
  consequence: z.string().min(1),
  /** When it bites — ISO 8601 or a human phrase. Drives the countdown tone. */
  deadline: z.string().min(1).optional(),
  /** Exactly one next action (§4.2). */
  action: z.object({ label: z.string().min(1) }).optional(),
  /** Evidence for the change (§4.6.2). */
  receipt: SourceReceiptSchema.optional(),
});
export type AlertData = z.infer<typeof AlertSchema>;
