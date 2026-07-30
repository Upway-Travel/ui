import { z } from 'zod';
import { OptionSchema } from './option';

/**
 * Comparison schema — a decision across 2 to 4 choices (design §4.2).
 * Composes Option: the same objects, now aligned so the trade-off is
 * visible at a glance.
 *
 * Recommendation-first (§3.2 trust stack): the widget leads with what Upway
 * believes the traveller should do and the reason that decided it, then
 * lets the expert inspect the aligned data. It never presents a dashboard of
 * equal-weight possibilities — Maddie needs an answer, not a result set (§7.1).
 */

export const ComparisonSchema = z.object({
  options: z.array(OptionSchema).min(2).max(4),
  /** Index into options[] Upway recommends. Omit only if genuinely a toss-up. */
  recommendedIndex: z.number().int().nonnegative().optional(),
  /** The two or three facts that decided the recommendation (§3.2). */
  reason: z.string().min(1).optional(),
  /** What the trade-off turns on — "value", "speed", "certainty". */
  axis: z.string().min(1).optional(),
});

export type ComparisonData = z.infer<typeof ComparisonSchema>;
