# Changelog

All notable changes to `@upway/ui` are documented here.

The format is loosely based on [Keep a Changelog](https://keepachangelog.com/),
and this project follows the rule: **breaking changes bump the minor version
until 1.0**, and consumers must explicitly bump their pinned commit SHA.

## [0.7.0] — 2026-08-03

### Light Stage becomes the default; legacy palettes quarantined behind explicit stage opt-in

**The problem:** `tokens.css` still shipped the retired brands as unscoped `:root` defaults — the cream/Forest/Volt/Fraunces "public" palette AND the zinc/cyan/gold "lab" palette. Fraunces was the default `--font-display` and cyan the default `--primary` unless a consumer opted into `[data-upway-stage="light"]`. Any new or unconfigured consumer silently inherited a retired brand.

**The fix (scoping beats deleting for one release):**

- **`:root` defaults are now Light Stage** (Design Kernel v3, locked 2026-07-24): semantic tokens (`--color-*`, `--font-*`) and the brand-bearing legacy tokens (`--primary`, `--ai-accent`, `--accent-*`, `--info`, `--nav-active`, `--gradient-cta`, `--hero-bg`, orbs, glass accents) resolve to stage/ink/violet with Clash Display + Satoshi + Geist Mono. Values mirror `light-stage.css`.
- **`[data-upway-stage="light"]` is unchanged** and resolves to identical values — consumers already on Light Stage see zero visual diff.
- **classic stage (opt-in only):** cream/Forest/Volt/Fraunces primitives + semantics + the legacy re-map now live under `[data-upway-stage="classic"]`, with `[data-upway-surface="public"]` kept as a legacy alias. Pinned consumers that set the attribute are unchanged.
- **lab stage (opt-in only):** zinc/cyan/gold primitives + semantics live under `[data-upway-stage="lab"]`, with `[data-upway-surface="lab"]` / `[data-app-mode="lab"]` kept as legacy aliases. The scope re-asserts the cockpit values for the brand-bearing legacy tokens, so lab-light and lab-dark are unchanged.
- **Neutral structural tokens** (grays, shadows, score/status colors, glass neutrals, aliases) stay global so components keep rendering everywhere.
- **`tailwind-preset.js`:** same treatment — semantic classes fall back to Light Stage values; legacy color names (`brand-cream`, `brand-bone`, `brand-ink`, `brand-forest`, `brand-volt`, `gold`, `serif`) are kept with literal fallbacks so existing class usage in pinned consumers keeps rendering.

**Deprecation:** the classic and lab stages are scheduled for deletion once landing and blog complete their kernel bump. Do not build new surfaces on them.

**Consumer migration:** nothing changes until a consumer bumps its pinned SHA. Surfaces that want the retired look after bumping must set `data-upway-stage="classic"` (or keep `data-upway-surface="public"`). Unconfigured consumers now get Light Stage.

## [0.6.0] — 2026-05-17

### Scope legacy tokens by surface — `app.upway.travel` finally looks different from `lab.upway.travel`

**The bug we shipped:** the two-scope contract (locked 2026-05-15) wired up the *semantic* tokens (`--color-bg`, `--color-text`, `--color-brand`) to flip between cream/Forest on public and zinc/cyan on lab — but **every existing component still references the *legacy* tokens** (`--bg`, `--surface`, `--text`, `--primary`, `--border`, etc.), which were defined only on `:root` with zinc-light + cyan values. So `app.upway.travel` (public) and `lab.upway.travel` (lab) rendered visually identically beneath the body background, because only the semantic `--color-bg` actually differed.

**The fix:** add a `[data-upway-surface="public"]` override block at the end of `tokens.css` that re-points the legacy tokens to brand-native cream / Forest / Ink. Components don't change; they keep using `var(--bg)`, which now resolves to cream on public and stays zinc on lab.

This is non-breaking — `[data-theme="dark"]` still wins for lab dark mode, and consumers without `data-upway-surface` set still see the legacy zinc-light defaults.

**Re-mapped under `[data-upway-surface="public"]`:**

- Backgrounds: `--bg` → cream, `--surface` → bone, `--surface2/3` → cream/bone blends
- Borders: `--border` / `--border2` / `--border-strong` → Forest with 12/18/28% alpha
- Text: `--text` / `--text-2` / `--text-3` / `--text-muted` → Ink with falling alpha
- Primary: `--primary` / `--primary-hover` / `--primary-muted` → Forest (NEVER cyan on public)
- AI accent: `--ai-accent` → Forest, `--ai-muted` → Sage
- Glass surfaces: cream/bone with Forest hairlines, not white with black hairlines
- Glass shadows: Forest-deep depth, not generic black
- CTA gradient: Forest-deep → Forest → Sage, not cyan→teal
- Hero bg: cream gradient, not dark slate
- Ambient orbs: Sage/Forest breath, not cyan
- Scrollbar: Forest-toned, not zinc
- Info / cabin-premium-economy: Forest, not cyan

**Untouched:** semantic tokens (already correct), score colors (status signals, scope-invariant), cabin first/business (status signals), `:root` defaults (still apply to consumers without surface attribute), `[data-theme="dark"]` lab dark overrides.

**Consumer migration:**

After merge, bump `@upway/ui` SHA in `Upway/frontend/package.json` and redeploy. No component code needs to change. `app.upway.travel` should immediately render cream + Forest instead of zinc + cyan.

## [0.5.0] — 2026-05-16

### Graduate 6 more inlined components — wave 2, non-breaking, additive

Pulls the action-chip control (just shipped in `Upway` PR #106), the three magazine-pacing editorial cards (DataCallout, RouteCard, AdviserSnippet), and the two Field Note dossier primitives (DossierZone, AskUpway) out of consumer repos (`Upway/frontend`, `upway-blog`) and into `@upway/ui`. Same discipline as wave 1: graduate first, migrate consumers later. All six pull color from the semantic `--color-*` tokens and font from the `--font-display` / `--font-ui` / `--font-mono` variables, so they auto-retune per public vs lab scope.

**Added:**

- `<ActionChip>` — the adviser action-chip control. Forest primary in `public` mode, cockpit cyan primary in `lab` mode; Bone/Ink secondary with thin Ink hairline in both. Geist Sans 13.5px label, optional trailing mono fragment (e.g. "60K · 4.2¢"). Reduced-motion respected (press-scale + hover-lift suppressed). Props: `{ label, mono?, variant?, onClick?, mode?, className?, ariaLabel?, disabled? }`.
- `<DataCallout>` — editorial magazine-pacing stat card. Mono headline stat + Fraunces caption + optional mono source footer. Used between Field Note cards on the blog homepage so the page reads as a magazine spread. Props: `{ stat, caption, source?, className? }`.
- `<RouteCard>` — static single-route summary. Mono route + cabin small-caps + points/CPP grid + optional program footer. Sibling to `<RouteEconomicsRow>` but as an editorial paper card rather than a live result row. Props: `{ route, cabin, points, cpp?, program?, className? }`.
- `<AdviserSnippet>` — "From the adviser" Q&A card. Italic Fraunces question (dimmed) + italic Fraunces answer (full Ink) + mono attribution footer. Props: `{ question, answer, attribution, className? }`.
- `<DossierZone>` — generic Field Note dossier zone shell. Mono small-caps label + content area. `mono` flag switches the body to monospace (e.g. for the Availability note). Replaces the four ad-hoc zone implementations inside `Dossier.tsx` (Summary, Best for, Route math, Availability note). Props: `{ label, children, mono?, className? }`.
- `<AskUpway>` — seeded-prompt CTA. Renders a paper card with the seeded prompt visible (Fraunces italic) + a Volt mono "Ask Upway →" button. Defaults `href` to `https://upway.travel/?ask=<encoded prompt>` when not provided. Volt is brand-locked to money/CTA moments — this is one such moment. Props: `{ prompt, href?, className? }`.

**Consumer migration (separate PRs — `@upway/ui` first per AGENTS.md §4):**

- `Upway/frontend` — replace `src/components/ui/ActionChip.tsx` with `<ActionChip mode={mode}>` (read mode from `useUIStore`).
- `upway-blog` — replace `DataCalloutCard`, `RouteCard`, `AdviserSnippetCard` in `src/components/EditorialCards.tsx` with the new graduated versions. Inside `src/components/Dossier.tsx`, replace the four inlined zones with `<DossierZone>` and the inlined `AskUpway` with `<AskUpway>`.

No consumers touched in this PR — discipline rule: graduate first, migrate second. After merge, downstream PRs bump their pinned `@upway/ui` SHA in `package.json`.

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
