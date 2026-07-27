---
last_verified: 2026-07-27
---

# @upway/ui — Claude CLI Project Context

> **Canon first.** Strategy: `~/upway-planning/UPWAY-MASTER-THESIS.md` · Design: `~/upway-planning/UPWAY-DESIGN-DIRECTION.md` · Facts: `~/upway-planning/CURRENT-STATE.md` · Process: `~/upway-planning/UPWAY-ADOPTION-GUIDE.md`. On any conflict, the canon wins over this file.

## ⛔ GITHUB IS GOSPEL — NON-NEGOTIABLE

1. **GitHub `Upway-Travel/ui` (PUBLIC) is the source of truth.** Pull before you work.
2. **No direct push to `main`.** PR + squash-merge only. Branch protection enforced.
3. **CI runs on every PR** — must pass before merge.
4. **Canonical local path:** `/Users/kylefitzsimmons/upway-ui/`. Never duplicate.
5. **Consumers pin a specific commit SHA** in their `package.json` — never floating `github:upway-travel/ui`. Bumping the SHA in app/landing/blog is a deliberate act after testing.

## What This Is

The shared design system + component library — the kernel. Used by `app`, `landing`, `blog`. Source of truth for brand tokens, typography, motion, and core components. Brand is code-first: if it is not in `@upway/ui`, it is not the brand.

## Brand — current system: Light Stage (locked 2026-07-24)

Design direction §5.2. Ships from `src/styles/light-stage.css`, opt-in via `[data-upway-stage="light"]` on a root element. Kernel foundation landed via ui PR #18; the app-wide flip is app PR #398.

- **Stage:** near-white `#FAFAFC`, white cells with 1px ink borders and soft lift shadows, dot-grid air. No neon, no glow, ever.
- **Ink:** `#12121A` with mid/dim alpha steps.
- **Accent:** violet `#6C3DE8` used as pigment (CTAs, chips, active states).
- **Type:** Clash Display (display) · Satoshi (UI and body) · Geist Mono (labels and data only, never body copy). All self-hosted in `fonts/`.
- **Utilities:** `.stage-dots` · `.stage-horizon` · `.stage-cell` · `.stage-ghost` · `.stage-display` · `.stage-label` · `.stage-btn` · `.stage-marquee` · `.stage-grad`.

**Accent status (design §5.3):** violet is the incumbent, not the settled answer. A travel-document stamp accent (customs-stamp red or departure-board amber) is being prototyped against violet; the decision lands by 2026-08-15. The swap is one token and blocks nothing. Do not treat violet as permanent in new work; do not swap it early either.

**Scheduled for removal (design §5.2):** the gradient utilities — `.stage-grad`, the violet to plum to teal text gradient, and the `--plum` / `--stage-teal` companion tokens. Three-hue gradient text is retired brand language. Do not add new usages; removal lands with the texture pass.

**Composition rules (design §5.2):** stage-cells are composition for index surfaces (Dashboard, Discover) where browsing is the job. Bento as brand identity is retired. The chat transcript is strictly sequential; the landing hero is one agent moment, no cell mosaic; marquee energy is landing-only, not brand language.

## Legacy layers — do not build from these

- **Cream / Forest / Volt / Fraunces** (`tokens.css`, the Design Kernel v2.x era): legacy implementation only, kept while migration to Light Stage completes. Not a parallel public direction.
  - *Volt rule v2 (locked 2026-07-07), preserved as history:* Volt `#C6FF3D` confident and frequent — badges, underlines, CTA fills, key numbers; one hue; never a background wash; text on Volt is always Ink. **Note (2026-07-27): this rule is superseded on app surfaces by Light Stage. The active accent is violet `#6C3DE8`, itself incumbent pending the 2026-08-15 stamp-accent decision (design §5.3), and the gradient utilities are scheduled for removal (design §5.2).**
- **Zinc / cyan / gold "lab" cockpit:** historical. `lab.upway.travel` was deleted 2026-05-18. Cyan never appears on public surfaces.
- **Backward-compat aliases in `tokens.css`** (`--gold`, `--neon-purple`, `--ai-accent`, etc.): kindling from the 0.2.0 reset. Burn down when consumer audits land; never extend.

Consumers reference semantic tokens (`--color-bg`, `--color-brand`, `--color-accent`, `--font-display`, `--font-ui`, `--font-mono`), not primitives. `light-stage.css` remaps the semantic tokens inside its scope so kernel-derived consumers inherit the stage.

## Brand assets — the `@upway/ui/brand/` contract (design §5.7)

`brand-assets/` (favicon.svg, logo PNGs, spec HTML) is the interim home. It is being replaced by the kernel brand-asset contract, which makes brand infrastructure code that ships from here:

- `@upway/ui/brand/` will ship `favicon.svg` plus the generated icon set, per-surface OG templates, `logo.svg` in the approved lockups, and a `manifest.webmanifest` base — one source SVG, all sizes generated at build, never hand-edited per repo.
- The current wordmark is the Clash roman "upway" with the violet tail; the kernel asset must match it and the favicon derives from the same mark.
- A surface may not override a kernel brand asset locally. `ui-consistency.yml` extends to brand-asset hashes.
- Every public surface implements the metadata contract in design §5.7 (title patterns, canonical URLs, OG cards, structured data, theme-color from tokens).

Until that lands, treat `brand-assets/` as read-mostly and coordinate any change with the §5.7 contract.

## Breaking changes

Use the PR template's "Breaking change?" section. List every consumer that needs a SHA bump after merge.

See `~/Upway/CLAUDE.md` for the full GitHub-gospel rules.
