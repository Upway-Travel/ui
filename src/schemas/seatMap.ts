import { z } from 'zod';
import { CabinSchema } from './option';
import { SourceReceiptSchema } from './sourceReceipt';

/**
 * SeatMap schema — cabin and hard product (design §4.2).
 *
 * The hard-product intelligence surface: the actual cabin the traveller
 * flies, the aircraft variant (the same route can be two different
 * experiences), the configuration, and a seat-quality score. The detailed
 * `rows` grid is optional expert depth; the summary (config + score + note)
 * is the novice view. React-free (§4.5).
 */

export const SeatStatusSchema = z.enum(['available', 'occupied', 'selected', 'blocked']);
export type SeatStatus = z.infer<typeof SeatStatusSchema>;

export const SeatQualitySchema = z.enum(['excellent', 'good', 'fair', 'poor']);
export type SeatQuality = z.infer<typeof SeatQualitySchema>;

export const SeatSchema = z.object({
  /** Seat label — "2A". */
  id: z.string().min(1),
  status: SeatStatusSchema,
  quality: SeatQualitySchema.optional(),
  /** A short note — "bassinet", "extra legroom", "misaligned window". */
  note: z.string().min(1).optional(),
});
export type Seat = z.infer<typeof SeatSchema>;

export const SeatRowSchema = z.object({
  row: z.number().int().positive(),
  seats: z.array(SeatSchema),
});
export type SeatRow = z.infer<typeof SeatRowSchema>;

export const SeatMapSchema = z.object({
  /** Aircraft type — "Boeing 777-300ER". */
  aircraft: z.string().min(1),
  /** Variant that changes the experience — "3-class, 42J reverse herringbone". */
  variant: z.string().min(1).optional(),
  cabin: CabinSchema.optional(),
  /** Seat configuration — "1-2-1", "3-3-3". Drives aisle spacing in the grid. */
  configuration: z.string().min(1).optional(),
  /** Hard-product quality, 0 to 100 (composes ScoreRing). */
  hardProductScore: z.number().min(0).max(100).optional(),
  /** What the score means — "Reverse herringbone, every seat aisle access". */
  hardProductNote: z.string().min(1).optional(),
  /** Optional detailed grid (expert depth). */
  rows: z.array(SeatRowSchema).optional(),
  receipt: SourceReceiptSchema.optional(),
});
export type SeatMapData = z.infer<typeof SeatMapSchema>;
