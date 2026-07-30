import { z } from 'zod';

/**
 * Prompt schema — a decision Upway needs from the traveller (design §4.2).
 *
 * The question, 2 to 4 clear choices, and optional free text. Part of the
 * MCP reduced vocabulary (§8.2) — it travels into ChatGPT/Claude where the
 * agent must ask before it can act. A prompt resolves visibly once answered
 * (§14). React-free (§4.5).
 */

export const PromptChoiceSchema = z.object({
  /** Stable id returned on select; defaults to the label if omitted. */
  id: z.string().min(1).optional(),
  label: z.string().min(1),
  /** A short clarifying line under the label. */
  detail: z.string().min(1).optional(),
  /** Marks a consequential choice so the renderer can weight it (e.g. a commit). */
  emphasis: z.enum(['default', 'primary', 'caution']).optional(),
});
export type PromptChoice = z.infer<typeof PromptChoiceSchema>;

export const PromptSchema = z.object({
  question: z.string().min(1),
  /** 2 to 4 choices. Omit when the answer is purely free text. */
  choices: z.array(PromptChoiceSchema).min(2).max(4).optional(),
  /** Allow a typed answer in addition to (or instead of) the choices. */
  allowFreeText: z.boolean().optional(),
  freeTextPlaceholder: z.string().min(1).optional(),
});
export type PromptData = z.infer<typeof PromptSchema>;
