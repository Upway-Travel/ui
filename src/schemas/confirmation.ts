import { z } from 'zod';
import { SourceReceiptSchema } from './sourceReceipt';

/**
 * Confirmation schema — a completed commitment (design §4.2).
 *
 * The payoff artifact. It must never wear hollow success styling over an
 * uncertain result (§4.3), so a real `reference` is required — the booking
 * code is the proof it happened. Carries ownership (whose booking, for the
 * B2B tier §10), the next step, and a recovery contact for when something
 * goes wrong. React-free (§4.5).
 */

export const ConfirmationStatusSchema = z.enum(['confirmed', 'ticketed', 'pending']);
export type ConfirmationStatus = z.infer<typeof ConfirmationStatusSchema>;

export const ConfirmationSchema = z.object({
  /** What was committed — "Booked · Sydney to Tokyo, business". */
  title: z.string().min(1),
  /** The booking reference / PNR. Required — the proof (§4.3). */
  reference: z.string().min(1),
  status: ConfirmationStatusSchema.optional(),
  /** Whose booking this is (B2B ownership attribution, §10). */
  owner: z.string().min(1).optional(),
  /** A one-line detail — dates, cabin, traveller. */
  detail: z.string().min(1).optional(),
  /** What happens next — "Seats assign at check-in". */
  nextStep: z.string().min(1).optional(),
  /** Who to contact if it goes wrong (§4.2 recovery contact). */
  recoveryContact: z.string().min(1).optional(),
  receipt: SourceReceiptSchema.optional(),
});
export type ConfirmationData = z.infer<typeof ConfirmationSchema>;
