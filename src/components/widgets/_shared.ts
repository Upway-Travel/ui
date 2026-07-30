/**
 * Shared tokens and formatters for the render-contract widgets (design §4).
 * One source so the twelve widgets stay visually and typographically
 * consistent, and number formatting cannot drift between them (§11).
 */
import { formatDuration } from '../../lib/formatters';
import type { Cabin } from '../../schemas/option';

// ── Type roles (design §5.5) ──
export const MONO = 'var(--font-mono, "Geist Mono", ui-monospace, monospace)';
export const DISPLAY = 'var(--font-display, "Clash Display", system-ui, sans-serif)';
export const UI = 'var(--font-ui, "Satoshi", system-ui, sans-serif)';

// ── Ink + surface tokens (Light Stage, with standalone fallbacks) ──
export const INK = 'var(--ink, var(--text, #12121A))';
export const INK_MID = 'var(--ink-mid, rgba(18,18,26,0.62))';
export const INK_DIM = 'var(--ink-dim, rgba(18,18,26,0.40))';
export const LINE = 'var(--line, rgba(18,18,26,0.08))';
export const CELL = 'var(--cell, var(--surface, #FFFFFF))';
export const ACCENT = 'var(--color-brand, var(--violet, #6C3DE8))';
export const LIFT = 'var(--lift, 0 1px 2px rgba(18,18,26,0.04), 0 8px 28px -14px rgba(18,18,26,0.10))';
export const LIFT_HOT = 'var(--lift-hot, 0 10px 28px -10px rgba(108,61,232,0.38))';
// Departure-board amber — semantic status only, never the accent (§11).
export const AMBER = '#B26B00';

export const CABIN_LABEL: Record<Cabin, string> = {
  economy: 'Economy',
  premium_economy: 'Premium economy',
  business: 'Business',
  first: 'First',
};

/** Cash per §11: symbol, two decimals under $1,000, none above. */
export function formatCash(amount: number, currency = 'USD'): string {
  const symbol = currency === 'USD' ? '$' : currency === 'GBP' ? '£' : currency === 'EUR' ? '€' : '';
  const digits = amount < 1000 ? 2 : 0;
  const n = amount.toLocaleString('en-US', { minimumFractionDigits: digits, maximumFractionDigits: digits });
  return symbol ? `${symbol}${n}` : `${n} ${currency}`;
}

/** ISO 8601 duration → "14h 35m", null if unparseable. */
export function safeDuration(iso?: string): string | null {
  if (!iso) return null;
  try {
    return formatDuration(iso);
  } catch {
    return null;
  }
}

export function stopsLabel(stops?: number): string | null {
  if (stops === undefined) return null;
  if (stops === 0) return 'Nonstop';
  return `${stops} stop${stops > 1 ? 's' : ''}`;
}
