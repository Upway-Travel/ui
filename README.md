---
last_verified: 2026-07-27
---

# `@upway/ui` — the Upway kernel

> The single source of truth for the Upway brand. Tokens, type, motion, primitives, the icon. Every surface consumes this package.

If it isn't in `@upway/ui`, it isn't the brand.

> **Canon:** `~/upway-planning/UPWAY-DESIGN-DIRECTION.md` (design) · `~/upway-planning/CURRENT-STATE.md` (facts). The canon wins over this file on any conflict.

---

## The contract — Light Stage (locked 2026-07-24, design §5.2)

- **Stage:** near-white `#FAFAFC` · white cells, 1px ink borders, soft lift shadows · dot-grid air · no neon, no glow.
- **Ink:** `#12121A`.
- **Accent:** violet `#6C3DE8` as pigment (CTAs, chips, active states). *Incumbent, not settled:* the stamp-accent decision (customs-stamp red vs departure-board amber vs violet stays) lands by 2026-08-15 per design §5.3. One-token swap; blocks nothing.
- **Type:** Clash Display (display) · Satoshi (UI and body) · Geist Mono (data and labels only, interim face per design §5.4).
- **Ships from** `src/styles/light-stage.css`, opt-in via `[data-upway-stage="light"]`.
- **Scheduled for removal (design §5.2):** `.stage-grad` and the violet to plum to teal gradient text, plus the `--plum` / `--stage-teal` companions. Do not add new usages.
- **Voice:** see design direction §13. Claim verbs: lines up, shows, checks, walks you through. Never lead with "AI". No en or em dashes in rendered copy.

> **Historical note — the Volt rule v2 (locked 2026-07-07):** Volt `#C6FF3D` confident and frequent — badges, underlines, CTA fills, key numbers; never a wash; text on Volt always Ink. **Superseded 2026-07-27 on app surfaces by Light Stage.** The cream/Fraunces/Volt layer in `tokens.css` remains only while migration completes; the violet accent above is the active accent pending the 2026-08-15 decision, and the gradient utilities are scheduled for removal.

The `lab` cyan-gold cockpit is historical (lab.upway.travel deleted 2026-05-18).

---

## What ships

- **Light Stage** — `src/styles/light-stage.css` (fonts, tokens, `.stage-*` composition utilities; opt-in scope)
- **Tokens (legacy layer)** — `src/styles/tokens.css`, also exposed via the Tailwind preset.
- **Brand marks** — `UpwayLogo` · `UpwayMark` · `UpwayIcon` (squircle, app-icon lockup) · `UpwayWordmark`
- **Primitives** — `Button` · `Input` · `Select` · `Badge` · `Card` · `Skeleton` (+ `SkeletonText`, `SkeletonCard`) · `Toast` (+ `useToastStore`, `toast`) · `SlidePanel` (+ `SlidePanelHeader`)
- **Layout / nav** — `FloatingNav`
- **Numerics / motion** — `AnimatedCounter` · `ScoreRing` · `FlapDisplay` · `DepartureTicker`
- **Editorial / stack** — `FieldNoteCard` · `AppMockupFrame` · `EditorialCaption` · `RouteEconomicsRow` · `AuditTrailFooter`
- **Composite** — `ActionChip` · `DataCallout` · `RouteCard` · `AdviserSnippet` · `DossierZone` · `AskUpway`
- **Tailwind preset** — `./tailwind-preset` (every consumer extends this)
- **Utilities** — `cn` · formatters · animations

---

## Consumer pin pattern

Consumers pin a **specific commit SHA** — never `main` (CI determinism, no surprise breakage).

```json
"@upway/ui": "github:upway-travel/ui#<sha>"
```

Bumping the SHA in `app` / `landing` / `blog` is a **deliberate act** after testing. The propagation pipeline:

```bash
./scripts/bump-kernel.sh <new-sha>   # opens auto-bump PRs across all consumers
```

(Run after every kernel `main` merge.)

---

## Sister repos

| Repo | Surface | Role |
|---|---|---|
| [`app`](https://github.com/Upway-Travel/app) | [app.upway.travel](https://app.upway.travel) | The agent canvas — Railway, stays on Railway |
| **`ui`** *(this repo)* | — | **The kernel** — tokens, type, primitives, the icon. Public repo. |
| [`landing`](https://github.com/Upway-Travel/landing) | [upway.travel](https://upway.travel) | Proof surface — Vercel (awaiting DNS flip) |
| [`blog`](https://github.com/Upway-Travel/blog) | [stack.upway.travel](https://stack.upway.travel) | The Stack, credibility engine — Vercel (awaiting DNS flip) |
| [`pitch-deck`](https://github.com/Upway-Travel/pitch-deck) | deck | Investor deck — Vercel; does not yet consume the kernel (rebrand pending, canon D3) |
| [`planning`](https://github.com/Upway-Travel/planning) | — | Canon + docs |

(Org total is 8 repos per CURRENT-STATE §9; `research` and `git-buddy-connect` omitted here. There is no brand-guide repo.)

---

## ⛔ GitHub is gospel

- **Pull before you work, commit before you stop.**
- **No direct push to `main`** — branch protection enforced. PR + squash-merge only.
- CI runs on every PR — must pass before merge.
- Canonical local path: `~/upway-ui/`. Never duplicate.
- **Breaking change?** Note it in the PR description and list every consumer that needs a SHA bump after merge.

---

## Brand assets

- `brand-assets/` — favicon.svg, logo PNGs, spec. Interim home only.
- **Coming contract (design §5.7):** brand infrastructure ships from `@upway/ui/brand/` — one source SVG for the mark (Clash roman "upway" with the violet tail), generated favicon/icon set, per-surface OG templates, manifest base. Surfaces may not override kernel brand assets locally; `ui-consistency.yml` extends to asset hashes. Coordinate any `brand-assets/` change with that contract.

---

## Local

```bash
git pull origin main
# No install step needed — consumers reach in via the GitHub SHA pin.
```

For typecheck while editing:

```bash
cd <consumer-repo>
npm run typecheck   # picks up your local file edits if you've linked
```

---

## License

Proprietary — Upway-Travel.
