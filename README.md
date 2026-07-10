# `@upway/ui` — the Upway kernel

> The single source of truth for the Upway brand. Tokens, type, motion, primitives, the icon. Every surface consumes this package.

If it isn't in `@upway/ui`, it isn't the brand. **Locked Design Kernel v2.0 — 2026-05-27.**

---

## The contract

- **8 tokens (one theme across all surfaces):**
  Cream `#FAF9F5` · Bone `#F4F1EA` · Ink `#0A0E14` · Forest `#1A4D32` · Forest-deep `#0D2E1D` · Sage `#8FBFA0` · **Volt `#C6FF3D`** *(EVENT-ONLY — one per viewport)* · Gold-warm `#C4961A`
- **3 typefaces:** Fraunces (display, italic axis) · Geist Sans (UI) · Geist Mono (data / labels)
- **Voice:** Travel Hacker — 60% Cleo banter · 25% Mejuri restraint · 15% Liquid Death anti-establishment. Specific over vague. Concrete over abstract. Comparative over general. **Never say "AI"** — if it could be swapped for "magic", delete it.

> **The Volt rule v2 (locked 2026-07-07):** Volt is confident and frequent — badges, underlines, CTA fills, key numbers. One hue, disciplined: never a background wash, never body text, and text on Volt is always Ink. (v1's one-per-viewport cap was retired with the bold-minimalism direction lock.)

The `lab` cyan-gold cockpit was deprecated 2026-05-27.

---

## What ships

- **Tokens** — `src/styles/tokens.css`, also exposed via the Tailwind preset.
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

Bumping the SHA in `app` / `landing` / `blog` / `pitch-deck` / `brand-guide` is a **deliberate act** after testing. The propagation pipeline:

```bash
./scripts/bump-kernel.sh <new-sha>   # opens auto-bump PRs across all consumers
```

(Run after every kernel `main` merge.)

---

## Sister repos

| Repo | Surface | Role |
|---|---|---|
| [`app`](https://github.com/Upway-Travel/app) | [app.upway.travel](https://app.upway.travel) | The chat-canonical product |
| **`ui`** *(this repo)* | — | **The kernel** — tokens, type, primitives, the icon |
| [`landing`](https://github.com/Upway-Travel/landing) | [upway.travel](https://upway.travel) | Marketing / waitlist |
| [`blog`](https://github.com/Upway-Travel/blog) | [stack.upway.travel](https://stack.upway.travel) | Editorial / journal |
| [`pitch-deck`](https://github.com/Upway-Travel/pitch-deck) | [deck.upway.travel](https://deck.upway.travel) | Investor presentation |
| [`brand-guide`](https://github.com/Upway-Travel/brand-guide) | brand.upway.travel | Living Design Kernel v2.0 |

---

## ⛔ GitHub is gospel

- **Pull before you work, commit before you stop.**
- **No direct push to `main`** — branch protection enforced. PR + squash-merge only.
- CI runs on every PR — must pass before merge.
- Canonical local path: `~/upway-ui/`. Never duplicate.
- **Breaking change?** Note it in the PR description and list every consumer that needs a SHA bump after merge.

---

## Brand assets

- `brand-assets/` — logo PNGs, spec, marketing materials.
- `brand-assets/icon-rework-v2.html` — locked v2.2 paper-plane mark spec sheet (scratch — not the production source).

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
