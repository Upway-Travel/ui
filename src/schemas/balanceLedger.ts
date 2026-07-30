import { z } from 'zod';

/**
 * BalanceLedger schema — what the traveller holds (design §4.2).
 *
 * The Wallet's spine and a demo-path anchor (§18). Each row must carry not
 * just a number but its evidence: an "as of" timestamp and where it came
 * from (§4.2). A balance is not a value — every entry pairs the raw balance
 * with an estimated best-use RANGE, never a single figure presented as
 * certainty (§11).
 *
 * `source` names how the user got the number (entered it, from their inbox,
 * a connected account) — this is honest connection provenance, not a data
 * vendor (§6.2). React-free (§4.5).
 */

export const BalanceSourceSchema = z.enum(['manual', 'email', 'connected']);
export type BalanceSource = z.infer<typeof BalanceSourceSchema>;

export const BalanceKindSchema = z.enum(['transferable', 'airline', 'hotel', 'card']);
export type BalanceKind = z.infer<typeof BalanceKindSchema>;

export const ValueRangeSchema = z.object({
  low: z.number().nonnegative(),
  high: z.number().nonnegative(),
  currency: z.string().min(1).default('USD'),
  method: z.string().min(1).optional(),
});
export type ValueRange = z.infer<typeof ValueRangeSchema>;

export const LedgerEntrySchema = z.object({
  /** User-facing programme, e.g. "Aeroplan", "Chase Ultimate Rewards". */
  program: z.string().min(1),
  balance: z.number().int().nonnegative(),
  kind: BalanceKindSchema.optional(),
  /** Elite tier if any — "Platinum", "Globalist". */
  tier: z.string().min(1).optional(),
  /** ISO 8601 — when this balance was last known good. Freshness decays (§6.1). */
  asOf: z.string().min(1).optional(),
  /** How the user got this number (§6.2 — connection provenance, not a vendor). */
  source: BalanceSourceSchema.optional(),
  /** Estimated best-use value — a range, never a point figure (§11). */
  estValue: ValueRangeSchema.optional(),
});
export type LedgerEntry = z.infer<typeof LedgerEntrySchema>;

export const BalanceLedgerSchema = z.object({
  entries: z.array(LedgerEntrySchema),
  /** Combined estimated best-use value across the position. */
  totalEstValue: ValueRangeSchema.optional(),
});
export type BalanceLedgerData = z.infer<typeof BalanceLedgerSchema>;
