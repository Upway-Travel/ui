# Changelog

All notable changes to `@upway/ui` are documented here.

The format is loosely based on [Keep a Changelog](https://keepachangelog.com/),
and this project follows the rule: **breaking changes bump the minor version
until 1.0**, and consumers must explicitly bump their pinned commit SHA.

## [0.3.0] — 2026-05-15

### Public / lab two-scope token contract — non-breaking

Resolves the 4-palette conflict (zinc/cyan/gold in `tokens.css` vs Ink/Bone/Volt in docs vs sage/forest/sun/coral in `tailwind-preset.js` vs cream/forest/gold in landing's local tokens) by introducing **two explicit semantic scopes** that consumers opt into via data attributes.

**No tokens removed.** All existing CSS variables (`--bg`, `--text`, `--primary`, etc.) remain unchanged so current consumers continue to build. Only additive changes.

**Added — primitive palette tokens:**
- `--upway-cream` `#FAF9F5`, `--upway-bone` `#F4F1EA`, `--upway-ink` `#0A0E14`
- `--upway-forest` `#1A4D32`, `--upway-forest-deep` `#0D2E1D`, `--upway-sage` `#8FBFA0`
- `--upway-volt` `#C6FF3D` (event-only — one accent per viewport)
- `--upway-gold-warm` `#C4961A`
- `--upway-zinc-50/100/900/950`, `--upway-cyan-400/600`, `--upway-gold-400` (lab primitives)

**Added — semantic scopes** in `src/styles/tokens.css`:
- `:root, [data-upway-surface="public"]` → cream/forest/Volt/Ink + Fraunces/Geist/Söhne Mono
- `[data-upway-surface="lab"], [data-app-mode="lab"]` → zinc/cyan/gold (cockpit)

**Added — semantic CSS variables for new consumers:**
- `--color-bg`, `--color-surface`, `--color-text`, `--color-brand`, `--color-brand-deep`, `--color-accent`, `--color-value`
- `--font-display` (Fraunces), `--font-ui` (Geist Sans), `--font-mono` (Söhne Mono → Geist Mono fallback)

**Tailwind preset updated** to map `brand`, `surface`, `accent`, font families to the new CSS variables. Legacy classes (`brand.sage`, `brand.sun`, `brand.coral`) preserved as static aliases — do NOT use for new public surfaces.

**Docs aligned** — `CLAUDE.md` now describes the two-scope contract; cyan/teal explicitly belongs to lab/internal, not public brand.

**Consumers**: this PR alone is no-op for `app`, `landing`, `blog`, `pitch-deck`. To migrate a surface, set `data-upway-surface="public"` on the root element (or `data-app-mode="lab"` for the lab variant) and reference the new semantic tokens. See `research/2026-05-landing-redesign/ui-palette-conflict-pr-spec.md` in `Upway-Travel/planning` for the full migration plan.

**Follow-up PRs (separate):**
1. `UpwayWordmark` with `straight` and `slanted` variants
2. `FlapDisplay` + `DepartureTicker` (graduate Solari from landing-v2/static-v2)
3. `InvitePass` / `BoardingPass` (graduate from `feat/waitlist-pass`)
4. Apply public tokens to landing/blog/deck
5. Apply public/lab shell divergence to `app`

## [0.2.0] — 2026-05-05

### Brand migration: Sage/Forest/Sun/Coral → Ink/Bone/Volt

This is a coordinated brand reset. Every consumer (`app`, `landing`, `blog`,
`pitch-deck`) must bump its pinned `@upway/ui` SHA after testing.

**New palette (locked):**
- **Ink** `#0A0E14` — primary, app shell
- **Bone** `#F4F1EA` — secondary, marketing
- **Volt** `#C6FF3D` — money / CTA / value moments **only**, never decorative
- **Slate-95** `#13181F` — surface dark
- **Bone-94** `#EEEAE0` — surface light
- **Hairline-dark** `#1E242D`, **Hairline-light** `#D9D3C5`
- **Text-Hi/Mid/Lo** `#F4F1EA` / `#8A94A4` / `#4A5260`

**Typography (locked):**
- Display: **GT Maru**
- Body: **Satoshi**
- Mono: **Söhne Mono** (numerals, prices, balances)

**Radius scale:** `sm 4px`, `md 8px`, `lg 12px`, `pill 9999px`

**Default ease:** `spring` = `cubic-bezier(0.32, 0.72, 0, 1)`

### Breaking

- `tokens.css` rewritten — all primary/AI/cyan/gold tokens replaced.
- Tailwind preset `colors.brand.{sage,forest,sun,coral}` removed.
- New Tailwind colors: `ink`, `bone`, `volt`, `slate.95`, `hairline.{dark,light}`,
  `text.{hi,mid,lo}`.
- `colors.gold.*` removed from preset; legacy `--gold-*` CSS vars are aliased to
  Volt for compatibility but should be migrated to `--volt` / `--primary` over time.
- `fontFamily.serif` removed (Upway does not use serif).
- `fontFamily.display` now points at GT Maru first, Satoshi fallback.
- `boxShadow.premium` retuned to Volt-tinted glow.

### Compatibility

A backward-compat alias layer is included in `tokens.css` so existing components
referring to `--gold`, `--amber`, `--neon-purple`, `--ai-accent`, `--text2`,
`--chip-bg`, etc. continue to render. This is intentional kindling — burn it
down in a follow-up PR after consumer audits land.

### Consumer migration

Each consumer must:
1. Bump `@upway/ui` SHA in `package.json` to this commit.
2. Re-run `npm install` and rebuild Tailwind.
3. Audit hardcoded hex usage (`#8fbfa0`, `#1a4d32`, `#e8d44d`, `#e8735a`,
   `#0891b2`, `#06b6d4`, `#c4961a`) — replace with token references.
4. Visual diff: dark mode (Ink) shell, light mode (Bone) marketing.
5. Verify Volt only appears on CTAs, money values, and value-rating moments.

## [0.1.0] — Initial release

Sage/Forest/Sun/Coral palette, Geist Sans + Satoshi + Playfair stack, original
gold-accented zinc surface system.
