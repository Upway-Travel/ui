import { z } from 'zod';
import { SourceReceiptSchema } from './sourceReceipt';

/**
 * Option schema — a single bookable choice (design §4.2). The workhorse of
 * the render contract; Comparison composes several of these.
 *
 * Load-bearing rules encoded here:
 *  • Cash and points travel TOGETHER. A cash figure is always shown with its
 *    points alternative and vice versa — the first "what are my points worth?"
 *    moment is never gated (feedback: points-side-by-side, no paywall).
 *  • Novice and expert depth live in the SAME object (§4.6): `verdict` +
 *    headline price is the novice view; `segments`, `constraints` and the
 *    embedded `receipt` are the expert depth revealed on expand.
 *  • Estimated value is always a RANGE with a method, never a point figure (§11).
 *  • The embedded `receipt` is how an Option carries its evidence (§4.6.2);
 *    a factual Option should not render without one.
 *
 * React-free (zod only) so the tool layer shares the contract (§4.5).
 */

export const CabinSchema = z.enum(['economy', 'premium_economy', 'business', 'first']);
export type Cabin = z.infer<typeof CabinSchema>;

export const MoneySchema = z.object({
  amount: z.number().nonnegative(),
  currency: z.string().min(1).default('USD'),
});
export type Money = z.infer<typeof MoneySchema>;

/** One points redemption for this option. `program` is the user-facing loyalty
 *  programme (e.g. "Aeroplan"), never the data vendor (§6.2). */
export const PointsPriceSchema = z.object({
  program: z.string().min(1),
  points: z.number().int().nonnegative(),
  /** Cash fees/taxes still due on the award. */
  fees: MoneySchema.optional(),
  /** Transfer ratio to reach this programme, source-first — "1:1", "1000:1250". */
  ratio: z.string().min(1).optional(),
});
export type PointsPrice = z.infer<typeof PointsPriceSchema>;

export const OptionSegmentSchema = z.object({
  /** IATA codes. */
  from: z.string().min(1),
  to: z.string().min(1),
  departAt: z.string().min(1).optional(),
  arriveAt: z.string().min(1).optional(),
  /** Marketing carrier — identifies the real operator (nominative use, §6.2). */
  carrier: z.string().min(1).optional(),
  flightNumber: z.string().min(1).optional(),
  aircraft: z.string().min(1).optional(),
  /** ISO 8601 duration, e.g. "PT14H35M". */
  duration: z.string().min(1).optional(),
});
export type OptionSegment = z.infer<typeof OptionSegmentSchema>;

export const OptionSchema = z.object({
  from: z.string().min(1),
  to: z.string().min(1),
  cabin: CabinSchema.optional(),
  /** The honest cash alternative. Always shown beside points (no paywall). */
  cash: MoneySchema.optional(),
  /** Points redemption(s). Array so several programmes can sit side by side. */
  points: z.array(PointsPriceSchema).optional(),
  /** Estimated best-use value — a range with a method, never a point figure (§11). */
  estValue: z
    .object({
      low: z.number().nonnegative(),
      high: z.number().nonnegative(),
      currency: z.string().min(1).default('USD'),
      method: z.string().min(1).optional(),
    })
    .optional(),
  /** Expert depth: the leg-by-leg structure. */
  segments: z.array(OptionSegmentSchema).optional(),
  /** Total ISO 8601 duration across segments. */
  duration: z.string().min(1).optional(),
  stops: z.number().int().nonnegative().optional(),
  /** What the traveller must know before acting — "Seats limited", "Fare not held". */
  constraints: z.array(z.string().min(1)).optional(),
  /** The novice-facing one-line reason this option is worth it. */
  verdict: z.string().min(1).optional(),
  /** Evidence (§4.6.2). A factual option carries its provenance here. */
  receipt: SourceReceiptSchema.optional(),
});

export type OptionData = z.infer<typeof OptionSchema>;
