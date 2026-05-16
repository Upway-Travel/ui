/**
 * Shared Tailwind preset for all Upway surfaces (app, landing, blog).
 *
 * Keep this file narrow: only tokens that SHOULD look identical everywhere.
 * Consumer-specific extensions (CSS-var-driven theme tokens, bespoke
 * animations, surface-specific sizing) stay in the consumer's config.
 */

/** @type {Partial<import('tailwindcss').Config>} */
export const upwayPreset = {
  darkMode: ['selector', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        // ── Semantic brand tokens — CSS variables driven by data-upway-surface ──
        // Each consumer sets data-upway-surface="public" (cream/forest/volt) or
        // data-upway-surface="lab" (zinc/cyan/gold) on a root element.
        // See @upway/ui src/styles/tokens.css for the contract.
        brand: {
          DEFAULT: 'var(--color-brand)',
          deep:    'var(--color-brand-deep)',
          // Public mode palette primitives (use sparingly — prefer semantic tokens)
          cream:   'var(--upway-cream)',
          bone:    'var(--upway-bone)',
          ink:     'var(--upway-ink)',
          forest:  'var(--upway-forest)',
          volt:    'var(--upway-volt)',
          // Legacy aliases kept for existing consumers — DO NOT USE for new surfaces
          sage:    '#8fbfa0',
          sun:     '#e8d44d',
          coral:   '#e8735a',
        },
        surface: {
          DEFAULT: 'var(--color-surface)',
          bg:      'var(--color-bg)',
        },
        accent: {
          DEFAULT: 'var(--color-accent)',  /* event-only — Volt rule */
          value:   'var(--color-value)',
        },
        gold: {
          DEFAULT: '#c4961a',
          light: '#d4a828',
          dark: '#a67c14',
        },
      },
      fontFamily: {
        sans: ['var(--font-ui)', 'Geist Sans', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'Fraunces', 'Playfair Display', 'Georgia', 'serif'],
        mono: ['var(--font-mono)', 'Söhne Mono', 'Geist Mono', 'JetBrains Mono', 'ui-monospace', 'monospace'],
        // Legacy aliases — kept for existing consumers
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
