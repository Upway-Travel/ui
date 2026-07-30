import { RotateCw, Plus, Pencil } from 'lucide-react';
import { formatPoints } from '../../lib/formatters';
import type { BalanceLedgerData, LedgerEntry, BalanceSource } from '../../schemas/balanceLedger';
import type { WidgetState } from '../../schemas/sourceReceipt';
import {
  MONO, DISPLAY, UI, INK, INK_MID, INK_DIM, LINE, CELL, ACCENT, LIFT,
  formatCash, computeFreshness, freshnessColor,
} from './_shared';

/**
 * BalanceLedger — one live statement of what the traveller holds (§4.2).
 *
 * Every row pairs the raw balance with its evidence: an "as of" freshness
 * and where the number came from, plus an estimated best-use RANGE — a
 * balance is not a value (§11). The header states the whole position in real
 * dollars, because "connect once and see you're sitting on $5,000 you forgot
 * you had" is the shareable moment (§9, thesis).
 *
 * Actions (§4.2): refresh, connect, correct. Four states (§4.3).
 */

const SOURCE_LABEL: Record<BalanceSource, string> = {
  manual: 'you entered this',
  email: 'from your inbox',
  connected: 'connected',
};

const shell: React.CSSProperties = {
  background: CELL,
  border: `1px solid ${LINE}`,
  borderRadius: 18,
  boxShadow: LIFT,
  padding: 16,
  fontFamily: UI,
  color: INK,
  display: 'flex',
  flexDirection: 'column',
  gap: 14,
};

export interface BalanceLedgerProps {
  data?: BalanceLedgerData;
  state?: WidgetState;
  /** Partial: programmes still being read. */
  pending?: string[];
  reason?: string;
  onRefresh?: () => void;
  onConnect?: () => void;
  onCorrect?: (entry: LedgerEntry, index: number) => void;
  className?: string;
  style?: React.CSSProperties;
}

export default function BalanceLedger({
  data,
  state = 'loaded',
  pending,
  reason,
  onRefresh,
  onConnect,
  onCorrect,
  className,
  style,
}: BalanceLedgerProps) {
  if (state === 'loading') {
    return (
      <div className={className} style={{ ...shell, ...style }} aria-busy="true" aria-label="Reading your balances">
        <Bar w={220} h={22} />
        {[0, 1, 2].map((i) => (
          <Bar key={i} w={undefined} h={34} />
        ))}
      </div>
    );
  }

  if (state === 'failed') {
    return (
      <div className={className} style={{ ...shell, ...style }} role="status">
        <span style={{ fontFamily: DISPLAY, fontSize: 17, fontWeight: 600, letterSpacing: '-0.02em' }}>
          Couldn&rsquo;t read your balances
        </span>
        <span style={{ fontSize: 13.5, color: INK_MID }}>{reason || 'This could not be loaded just now.'}</span>
        {onRefresh && (
          <div>
            <QuietButton onClick={onRefresh} icon={<RotateCw size={13} aria-hidden />}>
              Try again
            </QuietButton>
          </div>
        )}
      </div>
    );
  }

  if (!data) return null;

  const total = data.totalEstValue;
  const isPartial = state === 'partial';

  return (
    <div className={className} style={{ ...shell, ...style }}>
      {/* The whole position in real dollars — the shareable header (§9) */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <span style={{ fontFamily: MONO, fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: INK_DIM }}>
          Your points are worth
        </span>
        {total ? (
          <span style={{ fontFamily: MONO, fontSize: 28, fontWeight: 500, letterSpacing: '-0.02em', color: INK }}>
            {formatCash(total.low, total.currency)} to {formatCash(total.high, total.currency)}
          </span>
        ) : (
          <span style={{ fontFamily: UI, fontSize: 13, color: INK_MID }}>Add a balance to see what it&rsquo;s worth.</span>
        )}
        {total?.method && <span style={{ fontFamily: UI, fontSize: 12, color: INK_DIM }}>{total.method}</span>}
      </div>

      {isPartial && pending && pending.length > 0 && (
        <span style={{ fontFamily: MONO, fontSize: 11, color: INK_DIM }}>still reading: {pending.join(', ')}</span>
      )}

      {/* Rows */}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {data.entries.map((e, i) => {
          const fresh = computeFreshness(e.asOf);
          return (
            <div
              key={`${e.program}-${i}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '10px 0',
                borderTop: i === 0 ? 'none' : `1px solid ${LINE}`,
                flexWrap: 'wrap',
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 140, flex: 1 }}>
                <span style={{ fontFamily: UI, fontSize: 14, fontWeight: 500, color: INK }}>
                  {e.program}
                  {e.tier && (
                    <span style={{ fontFamily: MONO, fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: ACCENT, marginLeft: 8 }}>
                      {e.tier}
                    </span>
                  )}
                </span>
                <span style={{ fontFamily: MONO, fontSize: 10.5, color: freshnessColor(fresh.tier) }}>
                  {fresh.label}
                  {e.source ? ` · ${SOURCE_LABEL[e.source]}` : ''}
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 2 }}>
                <span style={{ fontFamily: MONO, fontSize: 15, fontWeight: 500, color: INK }}>
                  {formatPoints(e.balance)}
                </span>
                {e.estValue && (
                  <span style={{ fontFamily: MONO, fontSize: 11, color: INK_MID }}>
                    {formatCash(e.estValue.low, e.estValue.currency)} to {formatCash(e.estValue.high, e.estValue.currency)}
                  </span>
                )}
              </div>
              {onCorrect && (
                <button
                  type="button"
                  onClick={() => onCorrect(e, i)}
                  aria-label={`Correct ${e.program} balance`}
                  style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: INK_DIM, padding: 4 }}
                >
                  <Pencil size={13} aria-hidden />
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Actions */}
      {(onRefresh || onConnect) && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          {onConnect && (
            <button
              type="button"
              onClick={onConnect}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                background: ACCENT,
                color: '#FFFFFF',
                border: 'none',
                borderRadius: 9999,
                padding: '9px 16px',
                fontFamily: UI,
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
                boxShadow: 'var(--lift-hot, 0 10px 28px -10px rgba(108,61,232,0.38))',
              }}
            >
              <Plus size={14} aria-hidden />
              Connect an account
            </button>
          )}
          {onRefresh && (
            <QuietButton onClick={onRefresh} icon={<RotateCw size={13} aria-hidden />}>
              Refresh
            </QuietButton>
          )}
        </div>
      )}
    </div>
  );
}

function QuietButton({ onClick, icon, children }: { onClick: () => void; icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        background: 'transparent',
        color: INK,
        border: `1px solid ${LINE}`,
        borderRadius: 9999,
        padding: '8px 16px',
        fontFamily: UI,
        fontSize: 14,
        fontWeight: 500,
        cursor: 'pointer',
      }}
    >
      {icon}
      {children}
    </button>
  );
}

function Bar({ w, h }: { w?: number; h: number }) {
  return (
    <span
      aria-hidden
      style={{ display: 'block', width: w ?? '100%', height: h, borderRadius: 8, background: `linear-gradient(90deg, ${LINE}, transparent)` }}
    />
  );
}
