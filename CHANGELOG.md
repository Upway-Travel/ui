# Changelog

All notable changes to `@upway/ui` are documented here.

The format is loosely based on [Keep a Changelog](https://keepachangelog.com/),
and this project follows the rule: **breaking changes bump the minor version
until 1.0**, and consumers must explicitly bump their pinned commit SHA.

## [0.4.0] — 2026-05-16

### Graduate 5 inlined editorial primitives — non-breaking, additive

Pulls the article-preview, app-mockup chrome, editorial caption, route-economics row, and audit-trail footer patterns out of consumer repos (landing, blog, app) and into `@upway/ui` so future PRs import instead of duplicating. Discipline win — stops drift. All five pull color from the semantic `--color-*` tokens and font from the `--font-display` / `--font-ui` / `--font-mono` variables, so they auto-retune per public vs lab scope.

**Added:**

- `<FieldNoteCard>` — editorial article-preview card. Optional hero image, Fraunces title, mono `FILED N DAYS AGO · CATEGORY`, one-line snippet, optional `featured` variant with larger hero + title. Reduced-motion respected (hover lift suppressed). Props: `{ title, snippet, image?, filed, category, href, featured?, external?, className? }`.
- `<AppMockupFrame>` — generic SVG-grade chrome frame for an app screenshot or mocked UI. macOS-style dot row + mono `UPWAY · ADVISER` caption configurable via `title`. Optional sub-caption below. Props: `{ children, title?, caption?, mono?, className?, ariaLabel? }`.
- `<EditorialCaption>` — net new. The hung mono small-caps index + Fraunces italic title pattern used in the landing rethink Product Proof section. Optional muted body line. `sm` / `md` / `lg` sizes, `stacked` / `inline` layout. Reduced-motion respected (entrance fade suppressed). Props: `{ index?, title, body?, size?, layout?, animate?, className? }`.
- `<RouteEconomicsRow>` — mono route + cabin + points + tax + CPP + seats inline row, with optional Volt-filled CPP badge when `cpp` is provided (Volt is money/value-only per brand contract). Optional signal-label footer (e.g. "ANA SAVER"). Props: `{ route, cabin, points, tax?, seats?, cpp?, signalLabel?, className? }`.
- `<AuditTrailFooter>` — one-liner mono caption like `CHECKED SEATS.AERO · 4M AGO · ANA SAVER`. Brand-colored leading dot optional. Props: `{ source, freshness, kind?, prefixChecked?, showDot?, className? }`.

**Consumer migration (separate PRs — `@upway/ui` first per AGENTS.md §4):**

- `landing` — replace inlined `FieldNoteCardInline` in `src/pages/landing/JournalBridge.tsx` with `<FieldNoteCard>`; replace inlined chrome in `src/components/AppMockup.tsx` with `<AppMockupFrame>` (keep the conversation body local until that lands too); adopt `<EditorialCaption>` in Product Proof section.
- `blog` — replace `FeaturedCard` + `PostCard` (in `src/components/PostCard.tsx`) with `<FieldNoteCard featured />` and `<FieldNoteCard />` respectively.
- `app` — replace the result-card route-economics inline row with `<RouteEconomicsRow>` and the source-trail caption with `<AuditTrailFooter>` (per PR #104 / 5e). `<AppMockupFrame>` is also available if the app surfaces ever embed a self-portrait mockup.

No consumers touched in this PR — discipline rule: graduate first, migrate second. After merge, downstream PRs bump their pinned `@upway/ui` SHA in `package.json`.

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
