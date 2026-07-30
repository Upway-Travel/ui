import { z } from 'zod';
import { CabinSchema } from './option';
import { SourceReceiptSchema } from './sourceReceipt';

/**
 * Itinerary schema — a multi-segment trip (design §4.2).
 *
 * Shows connections, duration, and warnings, and stays interactive: a flight
 * from twelve messages ago remains a live object in the thread (§7.1). The
 * layovers between segments carry their own warnings (short connection,
 * terminal change, overnight) because those are what actually go wrong for a
 * traveller. React-free (§4.5).
 */

export const ItinerarySegmentSchema = z.object({
  /** IATA codes. */
  from: z.string().min(1),
  to: z.string().min(1),
  departAt: z.string().min(1).optional(),
  arriveAt: z.string().min(1).optional(),
  /** Marketing carrier — identifies the real operator (nominative use, §6.2). */
  carrier: z.string().min(1).optional(),
  flightNumber: z.string().min(1).optional(),
  aircraft: z.string().min(1).optional(),
  /** ISO 8601 duration for this leg. */
  duration: z.string().min(1).optional(),
  cabin: CabinSchema.optional(),
});
export type ItinerarySegment = z.infer<typeof ItinerarySegmentSchema>;

export const LayoverSchema = z.object({
  /** Connecting airport IATA. */
  at: z.string().min(1),
  /** ISO 8601 layover duration. */
  duration: z.string().min(1).optional(),
  /** What to watch — "Short connection", "Terminal change", "Overnight". */
  warning: z.string().min(1).optional(),
});
export type Layover = z.infer<typeof LayoverSchema>;

export const ItinerarySchema = z.object({
  title: z.string().min(1).optional(),
  segments: z.array(ItinerarySegmentSchema).min(1),
  /** Between-segment stops; conventionally length = segments - 1. */
  layovers: z.array(LayoverSchema).optional(),
  /** ISO 8601 total door-to-door duration. */
  totalDuration: z.string().min(1).optional(),
  /** Trip-level warnings — "Self-transfer, bags not checked through". */
  warnings: z.array(z.string().min(1)).optional(),
  receipt: SourceReceiptSchema.optional(),
});
export type ItineraryData = z.infer<typeof ItinerarySchema>;
