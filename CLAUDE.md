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

## Brand (2026-05 lock)

- **Primary (Ink):** `#0A0E14` — backgrounds, app shell
- **Secondary (Bone):** `#F4F1EA` — light-mode surfaces, marketing
- **Accent (Volt):** `#C6FF3D` — money / CTA / value ONLY. Never decorative.
- **Display:** GT Maru
- **Body:** Satoshi
- **Mono:** Söhne Mono (numerals, prices)

## Brand assets

`brand-assets/` — logo PNGs, spec HTML. Source of truth for marketing materials.

## Breaking changes

Use the PR template's "Breaking change?" section. List every consumer that needs a SHA bump after merge.

See `Upway/CLAUDE.md` for the full GitHub-gospel rules.
