import { z } from 'zod';

/**
 * SourceReceipt schema — the contract behind the signature provenance
 * element (design direction §5.6, §6).
 *
 * Four INDEPENDENT provenance signals — authority, freshness, completeness,
 * confidence. They are not collapsible into one "confidence" badge; doing so
 * destroys information (§6). Confidence is never a decorative catch-all: it
 * must carry a stated basis or it is not shown.
 *
 * Authority is the UNDERLYING authority ("United · award inventory"), never
 * the data vendor that fetched it (§6.2). Seats.aero, Duffel and FR24 never
 * appear here as the reason to believe a claim.
 *
 * `authority` is required on purpose. A fabricated result cannot honestly
 * populate a real authority, so requiring it is the mock-data ban's
 * mechanical enforcement point at the schema layer (§4.5). The renderer must
 * never show a SourceReceipt over demo data.
 *
 * This module is intentionally React-free (imports only `zod`) so the
 * tool-calling layer can import it to derive tool definitions from the same
 * contract the renderer validates against.
 */

export const ConfidenceLevelSchema = z.enum(['high', 'medium', 'low']);
export type ConfidenceLevel = z.infer<typeof ConfidenceLevelSchema>;

export const ProvenanceSourceSchema = z.object({
  /** The underlying authority, never the intermediary vendor (§6.2). */
  authority: z.string().min(1),
  /** ISO 8601 timestamp this source was checked; omit only if genuinely unknown. */
  verifiedAt: z.string().min(1).optional(),
  /** Short note, e.g. "direct inventory", "published award chart". */
  note: z.string().min(1).optional(),
});
export type ProvenanceSource = z.infer<typeof ProvenanceSourceSchema>;

export const SourceReceiptSchema = z.object({
  /** What kind of claim this backs — "AWARD SPACE", "CASH FARE". Uppercased in render. */
  claim: z.string().min(1).optional(),
  /**
   * The underlying authority for the headline claim (§6.2). Required — this
   * is the anti-mock anchor (§4.5).
   */
  authority: z.string().min(1),
  /**
   * Freshness — ISO 8601. When absent the widget renders an explicit
   * "freshness unknown", never an implied currency it cannot evidence (§6.1).
   */
  verifiedAt: z.string().min(1).optional(),
  /** Completeness — what may be missing from the answer. */
  completeness: z
    .object({
      checked: z.number().int().nonnegative(),
      total: z.number().int().positive(),
      /** What is being counted, e.g. "transfer paths", "cabins". */
      unit: z.string().min(1),
    })
    .optional(),
  /**
   * Confidence — derived from the other signals plus a stated method.
   * If it cannot be derived and named, it is omitted rather than decorated (§6).
   */
  confidence: z
    .object({
      level: ConfidenceLevelSchema,
      basis: z.string().min(1),
    })
    .optional(),
  /** A short inline detail — "4 seats", "2 fares". */
  detail: z.string().min(1).optional(),
  /** Full sourcing revealed when the receipt is expanded (§5.6). */
  sources: z.array(ProvenanceSourceSchema).optional(),
});

export type SourceReceiptData = z.infer<typeof SourceReceiptSchema>;

/** The four states every render-contract widget implements (§4.3). */
export const WidgetStateSchema = z.enum(['loading', 'loaded', 'partial', 'failed']);
export type WidgetState = z.infer<typeof WidgetStateSchema>;
