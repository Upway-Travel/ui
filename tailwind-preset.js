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
        brand: {
          DEFAULT: '#8fbfa0',
          sage: '#8fbfa0',
          forest: '#1a4d32',
          sun: '#e8d44d',
          coral: '#e8735a',
        },
        gold: {
          DEFAULT: '#c4961a',
          light: '#d4a828',
          dark: '#a67c14',
        },
      },
      fontFamily: {
        sans: ['Geist Sans', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif'],
        display: ['Satoshi', 'Geist Sans', 'system-ui', 'sans-serif'],
        mono: ['Geist Mono', 'JetBrains Mono', 'monospace'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
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
