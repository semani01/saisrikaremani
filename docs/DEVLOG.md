# Portfolio Grand Prix — Dev Log

> **Engineering journal for Portfolio Grand Prix (PGP).** After each work session, write an entry. This serves three purposes: (1) gives Claude Code full context when resuming after a break, (2) documents your engineering process as portfolio content itself, (3) your own learning record.

---

## Phase 0 — 2026-03-26

### What I built
- Created the project documentation suite: CHECKLIST.md, DEVLOG.md, ARCHITECTURE.md, README.md
- Thoroughly mapped out the full 9-phase build plan from ROADMAP.md
- Established the folder structure, tech stack decisions, and naming conventions

### What broke / gotchas
- Nothing broken yet — pre-code phase. All decisions are planned.

### Lessons learned
- The F1 metaphor is tighter than expected. Every real portfolio section maps cleanly to an F1 concept (tire compounds = languages, pit stops = jobs, DRS zones = projects). This is going to read as intentional rather than gimmicky.
- Three.js + React Three Fiber for a track-based experience is the right call — procedural spline generation means we don't need a 3D artist.
- The `gameStore.isPaused` flag as a single source of truth for all "car stop" scenarios is elegant. One flag to rule them all.

### Decisions made
- **Next.js App Router** over Pages Router: needed for server components, API routes, and ISR for GitHub/LeetCode data. Modern approach.
- **Zustand over Redux**: lighter, no boilerplate, works natively with R3F's `useFrame` loop.
- **ElevenLabs free tier (10k chars/month)**: sufficient for a portfolio. Web Speech API as fallback ensures it never breaks.
- **Procedural track** (Catmull-Rom spline) over a downloaded 3D circuit: more control over POI placement, no large asset download, and technically more impressive.
- **`saisrikaremani` repo name** (real name, not codename): professional discoverability > branding. The F1 branding lives inside the UI.

### Next session plan
- Run Phase 0: `npx create-next-app@latest`, install all packages, scaffold folder structure, scaffold Zustand stores, scaffold data files, set up GitHub repo, connect Vercel.

---

## Phase 0 — 2026-03-30

### What I built
- Initialized fresh git repo inside `saisrikaremani/` (fixed parent `.git` at `C:/Users/saisr` that was tracking the entire home directory)
- Scaffolded Next.js 16.2.1 with TypeScript, Tailwind v4, App Router, `src/` dir layout
- Installed all PGP-specific packages: R3F, drei, postprocessing, Three.js, Zustand, Howler, Tone.js, Anthropic SDK, Framer Motion + type definitions
- Created full component folder structure: garage, lights, track, hud, projects, engineer, podium, audio, ui
- Scaffolded `src/types/index.ts` — all TypeScript interfaces for the full app (GamePhase, CarTeam, POI, DRSZone, ProjectItem, SkillItem, store shapes, etc.)
- Scaffolded `src/store/gameStore.ts` — Zustand game state with all actions (phase, car, position, sector, POI, overlay/pause, race stats, reset)
- Scaffolded `src/store/audioStore.ts` — Zustand audio state (mute, voice mute, volumes)
- Scaffolded `src/data/portfolio.ts` — pre-populated with ALL real resume data: 2 education entries, 4 experience entries, 8 full project case studies with architecture/decisions/results, 8 skill items with proficiency percentages, GitHub/LeetCode stat placeholders, contact info
- Scaffolded `src/data/f1Mappings.ts` — full F1 terminology map, 6 tire compounds, sector info, team card configs
- Scaffolded `src/data/trackLayout.ts` — circuit spline control points, POI positions, 8 DRS zone ranges, track config constants
- Scaffolded `src/lib/` stubs: `claude.ts`, `elevenlabs.ts`, `github.ts`, `leetcode.ts`
- Scaffolded `src/app/api/chat/route.ts` and `src/app/api/tts/route.ts` stub routes
- Replaced default `page.tsx` with R3F Canvas (dark background, red box, orbit controls)
- Created `.env.example` with all 4 key names documented
- Restored custom `README.md`, fixed `package.json` name from `pgp_temp` to `saisrikaremani`

### What broke / gotchas
- **The git repo was initialized at `C:/Users/saisr`** (the entire home directory). Fix: `git init` inside `saisrikaremani/` creates a nested repo that takes precedence for all git operations from within that folder.
- **`create-next-app` blocks on any existing files** in the target directory, even `README.md`. Fix: scaffolded in a sibling `pgp_temp/` directory, then copied files over manually.
- **`pgp_temp` leaked into `package.json` name**. Fixed to `saisrikaremani`.
- **`THREE.Clock` deprecation warning** in the browser console. This is internal to `@react-three/drei` and harmless — will be resolved in a future `drei` release.

### Lessons learned
- `create-next-app` is strict about existing files — always scaffold in a clean directory when the target already has files.
- Tailwind v4 no longer uses `tailwind.config.ts` — configuration is done in CSS directly. This is a breaking change from v3.
- Next.js now generates `AGENTS.md` and `CLAUDE.md` as part of the scaffold, containing Next.js-specific agent rules. These integrate cleanly with our existing `CLAUDE.md → @AGENTS.md` setup.

### Decisions made
- **Nested git repo** (instead of trying to fix the parent repo at `C:/Users/saisr`): cleanest solution, zero risk to other projects.
- **`portfolio.ts` pre-populated with real data** (not placeholder strings): Phase 1 can use actual content from day one rather than wiring up fake data.
- **`trackLayout.ts` DRS zone ranges** placed entirely in Sector 3 (t > 0.60): keeps all 8 project cards in the "Straights" sector, matching the F1 metaphor cleanly.

### Next session plan
- Push `feature/phase-0-scaffold` to GitHub, create PR, merge to main
- Connect Vercel to GitHub → `saisrikaremani.vercel.app` goes live
- Begin Phase 1: The Garage (car selection screen)

---

<!-- Template for future entries:

## Phase N — YYYY-MM-DD

### What I built
- [Bullet points of completed work]

### What broke / gotchas
- [Issues encountered and how you resolved them]

### Lessons learned
- [Technical insights, new patterns, things you'd do differently]

### Decisions made
- [Architecture or design choices and their reasoning]

### Next session plan
- [What to tackle next]

-->
