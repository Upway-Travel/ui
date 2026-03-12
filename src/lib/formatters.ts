export interface ScoreColors {
  bg: string;
  text: string;
  border: string;
  ring: string;
}

export type AvailabilityLevel = 'abundant' | 'good' | 'limited' | 'scarce';

export function getScoreColor(score: number): ScoreColors {
  if (score >= 90)
    return { bg: 'bg-[var(--score-excellent-bg)]', text: 'text-[var(--score-excellent)]', border: 'border-[var(--score-excellent-border)]', ring: 'ring-[var(--score-excellent)]' };
  if (score >= 80)
    return { bg: 'bg-[var(--score-good-bg)]', text: 'text-[var(--score-good)]', border: 'border-[var(--score-good-border)]', ring: 'ring-[var(--score-good)]' };
  if (score >= 70)
    return { bg: 'bg-[var(--score-fair-bg)]', text: 'text-[var(--score-fair)]', border: 'border-[var(--score-fair-border)]', ring: 'ring-[var(--score-fair)]' };
  return { bg: 'bg-[var(--score-poor-bg)]', text: 'text-[var(--score-poor)]', border: 'border-[var(--score-poor-border)]', ring: 'ring-[var(--score-poor)]' };
}

export function getAvailabilityColor(avail: AvailabilityLevel): string {
  const map: Record<AvailabilityLevel, string> = {
    abundant: 'text-[var(--score-excellent)]',
    good: 'text-[var(--score-excellent)]',
    limited: 'text-[var(--score-fair)]',
    scarce: 'text-[var(--score-poor)]',
  };
  return map[avail] || 'text-[var(--text3)]';
}

export function formatPoints(n: number): string {
  if (n >= 1000) return (n / 1000).toFixed(n % 1000 === 0 ? 0 : 1) + 'K';
  return n.toLocaleString();
}

export function calculateCPP(cashPrice: number, points: number, fees: number): string {
  if (!points || points <= 0) return '0.0';
  return (((cashPrice - fees) / points) * 100).toFixed(1);
}

export function getCPPRating(cpp: string): string {
  const v = parseFloat(cpp);
  if (v >= 4) return 'Exceptional';
  if (v >= 2) return 'Great';
  if (v >= 1.5) return 'Good';
  if (v >= 1) return 'Fair';
  return 'Poor';
}

export function getCPPColor(cpp: string): string {
  const v = parseFloat(cpp);
  if (v >= 4) return 'text-[var(--score-excellent)]';
  if (v >= 2) return 'text-[var(--score-good)]';
  if (v >= 1.5) return 'text-[var(--primary)]';
  if (v >= 1) return 'text-[var(--score-fair)]';
  return 'text-[var(--score-poor)]';
}

export function getTotalPoints(
  cards: string[],
  balances: Record<string, number>,
  loyaltyPrograms: Array<{ balance: number }>
): number {
  let total = 0;
  for (const cardId of cards) {
    total += balances[cardId] || 0;
  }
  for (const lp of loyaltyPrograms) {
    total += lp.balance || 0;
  }
  return total;
}

export function getEstimatedValue(points: number): { low: number; high: number } {
  return {
    low: points * 0.015,
    high: points * 0.03,
  };
}

/** Parse ISO 8601 duration "PT10H45M" → "10h 45m" */
export function formatDuration(iso: string): string {
  const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
  if (!match) return iso;
  const hours = match[1] ? `${match[1]}h` : '';
  const mins = match[2] ? ` ${match[2]}m` : '';
  return `${hours}${mins}`.trim();
}

/** Format time from ISO datetime → "8:30 AM" */
export function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

/** Format stops count → "Nonstop" | "1 stop" | "2 stops" */
export function formatStops(stops: number): string {
  if (stops === 0) return 'Nonstop';
  return `${stops} stop${stops > 1 ? 's' : ''}`;
}
