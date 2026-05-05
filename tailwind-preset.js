/**
 * Shared Tailwind preset for all Upway surfaces (app, landing, blog).
 *
 * Keep this file narrow: only tokens that SHOULD look identical everywhere.
 * Consumer-specific extensions (CSS-var-driven theme tokens, bespoke
 * animations, surface-specific sizing) stay in the consumer's config.
 *
 * Brand: Ink / Bone / Volt — locked 2026-05-05.
 * Volt is RESERVED for money / CTA / value moments. Never decorative.
 */

/** @type {Partial<import('tailwindcss').Config>} */
export const upwayPreset = {
  darkMode: ['selector', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        // Core brand primitives
        ink: '#0A0E14',
        bone: {
          DEFAULT: '#F4F1EA',
          94: '#EEEAE0',
        },
        volt: {
          DEFAULT: '#C6FF3D', // money / CTA only
          hover: '#B5EE2B',
          pressed: '#A4DC1F',
        },
        slate: {
          95: '#13181F',
        },
        hairline: {
          dark: '#1E242D',
          light: '#D9D3C5',
        },
        text: {
          hi: '#F4F1EA',
          mid: '#8A94A4',
          lo: '#4A5260',
        },
        // Brand alias for legacy class names — points at Volt
        brand: {
          DEFAULT: '#C6FF3D',
          ink: '#0A0E14',
          bone: '#F4F1EA',
          volt: '#C6FF3D',
        },
      },
      fontFamily: {
        // Display: GT Maru (headlines, hero, marketing)
        display: ['GT Maru', 'Satoshi', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif'],
        // Body: Satoshi (UI, body copy)
        sans: ['Satoshi', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'system-ui', 'sans-serif'],
        // Mono: Söhne Mono (numerals, prices, points balances)
        mono: ['Söhne Mono', 'ui-monospace', 'SF Mono', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
      },
      borderRadius: {
        sm: '4px',
        md: '8px',
        lg: '12px',
        pill: '9999px',
      },
      transitionTimingFunction: {
        spring: 'cubic-bezier(0.32, 0.72, 0, 1)',
        out: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      boxShadow: {
        'depth-1': '0 1px 2px rgba(10,14,20,0.04)',
        'depth-2': '0 1px 3px rgba(10,14,20,0.06), 0 1px 2px rgba(10,14,20,0.04)',
        'depth-3': '0 4px 12px rgba(10,14,20,0.07), 0 2px 4px rgba(10,14,20,0.04)',
        'depth-4': '0 8px 24px rgba(10,14,20,0.09), 0 4px 8px rgba(10,14,20,0.05)',
        'float': '0 12px 40px -5px rgba(10,14,20,0.12), 0 4px 12px -5px rgba(10,14,20,0.07)',
        'volt': '0 4px 16px rgba(198,255,61,0.18), 0 1px 3px rgba(10,14,20,0.06)',
        'premium': '0 4px 16px rgba(198,255,61,0.18), 0 1px 3px rgba(10,14,20,0.06)',
      },
    },
  },
  plugins: [],
};

export default upwayPreset;
