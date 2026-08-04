/**
 * Shared Tailwind preset for all Upway surfaces (app, landing, blog).
 *
 * Keep this file narrow: only tokens that SHOULD look identical everywhere.
 * Consumer-specific extensions (CSS-var-driven theme tokens, bespoke
 * animations, surface-specific sizing) stay in the consumer's config.
 *
 * Stage contract (updated 2026-08-03): the DEFAULT is Light Stage (Design
 * Kernel v3) — the CSS variables behind these classes resolve to Light Stage
 * values on :root. The retired palettes only apply inside an explicit opt-in
 * scope: [data-upway-stage="classic"] (cream/Forest/Volt/Fraunces, legacy
 * alias [data-upway-surface="public"]) or [data-upway-stage="lab"]
 * (zinc/cyan/gold, legacy aliases [data-upway-surface="lab"] /
 * [data-app-mode="lab"]). See src/styles/tokens.css for the contract.
 *
 * DEPRECATION: the legacy color names and fallbacks below are scheduled for
 * deletion once landing/blog complete their kernel bump. Do not use them on
 * new surfaces.
 */

/** @type {Partial<import('tailwindcss').Config>} */
export const upwayPreset = {
  darkMode: ['selector', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        // ── Semantic brand tokens — CSS variables, Light Stage by default ──
        // Fallbacks mirror the :root Light Stage defaults in tokens.css.
        brand: {
          DEFAULT: 'var(--color-brand, #6C3DE8)',
          deep:    'var(--color-brand-deep, #5834BB)',
          // Legacy classic-stage primitives — resolve only inside the classic
          // opt-in scope; literal fallbacks keep pinned consumers' class usage
          // rendering unchanged. DO NOT USE for new surfaces.
          cream:   'var(--upway-cream, #FAF9F5)',
          bone:    'var(--upway-bone, #F4F1EA)',
          ink:     'var(--upway-ink, #0A0E14)',
          forest:  'var(--upway-forest, #1A4D32)',
          volt:    'var(--upway-volt, #C6FF3D)',
          // Legacy aliases kept for existing consumers — DO NOT USE
          sage:    '#8fbfa0',
          sun:     '#e8d44d',
          coral:   '#e8735a',
        },
        surface: {
          DEFAULT: 'var(--color-surface, #FFFFFF)',
          bg:      'var(--color-bg, #FAFAFC)',
        },
        accent: {
          DEFAULT: 'var(--color-accent, #6C3DE8)',
          value:   'var(--color-value, #6C3DE8)',
        },
        // Legacy gold system — classic/lab era, kept for pinned consumers
        gold: {
          DEFAULT: '#c4961a',
          light: '#d4a828',
          dark: '#a67c14',
        },
      },
      fontFamily: {
        // Light Stage stacks by default; the CSS variable wins when defined
        // (always, via tokens.css :root) so classic/lab scopes still resolve
        // to their own stacks.
        sans: ['var(--font-ui)', 'Satoshi', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'Clash Display', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'Geist Mono', 'ui-monospace', 'monospace'],
        // Legacy alias — classic-era serif; kept for pinned consumers only
        serif: ['var(--font-display)', 'Fraunces', 'Playfair Display', 'Georgia', 'serif'],
      },
      boxShadow: {
        'depth-1': '0 1px 2px rgba(0,0,0,0.05)',
        'depth-2': '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)',
        'depth-3': '0 4px 12px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.04)',
        'depth-4': '0 8px 24px rgba(0,0,0,0.10), 0 4px 8px rgba(0,0,0,0.06)',
        'float': '0 12px 40px -5px rgba(0, 0, 0, 0.15), 0 4px 12px -5px rgba(0, 0, 0, 0.08)',
        'premium': '0 4px 16px rgba(196,150,26,0.12), 0 1px 3px rgba(0,0,0,0.06)',
      },
    },
  },
  plugins: [],
};

export default upwayPreset;
