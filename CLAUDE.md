# @upway/ui — Claude CLI Project Context

## ⛔ GITHUB IS GOSPEL — NON-NEGOTIABLE

1. **GitHub `Upway-Travel/ui` (PUBLIC) is the source of truth.** Pull before you work.
2. **No direct push to `main`.** PR + squash-merge only. Branch protection enforced.
3. **CI runs on every PR** — must pass before merge.
4. **Canonical local path:** `/Users/kylefitzsimmons/upway-ui/`. Never duplicate.
5. **Consumers pin a specific commit SHA** in their `package.json` — never floating `github:upway-travel/ui`. Bumping the SHA in app/landing/blog is a deliberate act after testing.

## What This Is

The shared design system + component library. Used by `app`, `landing`, `blog`. Source of truth for brand tokens, typography, motion, and core components.

## Exports

- **Tokens:** Ink, Bone, Volt, slate scale, bone scale, radius scale, motion easings
- **Components:** Button, Card, SlidePanel, FloatingNav, ScoreRing, Badge, Toast, AnimatedCounter, UpwayLogo
- **Tailwind preset:** `tailwind-preset.js` — every consumer extends this

## Brand — two-scope contract (2026-05-15 lock)

Two scopes, opted into via `data-upway-surface` (or `data-app-mode="lab"`):

**`public` — editorial / aviation-grade.** Landing, blog, pitch-deck, app.upway.travel.
- **Cream** `#FAF9F5` — paper foundation
- **Bone** `#F4F1EA` — secondary surfaces
- **Ink** `#0A0E14` — body text
- **Forest** `#1A4D32` / **Forest-deep** `#0D2E1D` — structural depth, headings
- **Sage** `#8FBFA0` — soft accents
- **Volt** `#C6FF3D` — **confident and frequent** (rule v2, locked 2026-07-07). Badges, underlines, CTA fills, key numbers. Still one hue, still disciplined: never a background wash, never body text, and text on Volt is always Ink.
- **Gold-warm** `#C4961A` — valuation moments only

**`lab` — operational cockpit.** lab.upway.travel + internal diagnostics. Keeps the existing zinc + cyan + gold cockpit system. Cyan/teal belongs to lab/internal data contexts — NOT public brand surfaces.

**Typography (both scopes):**
- **Display:** Fraunces (Google Fonts, opsz 9..144, wght 300..900)
- **UI / Body:** Geist Sans (bundled in `/fonts/`)
- **Mono:** Söhne Mono (Klim Type Foundry — paid, licensing pending) → Geist Mono fallback

Consumers reference semantic tokens (`--color-bg`, `--color-brand`, `--color-accent`, `--font-display`, `--font-ui`, `--font-mono`), NOT primitives. The `tailwind-preset.js` exposes Tailwind classes that map to these CSS variables.

**Locked rules:**
- Public surfaces use `data-upway-surface="public"`; lab surfaces use `data-app-mode="lab"` or `data-upway-surface="lab"`.
- Cyan/teal NEVER appears in public brand surfaces.
- Volt rule v2: confident + frequent, one hue, never a wash; text on Volt is always Ink.
- Legacy palettes (sage/forest/sun/coral; cyan-only) stay for existing consumers as Tailwind aliases — do NOT use for new public surfaces.

See `CHANGELOG.md [0.3.0]` and `src/styles/tokens.css` header for details.

## Brand assets

`brand-assets/` — logo PNGs, spec HTML. Source of truth for marketing materials.

## Breaking changes

Use the PR template's "Breaking change?" section. List every consumer that needs a SHA bump after merge.

See `Upway/CLAUDE.md` for the full GitHub-gospel rules.
