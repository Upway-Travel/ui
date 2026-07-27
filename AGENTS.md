---
last_verified: 2026-07-27
---

# AGENTS.md — @upway/ui

> **Canon first:** `~/upway-planning/UPWAY-MASTER-THESIS.md` · `UPWAY-DESIGN-DIRECTION.md` · `CURRENT-STATE.md` · `UPWAY-ADOPTION-GUIDE.md`. The canon wins over this file on any conflict.

Shared briefing for any agent working in this repo (Codex CLI, Claude Code, etc.).
Both agents are expected to coordinate via git — see §6.

**This repo is `@upway/ui` — the shared component library and the single source of truth for every UI primitive used across Upway. Public on GitHub. No Railway deployment — this is a library, consumed by other repos via a pinned commit SHA.**

> Companion file: `CLAUDE.md` (Claude-specific extras). Anything load-bearing for collaboration lives **here**.

---

## 1. Where the code lives

**Local layout on Kyle's machine (canonical — do not recreate siblings):**
```
~/Upway/              ← app (backend + frontend + extension)
~/upway-landing/      ← marketing site (upway.travel)
~/upway-blog/         ← blog (stack.upway.travel)
~/upway-ui/           ← THIS repo — @upway/ui shared component library (public)
~/upway-pitch-deck/   ← investor deck (deck.upway.travel)
~/upway-planning/     ← markdown-only: ADRs, runbooks, API docs, prompts, brand
~/upway-research/     ← investigations, scrapers, datasets
```

**GitHub remotes (source of truth — org `Upway-Travel`):**

| Local | Remote | Visibility |
|---|---|---|
| `~/Upway` | `Upway-Travel/app` | private |
| `~/upway-landing` | `Upway-Travel/landing` | private |
| `~/upway-blog` | `Upway-Travel/blog` | private |
| `~/upway-ui` | `Upway-Travel/ui` | **public** |
| `~/upway-pitch-deck` | `Upway-Travel/pitch-deck` | private |
| `~/upway-planning` | `Upway-Travel/planning` | private |
| `~/upway-research` | `Upway-Travel/research` | private |

**Live backlog:** the open GitHub issues (#399 to #404 plus infra). Roadmap board #2 is exhausted and stale per `CURRENT-STATE.md` §4 — do not treat it as the backlog.

**Read first every session:** the canon in `~/upway-planning/` (see the pointer at the top of this file), then `SESSION-START.md` for ramp context.

---

## 2. This repo's structure

```
src/
  index.ts              Barrel export — the public API surface
  components/           Button, Input, Select, Badge, Card, ScoreRing,
                        AnimatedCounter, Skeleton, SlidePanel, Toast,
                        UpwayLogo, FloatingNav
  lib/                  cn, formatters, animations (motion presets)
  styles/               light-stage.css (CURRENT system), tokens.css (legacy),
                        base.css, components.css, fonts.css, glass.css,
                        animations.css, index.css
tailwind-preset.js      Shared Tailwind preset — every consumer extends this
fonts/                  Self-hosted: ClashDisplay 600/700, Satoshi 400/500/700,
                        Geist VF, GeistMono VF
brand-assets/           Logo PNGs + spec — interim home; being replaced by the
                        @upway/ui/brand/ contract (design direction §5.7)
tsconfig.json           Strict TS, ESNext + bundler resolution, declaration on
package.json            "@upway/ui" @ 0.1.0 — `"main"` points at src/index.ts
CHANGELOG.md            Keep-a-Changelog style, breaking changes call out consumers
.github/                CI (build + no-build-artifacts), PR template, CODEOWNERS
```

**How it's consumed:** there is no build step / no npm publish. Consumers (`app`, `landing`, `blog`, `pitch-deck`) install directly from GitHub by pinning a specific commit SHA:

```
"@upway/ui": "github:Upway-Travel/ui#<sha>"
```

Their bundler (Vite) transpiles the TS sources at consumer-build time. That means: **any change merged to `main` becomes available the moment a consumer bumps its pinned SHA** — there is no version gate. Treat every PR as a publish.

**Public API surface** is everything re-exported from `src/index.ts`:
- Components: `Button`, `Input`, `Select`, `Badge`, `Card`, `ScoreRing`, `AnimatedCounter`, `Skeleton` + `SkeletonText` + `SkeletonCard`, `SlidePanel` + `SlidePanelHeader`, `Toast` + `useToastStore` + `toast`, `UpwayLogo` + `UpwayMark`, `FloatingNav` (+ types)
- Utilities: `cn`, all of `lib/formatters`, all of `lib/animations`

**Subpath exports** (in `package.json#exports`):
- `@upway/ui/tailwind-preset` → `tailwind-preset.js`
- `@upway/ui/styles` → `src/styles/index.css`
- `@upway/ui/styles/*` → individual stylesheet files
- `@upway/ui/fonts/*` → font files

**Peer deps** (consumers must provide): `react@^18`, `react-dom@^18`, `framer-motion@^12`, `zustand@^5`. Hard dep: `lucide-react`.

**Conventions:**
- ESM only — `"type": "module"`
- Strict TS, JSX `react-jsx`, `declaration: true` (types ship from sources)
- No build output committed (CI blocks `dist/`, `build/`, etc.)
- Tokens: the CURRENT system is **Light Stage** (`src/styles/light-stage.css`, opt-in via `[data-upway-stage="light"]`, locked 2026-07-24 per design direction §5.2). Legacy tokens live in `src/styles/tokens.css` and are mirrored into Tailwind via `tailwind-preset.js` — migration residue only.
- Palette (Light Stage): stage `#FAFAFC` · ink `#12121A` · violet `#6C3DE8` as pigment, never glow or neon. Violet is the incumbent accent pending the 2026-08-15 stamp-accent decision (design §5.3). Gradient utilities (`.stage-grad`, `--plum`, `--stage-teal`) are scheduled for removal (design §5.2) — no new usages.
- Typography: Clash Display (display) / Satoshi (UI and body) / Geist Mono (data and labels only). The GT Maru and Söhne Mono era is retired; Fraunces is retired on app surfaces.

**Commands:**
- `npm ci` — install
- `npm run build --if-present` — CI runs this; currently a no-op (sources are shipped as-is)

There is no dev server, no Storybook, no test suite in this repo today. Visual checks happen in consumer surfaces.

---

## 3. ⛔ GITHUB IS GOSPEL — non-negotiable workflow

1. **GitHub is source of truth.** Local clones are caches — pull before work, commit before stop.
2. **No direct push to `main`.** Branch protection enforces it. `feat/*` branch → PR → squash-merge.
3. **This repo has no deploy** — it is a library. "Prod" for the kernel is a merged `main` plus consumer SHA bumps. Never `railway up` or `vercel deploy` anything from here.
4. **Consumers run their own pre-deploy checks.** Treat every kernel merge as a publish (see §2).
5. **No build artifacts in git** (`dist/`, `node_modules/`, `.next/`, `build/`, `out/`, `coverage/`, `.turbo/`) — CI blocks them.
6. **Author email for personal commits:** `kfitzsimmons00@gmail.com` (not any SSO/work email).
7. **PR template, CODEOWNERS, branch protection are immutable infra** — only edit via a separate `chore(infra): ...` PR.
8. **Admin bypass (Kyle only) is for emergencies.** Default to PR.

If tempted to: edit prod directly, force-push, commit a `dist/`, run `railway up` from local, or skip pre-deploy — **STOP**. Open a PR.

---

## 4. Deployment (verified 2026-07-27, mid-migration)

- **DNS:** Cloudflare (not GoDaddy — older notes are stale)
- **App + Postgres: Railway, staying on Railway** (project `remarkable-dream`, account `kfitzsimmons00@gmail.com`).
- **Landing, blog, deck: Vercel.** Git-connected and env-set as of 2026-07-27; awaiting the Cloudflare DNS flip, after which the Railway landing/blog services retire. Until the flip, Railway still serves those production domains. Tracked as issue #404.

| Surface | Domain | Repo | Notes |
|---|---|---|---|
| app | app.upway.travel | `Upway-Travel/app` | Railway, stays on Railway |
| blog | stack.upway.travel | `Upway-Travel/blog` | Vercel (awaiting DNS flip). `stack` is **intentional** — never rename to `blog.` |
| landing | upway.travel | `Upway-Travel/landing` | Vercel (awaiting DNS flip) |
| pitch-deck | deck.upway.travel | `Upway-Travel/pitch-deck` | Vercel |
| ui | — | `Upway-Travel/ui` | **Library only — no deploy. Consumed via pinned commit SHA.** |

`lab.upway.travel` was **deleted 2026-05-18** — any reference to an `app-lab` service or `VITE_APP_MODE=lab` is residue.

---

## 5. Tech stack quick reference

- **Language:** TypeScript (strict, ESNext, `moduleResolution: bundler`, `jsx: react-jsx`)
- **Runtime peer deps:** React 18 + ReactDOM 18, Framer Motion 12, Zustand 5
- **Hard deps:** lucide-react (icons)
- **Styling:** Tailwind CSS (consumed via `tailwind-preset.js`) + CSS variables in `src/styles/tokens.css`
- **Fonts:** Clash Display + Satoshi + Geist VF + Geist Mono VF, all self-hosted in `fonts/`; the brand stack is Clash Display / Satoshi / Geist Mono (Light Stage, design §5.5)
- **Motion:** Framer Motion presets in `src/lib/animations.ts`; default spring ease `cubic-bezier(0.32, 0.72, 0, 1)`
- **State (Toast only):** Zustand store exported as `useToastStore` + `toast` helper
- **Build:** none — TS sources ship as-is; consumers transpile with their own bundler
- **CI:** GitHub Actions — `npm ci`, optional `npm run build`, blocks committed build artifacts
- **Versioning:** semver in `package.json` + `CHANGELOG.md`; **consumers pin a specific commit SHA**, not a version range

---

## 6. Agent collaboration protocol

Two coding agents (Codex CLI + Claude Code) operate in this tree. To avoid stepping on each other:

1. **One agent per branch.** Each session creates a `feat/*` branch and stays on it. Never edit `main` directly.
2. **Pull before you edit.** `git pull --rebase origin main` at session start.
3. **Pick from the open GitHub issues** (the Roadmap board #2 is exhausted and stale per `CURRENT-STATE.md` §4). Mark the issue assigned to you (Codex = `@codex`, Claude = `@claude` — or just mention in PR body).
4. **Don't touch the same file in parallel.** If you see another agent's branch is touching a file (`git branch -a | grep feat`, then `git log --oneline <branch> -- <path>`), pick a different file or coordinate via the issue.
5. **PR descriptions must say which agent wrote the code** (one line at the top: `Authored by: Codex CLI` or `Authored by: Claude Code`).
6. **For ambiguous "why" questions** — read `~/upway-planning/strategy/` and `~/upway-planning/adrs/`. Do not invent rationale.
7. **Respect `scripts/pre-deploy.sh` and branch protection.** No exceptions.

If a conflict happens: the agent that opened the PR first owns the merge. The other rebases.

---

## 7. Where the gotchas hide

- **This repo is the SINGLE SOURCE for UI primitives.** Other repos (`app`, `landing`, `blog`, `pitch-deck`) **must not** duplicate a primitive locally — they import from `@upway/ui`. If a consumer needs a new primitive, add it here first, bump the SHA there second. Kyle reverts on sight (`feedback_ui_library_enforcement`).
- **Bump the version on every change.** `package.json#version` + `CHANGELOG.md` entry. Even additive changes get a patch bump. The PR template's "Breaking change?" section must list every consumer impacted.
- **PR descriptions must spell out consumer-side impact.** Which of `app` / `landing` / `blog` / `pitch-deck` will need to bump their pinned SHA after merge, and whether they need code edits or just an install. Default to "consumers must bump SHA after testing."
- **No build step — sources are the package.** TS files are imported directly by consumer bundlers. That means a typo in `src/index.ts` breaks every consumer the moment they bump SHA. Treat the barrel like a release artifact.
- **`tailwind-preset.js` ≠ `tokens.css`.** Some token consumers go through Tailwind classes (preset), others through CSS variables (`tokens.css`). When adding a token, update **both** and verify dark (`[data-theme="dark"]`) and light shells.
- **`tailwind-preset.js` still references the legacy sage/forest/sun/coral palette** — pre-Light-Stage residue. Reconcile in a focused PR; for now consumer Tailwind configs override these locally and `light-stage.css` is the current source of truth.
- **The Volt rule is history.** Volt `#C6FF3D` was the cream-era accent (rule v2, 2026-07-07); Light Stage superseded it on app surfaces 2026-07-24. The active accent is violet `#6C3DE8` as pigment, incumbent pending the 2026-08-15 stamp-accent decision (design §5.3). Do not extend Volt usage.
- **Backward-compat aliases in `tokens.css`** (`--gold`, `--amber`, `--neon-purple`, `--ai-accent`, `--text2`, `--chip-bg`, etc.) are intentional kindling from the 0.2.0 brand reset — burn them down once consumer audits land, don't extend them.
- **`brand-assets/`** is the interim home for marketing logo PNGs; the target is the `@upway/ui/brand/` contract (design §5.7: one source SVG, generated icon set, OG templates, manifest base, CI-hashed). Don't move or rename without coordinating, and route new asset work through that contract.
- **CI blocks committed build artifacts** (`dist/`, `build/`, `node_modules/`, `.next/`, `out/`, `coverage/`, `.turbo/`). If a PR fails CI with `Build artifacts committed`, `git rm -r --cached` the offending path.
- **Public repo.** Do not commit anything that wouldn't belong on the open internet — no internal data, no env-shaped strings, no customer copy that hasn't shipped publicly elsewhere.
