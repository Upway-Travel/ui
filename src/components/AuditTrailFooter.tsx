/**
 * AuditTrailFooter — small mono caption showing source + freshness + kind.
 *
 * Graduates the audit-trail caption flagged in PR #104 (5e). Renders one
 * compact one-liner like:
 *
 *   • CHECKED SEATS.AERO · 4M AGO · ANA SAVER
 *
 * Pulls color from `--color-brand` (for the leading dot) and from rgba
 * tones tuned for both cream/Ink shells. Font from `--font-mono` so it
 * auto-retunes per public/lab scope (see tokens.css contract).
 *
 * Stateless / motionless.
 */

const MONO_FAMILY = 'var(--font-mono, "Geist Mono"), ui-monospace, monospace';

export interface AuditTrailFooterProps {
  /** Source identifier — e.g. "SEATS.AERO", "AwardWallet", "ANA". */
  source: string;
  /** Freshness string — e.g. "4M AGO", "12 MIN AGO", "JUST NOW". */
  freshness: string;
  /** Optional fare/inventory kind — e.g. "ANA SAVER". */
  kind?: string;
  /** If true, prefixes "Checked" before the source. Default true. */
  prefixChecked?: boolean;
  /** If true, show the leading brand-colored dot. Default true. */
  showDot?: boolean;
  /** Optional className applied to the root. */
  className?: string;
}

export default function AuditTrailFooter({
  source,
  freshness,
  kind,
  prefixChecked = true,
  showDot = true,
  className = '',
}: AuditTrailFooterProps) {
  const sourceLabel = prefixChecked ? `Checked ${source}` : source;

  return (
    <div
      className={`flex items-center gap-2 ${className}`}
      style={{
        fontFamily: MONO_FAMILY,
        fontSize: 11,
        color: 'rgba(10,14,20,0.55)',
      }}
    >
      {showDot && (
        <span
          aria-hidden
          style={{
            width: 6,
            height: 6,
            background: 'var(--color-brand, #1A4D32)',
            borderRadius: '50%',
            flexShrink: 0,
          }}
        />
      )}
      <span>
        {sourceLabel}
        <span aria-hidden> · </span>
        {freshness}
        {kind && (
          <>
            <span aria-hidden> · </span>
            {kind}
          </>
        )}
      </span>
    </div>
  );
}
