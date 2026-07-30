import { z } from 'zod';
import { SourceReceiptSchema } from './sourceReceipt';
import { ValueRangeSchema } from './balanceLedger';

/**
 * TransferPath schema — how points become a booking (design §4.2), and the
 * single most consequential object in the product (§3.3).
 *
 * Points transfers are usually one-way. This screen is the one most likely
 * to generate a support ticket, a refund request, or a legal complaint, so
 * the schema forces the facts that must be shown WITHOUT expansion (§3.3):
 * what leaves and what arrives, the ratio and any bonus, that it is not
 * instant, that it cannot be reversed, and what the points are worth if the
 * intended booking disappears mid-transfer.
 *
 * `forBooking` exists because a transfer must never be recommended without a
 * specific booking in mind (AI grounding rule). React-free (§4.5).
 */

export const TransferEndSchema = z.object({
  /** User-facing programme, never a vendor (§6.2). */
  program: z.string().min(1),
  /** Points that leave the source / arrive at the destination. */
  points: z.number().int().nonnegative(),
});
export type TransferEnd = z.infer<typeof TransferEndSchema>;

export const TransferPathSchema = z.object({
  /** What leaves the source account. */
  from: TransferEndSchema,
  /** What arrives at the destination programme. */
  to: TransferEndSchema,
  /** Ratio, source-first — "1:1", "1000:1250". */
  ratio: z.string().min(1),
  /** Any transfer bonus in effect. */
  bonus: z
    .object({
      percent: z.number(),
      validTo: z.string().min(1).optional(),
    })
    .optional(),
  /** Human transfer time — "instant", "1 to 2 days", "up to 3 days". */
  transferTime: z.string().min(1),
  /** Explicit not-instant flag; when false the widget states the wait plainly (§3.3). */
  instant: z.boolean().optional(),
  /** Transfers are one-way. Defaults true and the widget states it unmissably. */
  irreversible: z.boolean().default(true),
  /** The specific booking this transfer is for — a transfer needs a target. */
  forBooking: z.string().min(1).optional(),
  /** What the points are worth if the booking vanishes mid-transfer (§3.3). */
  fallbackValue: ValueRangeSchema.optional(),
  /** Evidence for the ratio/bonus/availability (§4.6.2). */
  receipt: SourceReceiptSchema.optional(),
});

export type TransferPathData = z.infer<typeof TransferPathSchema>;
