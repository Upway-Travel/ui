# AGENTS.md — @upway/ui

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

**Live backlog (check before suggesting work):**
https://github.com/orgs/Upway-Travel/projects/2

**Read first every session:** `~/upway-planning/SESSION-START.md` — tech stack, runbooks, conventions, ADRs, schema reference, `@upway/ui` catalog.

---

## 2. This repo's structure

```
src/
  index.ts              Barrel export — the public API surface
  components/           Button, Input, Select, Badge, Card, ScoreRing,
                        AnimatedCounter, Skeleton, SlidePanel, Toast,
                        UpwayLogo, FloatingNav
  lib/                  cn, formatters, animations (motion presets)
  styles/               tokens.css, base.css, components.css, fonts.css,
                        glass.css, animations.css, index.css
tailwind-preset.js      Shared Tailwind preset — every consumer extends this
fonts/                  Self-hosted font files (Geist VF, GeistMono VF)
brand-assets/           Logo PNGs + spec — source of truth for marketing
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
- Tokens live in `src/styles/tokens.css` and are mirrored into Tailwind via `tailwind-preset.js`
- Brand-locked palette: **Ink** `#0A0E14`, **Bone** `#F4F1EA`, **Volt** `#C6FF3D` — Volt is money/CTA/value-only, never decorative
- Typography: GT Maru (display) / Satoshi (body) / Söhne Mono (numerals)

**Commands:**
- `npm ci` — install
- `npm run build --if-present` — CI runs this; currently a no-op (sources are shipped as-is)

There is no dev server, no Storybook, no test suite in this repo today. Visual checks happen in consumer surfaces.

---

## 3. ⛔ GITHUB IS GOSPEL — non-negotiable workflow

1. **GitHub is source of truth.** Local clones are caches — pull before work, commit before stop.
2. **No direct push to `main`.** Branch protection enforces it. `feat/*` branch → PR → squash-merge.
3. **No manual `railway up`.** Only path to prod: `git push origin main` → CI green → Railway auto-deploys.
4. **Always run `bash scripts/pre-deploy.sh` before any deploy.** It refuses if dirty/desynced/CI-red. The script is law.
5. **No build artifacts in git** (`dist/`, `node_modules/`, `.next/`, `build/`, `out/`, `coverage/`, `.turbo/`) — CI blocks them.
6. **Author email for personal commits:** `kfitzsimmons00@gmail.com` (not any SSO/work email).
7. **PR template, CODEOWNERS, branch protection are immutable infra** — only edit via a separate `chore(infra): ...` PR.
8. **Admin bypass (Kyle only) is for emergencies.** Default to PR.

If tempted to: edit prod directly, force-push, commit a `dist/`, run `railway up` from local, or skip pre-deploy — **STOP**. Open a PR.

---

## 4. Railway

- **Project:** `remarkable-dream` (id `b9d4cd51-cbd8-47f4-b4b2-9be8b8988fdf`)
- **Account:** `kfitzsimmons00@gmail.com`
- **DNS:** Cloudflare (not GoDaddy — older notes are stale)

| Service | Domain | Repo | Mode / Notes |
|---|---|---|---|
| `app` | app.upway.travel | `Upway-Travel/app` | `VITE_APP_MODE=public` — locked-down MVP |
| `app-lab` | lab.upway.travel | `Upway-Travel/app` (same `main`) | `VITE_APP_MODE=lab` — full feature set, internal |
| `blog` | stack.upway.travel | `Upway-Travel/blog` | `stack` is **intentional** (credit card stack ethos) — never rename to `blog.` |
| `landing` | upway.travel | `Upway-Travel/landing` | |
| `pitch-deck` | deck.upway.travel | `Upway-Travel/pitch-deck` | |
| `Postgres` | internal | — | Managed Railway PG |
| `ui` | — | `Upway-Travel/ui` | **Library only — no Railway service. Consumed by other repos via pinned commit SHA.** |

**Railway CLI:** to operate, specify both `-s <service>` and `-e production`. CLI is not for deploys — only inspection/logs/vars. Not relevant to this repo.

---

## 5. Tech stack quick reference

- **Language:** TypeScript (strict, ESNext, `moduleResolution: bundler`, `jsx: react-jsx`)
- **Runtime peer deps:** React 18 + ReactDOM 18, Framer Motion 12, Zustand 5
- **Hard deps:** lucide-react (icons)
- **Styling:** Tailwind CSS (consumed via `tailwind-preset.js`) + CSS variables in `src/styles/tokens.css`
- **Fonts:** Geist VF + Geist Mono VF self-hosted in `fonts/`; brand stack is GT Maru / Satoshi / Söhne Mono (resolved by consumer)
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
3. **Pick from the GitHub Project board** (https://github.com/orgs/Upway-Travel/projects/2). Mark the issue assigned to you (Codex = `@codex`, Claude = `@claude` — or just mention in PR body).
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
- **`tailwind-preset.js` still references the legacy sage/forest/sun/coral palette** even though the brand has migrated to Ink/Bone/Volt. Reconcile in a focused PR; for now consumer Tailwind configs override these locally and `tokens.css` is the live source of truth.
- **Volt is currency, not decoration.** `#C6FF3D` only appears on CTAs, money values, and value-rating moments. Never as a decorative accent or hover state.
- **Backward-compat aliases in `tokens.css`** (`--gold`, `--amber`, `--neon-purple`, `--ai-accent`, `--text2`, `--chip-bg`, etc.) are intentional kindling from the 0.2.0 brand reset — burn them down once consumer audits land, don't extend them.
- **`brand-assets/`** is the source of truth for marketing logo PNGs. The `upway-pitch-deck` and `upway-landing` repos pull from here — don't move or rename without coordinating.
- **CI blocks committed build artifacts** (`dist/`, `build/`, `node_modules/`, `.next/`, `out/`, `coverage/`, `.turbo/`). If a PR fails CI with `Build artifacts committed`, `git rm -r --cached` the offending path.
- **Public repo.** Do not commit anything that wouldn't belong on the open internet — no internal data, no env-shaped strings, no customer copy that hasn't shipped publicly elsewhere.
