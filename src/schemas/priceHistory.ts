import { z } from 'zod';
import { SourceReceiptSchema } from './sourceReceipt';

/**
 * PriceHistory schema — price or value movement (design §4.2).
 *
 * Answers "is this a good time?" by showing the current figure against what
 * is typical, plus the trend. The `typical` band is what makes a single
 * number meaningful — a price is only high or low relative to its history.
 * Its one action is to set an alert (§4.2). React-free (§4.5).
 */

export const PricePointSchema = z.object({
  /** ISO 8601 date/time of this observation. */
  at: z.string().min(1),
  value: z.number().nonnegative(),
});
export type PricePoint = z.infer<typeof PricePointSchema>;

export const PriceHistorySchema = z.object({
  /** Whether the series is in points or cash. */
  unit: z.enum(['points', 'cash']),
  /** Currency when unit is cash. */
  currency: z.string().min(1).optional(),
  /** Short label — "SYD → NRT business, Aeroplan". */
  label: z.string().min(1).optional(),
  /** The series, oldest to newest, at least two points. */
  series: z.array(PricePointSchema).min(2),
  /** The current figure (usually the last series value). */
  current: z.number().nonnegative(),
  /** The typical range — the band a single number is judged against. */
  typical: z
    .object({
      low: z.number().nonnegative(),
      high: z.number().nonnegative(),
    })
    .optional(),
  trend: z.enum(['up', 'down', 'flat']).optional(),
  receipt: SourceReceiptSchema.optional(),
});
export type PriceHistoryData = z.infer<typeof PriceHistorySchema>;
