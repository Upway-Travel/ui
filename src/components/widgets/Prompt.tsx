import { useState } from 'react';
import { Check } from 'lucide-react';
import type { PromptData, PromptChoice } from '../../schemas/prompt';
import type { WidgetState } from '../../schemas/sourceReceipt';
import { MONO, DISPLAY, UI, INK, INK_MID, INK_DIM, LINE, CELL, ACCENT, AMBER, LIFT } from './_shared';

/**
 * Prompt — a decision Upway needs (§4.2). The question, 2 to 4 clear
 * choices, and optional free text. Once answered it resolves visibly (§14):
 * the chosen answer stays on screen as a settled record rather than
 * vanishing, so the thread reads as a decision history.
 *
 * Part of the MCP reduced vocabulary (§8.2). Four states (§4.3).
 */

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
  gap: 12,
};

function choiceId(c: PromptChoice): string {
  return c.id ?? c.label;
}

export interface PromptProps {
  data?: PromptData;
  state?: WidgetState;
  reason?: string;
  onSelect?: (choiceId: string, choice: PromptChoice) => void;
  onSubmitText?: (text: string) => void;
  /** When set, the prompt renders resolved (read-only) showing this answer. */
  answeredLabel?: string;
  className?: string;
  style?: React.CSSProperties;
}

export default function Prompt({
  data,
  state = 'loaded',
  reason,
  onSelect,
  onSubmitText,
  answeredLabel,
  className,
  style,
}: PromptProps) {
  const [text, setText] = useState('');
  const [localAnswer, setLocalAnswer] = useState<string | null>(null);

  if (state === 'loading') {
    return (
      <div className={className} style={{ ...shell, ...style }} aria-busy="true" aria-label="Preparing a question">
        <Bar w={240} h={16} />
        <div style={{ display: 'flex', gap: 8 }}>
          <Bar w={90} h={34} />
          <Bar w={90} h={34} />
        </div>
      </div>
    );
  }

  if (state === 'failed') {
    return (
      <div className={className} style={{ ...shell, ...style }} role="status">
        <span style={{ fontSize: 13.5, color: INK_MID }}>{reason || 'Something went wrong asking this. Try again.'}</span>
      </div>
    );
  }

  if (!data) return null;

  const resolved = answeredLabel ?? localAnswer;

  // Resolved: the answer settles in place (§14) — a record, not a vanishing UI.
  if (resolved) {
    return (
      <div className={className} style={{ ...shell, ...style, opacity: 0.92 }}>
        <span style={{ fontFamily: UI, fontSize: 14, color: INK_MID }}>{data.question}</span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: UI, fontSize: 14, fontWeight: 600, color: INK }}>
          <Check size={15} aria-hidden style={{ color: ACCENT }} />
          {resolved}
        </span>
      </div>
    );
  }

  const select = (c: PromptChoice) => {
    setLocalAnswer(c.label);
    onSelect?.(choiceId(c), c);
  };

  const submit = () => {
    const t = text.trim();
    if (!t) return;
    setLocalAnswer(t);
    onSubmitText?.(t);
  };

  return (
    <div className={className} style={{ ...shell, ...style }}>
      <span style={{ fontFamily: DISPLAY, fontSize: 17, fontWeight: 600, letterSpacing: '-0.02em', lineHeight: 1.2 }}>
        {data.question}
      </span>

      {data.choices && data.choices.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {data.choices.map((c) => {
            const primary = c.emphasis === 'primary';
            const caution = c.emphasis === 'caution';
            return (
              <button
                key={choiceId(c)}
                type="button"
                onClick={() => select(c)}
                style={{
                  textAlign: 'left',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2,
                  background: primary ? ACCENT : 'transparent',
                  color: primary ? '#FFFFFF' : caution ? AMBER : INK,
                  border: primary ? 'none' : `1px solid ${caution ? 'color-mix(in srgb, #B26B00 40%, transparent)' : LINE}`,
                  borderRadius: 12,
                  padding: '10px 14px',
                  cursor: 'pointer',
                  fontFamily: UI,
                }}
              >
                <span style={{ fontSize: 14, fontWeight: 600 }}>{c.label}</span>
                {c.detail && (
                  <span style={{ fontSize: 12.5, color: primary ? 'rgba(255,255,255,0.85)' : INK_MID }}>{c.detail}</span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {data.allowFreeText && (
        <div style={{ display: 'flex', gap: 8, alignItems: 'stretch' }}>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && submit()}
            placeholder={data.freeTextPlaceholder || 'Type your answer'}
            aria-label={data.question}
            style={{
              flex: 1,
              fontFamily: UI,
              fontSize: 14,
              color: INK,
              background: 'var(--cell-2, #FFFFFF)',
              border: `1px solid ${LINE}`,
              borderRadius: 10,
              padding: '9px 12px',
              outline: 'none',
            }}
          />
          <button
            type="button"
            onClick={submit}
            disabled={!text.trim()}
            style={{
              background: text.trim() ? ACCENT : 'var(--cell-2, #F1F0F6)',
              color: text.trim() ? '#FFFFFF' : INK_DIM,
              border: 'none',
              borderRadius: 10,
              padding: '9px 16px',
              fontFamily: UI,
              fontSize: 14,
              fontWeight: 600,
              cursor: text.trim() ? 'pointer' : 'not-allowed',
            }}
          >
            Send
          </button>
        </div>
      )}
    </div>
  );
}

function Bar({ w, h }: { w?: number; h: number }) {
  return (
    <span aria-hidden style={{ display: 'block', width: w ?? '100%', height: h, borderRadius: 8, background: `linear-gradient(90deg, ${LINE}, transparent)` }} />
  );
}
