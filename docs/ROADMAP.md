# Portfolio Grand Prix 🏎️

## F1-Themed Interactive Portfolio — Complete Build Roadmap

**Prepared for:** Sai Srikar Emani
**Environment:** Windows laptop + Claude Code + GitHub
**Target:** Recruiter-facing portfolio site showcasing ML/AI + full-stack expertise
**Date:** March 26, 2026

---

## Table of Contents

1. [Project Overview & Vision](#1-project-overview--vision)
2. [Naming Strategy](#2-naming-strategy)
3. [Finalized Tech Stack](#3-finalized-tech-stack)
4. [Git Workflow & Documentation Strategy](#4-git-workflow--documentation-strategy)
5. [Phase 0: Project Scaffolding](#phase-0-project-scaffolding--repo-setup)
6. [Phase 1: The Garage (Car Selection)](#phase-1-the-garage--car-selection-screen)
7. [Phase 2: Lights Out (Launch Sequence)](#phase-2-lights-out--launch-sequence)
8. [Phase 3: The Circuit (Track & Car)](#phase-3-the-circuit--3d-track-car--controls)
9. [Phase 4: Telemetry HUD](#phase-4-telemetry-hud)
10. [Phase 5: DRS Zones (Project Deep-Dives)](#phase-5-drs-zones--project-deep-dives)
11. [Phase 6: Race Engineer (AI Chatbot)](#phase-6-race-engineer--ai-chatbot)
12. [Phase 7: Chequered Flag (Contact & Podium)](#phase-7-chequered-flag--contact--podium)
13. [Phase 8: Audio & Polish](#phase-8-audio--visual-polish)
14. [Phase 9: Deploy & Performance](#phase-9-deploy-performance--seo)
15. [F1 Terminology Master Map](#f1-terminology-master-map)
16. [Content Inventory](#content-inventory)

---

## 1. Project Overview & Vision

### What This Is

An F1-themed interactive portfolio website where visitors select a race car, watch a lights-out sequence, and then drive along a 3D circuit. Along the track, they encounter your education, work experience, projects, skills, and stats presented as trackside elements: pit boards, LED screens, DRS zones, banners, and telemetry overlays. A race engineer AI chatbot (powered by Claude) answers questions about your career in F1 radio voice, with ElevenLabs text-to-speech delivering spoken responses.

### Why F1

- F1 is inherently data-driven. Telemetry, strategy, tire models. This directly mirrors your ML/AI expertise.
- The career-as-a-race metaphor is tight: sectors = education/experience/projects, pit stops = job changes, tire compounds = programming languages.
- F1 portfolios are essentially nonexistent. Recruiters will remember you.
- The portfolio itself IS a technical showcase: 3D rendering, AI chatbot, live data viz, spatial audio.

### Target Audience

- **Primary:** Technical recruiters and hiring managers at software/AI companies.
- **Secondary:** Fellow students, LinkedIn connections, engineering peers.
- **Tertiary:** Anyone who lands on the site organically.

### Core Design Principles

- **No redundancy:** Every HUD element earns its place. If it doesn't directly help the visitor understand your background, remove it.
- **Pause on interaction:** Car stops when project cards open, when chatbot is active, or when expanded telemetry is visible. The visitor never feels rushed.
- **Context-aware telemetry:** The minimized HUD shows info about whichever education/experience/project item is nearest. The expanded telemetry shows everything.
- **Progressive disclosure:** The track delivers a curated narrative. DRS zones offer deep dives. The telemetry overlay offers the full picture. Three layers of depth.

---

## 2. Naming Strategy

The naming follows a clear split: the GitHub repo and domain use your real name for professional discoverability, while the project has an internal F1 codename for branding within the UI.

| Element | Value |
|---------|-------|
| **GitHub repo** | `saisrikaremani` |
| **Vercel URL (free)** | `saisrikaremani.vercel.app` |
| **Future custom domain** | `saisrikaremani.com` (~$12/year when ready) |
| **Project codename** | Portfolio Grand Prix |
| **Browser tab** | Sai Srikar Emani — Portfolio Grand Prix |
| **Garage screen header** | PORTFOLIO GRAND PRIX (broadcast-style uppercase) |
| **Circuit name** | Emani International Circuit |
| **Abbreviated code** | PGP — used on minimap, matching real F1 convention (JPN, USA, MON) |

---

## 3. Finalized Tech Stack

Every decision was made collaboratively. All tools are free-tier except Claude API (~$5–15/month).

| Layer | Technology | Purpose |
|-------|-----------|---------|
| 3D Engine | React Three Fiber (R3F) | 3D car models, camera work, track rendering. React integration via @react-three/fiber and @react-three/drei |
| Framework | Next.js | SSR for SEO (recruiters google you), built-in API routes for Claude proxy. No separate backend needed |
| Styling | Tailwind CSS | Utility-first, dark mode support, fast iteration for HUD components |
| State | Zustand | Lightweight game state: car position, sector, nearby items, chat history, sound settings. R3F-native |
| Audio | Howler.js + Tone.js | Howler for samples/UI/ambient. Tone.js for dynamic engine pitch shifting based on car speed |
| AI Chat | Claude API (Sonnet 4.6) | Race engineer chatbot. System prompt maps your career to F1 terminology |
| Voice TTS | ElevenLabs (free tier) | 10k chars/month. Spoken race engineer responses. Browser Web Speech API as fallback |
| 3D Assets | Sketchfab GLTF + procedural | Generic open-wheel car model (CC license). Track built procedurally in code |
| Data: GitHub | GitHub REST API | Commit frequency, language breakdown, repo activity. Fetched at build time via ISR |
| Data: LeetCode | alfa-leetcode-api | Solved count, difficulty breakdown, streak. Displayed as trackside pit board |
| Hosting | Vercel (free tier) | Zero-config Next.js deploy. Serverless functions for API proxy. 100GB bandwidth |

### Key npm Packages

`@react-three/fiber`, `@react-three/drei`, `@react-three/postprocessing`, `three`, `zustand`, `howler`, `tone`, `tailwindcss`, `@anthropic-ai/sdk`, `framer-motion`, `next`

### Windows Development Notes

- Use PowerShell or Windows Terminal with Git Bash for Unix-style commands.
- Node.js LTS (v20+) via the official Windows installer or nvm-windows.
- VS Code with ESLint, Prettier, Tailwind IntelliSense, and Three.js Snippets extensions.
- If using Claude Code, run it in your project root. It reads all /docs files for context.

---

## 4. Git Workflow & Documentation Strategy

### Branching Model

Every phase lives on its own feature branch. This keeps main clean, gives you a clear PR history, and makes it easy to revert if something breaks.

- **main:** Production branch. Only merged-and-tested code lives here. Deploy to Vercel from this branch.
- **feature/phase-0-scaffold:** Phase 0 work. Merge to main when phase checklist is 100% complete.
- **feature/phase-1-garage:** Phase 1 work. And so on for each phase.
- **hotfix/*:** Emergency fixes to main if something breaks post-deploy.

### Commit Convention

Use conventional commits for clean history. Examples:

- `feat(garage): add car selection grid with team colors`
- `fix(hud): telemetry not updating on sector change`
- `docs: update Phase 2 checklist and log`
- `style(track): adjust kerb colors and grass texture`
- `refactor(state): migrate car position to Zustand store`

### PR & Merge Flow

For each phase:

1. Create feature branch from main: `git checkout -b feature/phase-N-name`
2. Work on the phase. Commit frequently with descriptive messages.
3. When the phase checklist is complete, push and create a PR.
4. Review the PR diff. Self-review is fine since this is a solo project.
5. Merge to main. Delete the feature branch.
6. Vercel auto-deploys from main. Verify the live site.

### Documentation Files (Maintained Throughout)

#### docs/CHECKLIST.md

A running to-do list organized by phase. Each item is a checkbox. When you start a phase, copy its checklist from this roadmap into CHECKLIST.md. Check items off as you complete them. This is your progress tracker.

#### docs/DEVLOG.md

A tech journal / engineering log. After each work session, write a brief entry covering: what you built, what broke, what you learned, and any decisions made. This serves three purposes: (1) it helps Claude Code understand context if you resume after a break, (2) it becomes portfolio content showing your engineering process, and (3) it is genuinely useful for your own learning.

**Entry template:**

```markdown
## Phase N - [Date]

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
```

#### docs/ARCHITECTURE.md

A living document describing the system architecture. Updated whenever a significant structural decision is made. Covers folder structure, state shape, API routes, component tree, and data flow.

#### README.md

Project root README. Updated with each phase: what the project is, how to run it locally, tech stack, and screenshots/GIFs of the current state. This is the first thing a recruiter sees on your GitHub repo.

---

## Phase 0: Project Scaffolding & Repo Setup

> **Duration:** 1 day | **Recommended model:** Claude Sonnet 4.6

### Goal

Set up the entire project skeleton so every subsequent phase can start building features immediately. This phase produces no visible UI but is the foundation everything sits on.

### Why Sonnet 4.6

Scaffolding is mostly boilerplate: config files, folder creation, package installation, basic wiring. Sonnet handles this quickly and accurately without needing Opus-level reasoning.

### Deliverables

- Next.js project initialized with TypeScript, Tailwind CSS, and App Router.
- React Three Fiber installed and a blank R3F Canvas rendering on the index page.
- Zustand store scaffolded with initial state shape (car selection, sector, game phase, sound settings).
- Folder structure matching the architecture plan.
- GitHub repo created, .gitignore configured, first commit pushed to main.
- docs/ folder with CHECKLIST.md, DEVLOG.md, ARCHITECTURE.md templates.
- Vercel project connected to GitHub repo (auto-deploy from main).
- Environment variables configured: ANTHROPIC_API_KEY, ELEVENLABS_API_KEY (in .env.local, added to .gitignore).

### Folder Structure

```
/saisrikaremani
  /public
    /models          ← GLTF car model(s)
    /audio           ← Sound samples (engine, lights, ambient)
    /images          ← Project screenshots, icons
  /src
    /app
      /api
        /chat        ← Claude API proxy route
        /tts         ← ElevenLabs TTS proxy route
      layout.tsx
      page.tsx       ← Entry point, routes to game
    /components
      /garage        ← Phase 1: Car selection UI
      /lights        ← Phase 2: Lights-out sequence
      /track         ← Phase 3: 3D track, car, controls
      /hud           ← Phase 4: Telemetry overlays
      /projects      ← Phase 5: DRS zone project cards
      /engineer      ← Phase 6: Race engineer chatbot
      /podium        ← Phase 7: Finish line / contact
      /audio         ← Phase 8: Sound manager
      /ui            ← Shared UI components
    /store
      gameStore.ts   ← Zustand: game state
      audioStore.ts  ← Zustand: audio state
    /data
      portfolio.ts   ← All resume/project/skill content
      f1Mappings.ts  ← F1 terminology map
      trackLayout.ts ← Circuit geometry + POI positions
    /hooks
      useCarControls.ts
      useNearbyPOI.ts
      useSectorDetection.ts
    /lib
      claude.ts      ← Claude API client
      elevenlabs.ts  ← TTS client
      github.ts      ← GitHub API fetcher
      leetcode.ts    ← LeetCode API fetcher
    /types
      index.ts       ← TypeScript interfaces
  /docs
    CHECKLIST.md
    DEVLOG.md
    ARCHITECTURE.md
  .env.local
  .env.example
  .gitignore
  README.md
  next.config.js
  tailwind.config.ts
  tsconfig.json
```

### Phase 0 Checklist

- [ ] Run `npx create-next-app@latest` with TypeScript and Tailwind
- [ ] Install R3F: `npm install @react-three/fiber @react-three/drei three`
- [ ] Install Zustand: `npm install zustand`
- [ ] Install Howler + Tone: `npm install howler tone`
- [ ] Install Anthropic SDK: `npm install @anthropic-ai/sdk`
- [ ] Install Framer Motion: `npm install framer-motion`
- [ ] Create folder structure matching architecture plan
- [ ] Scaffold gameStore.ts with initial state shape
- [ ] Scaffold audioStore.ts with initial state shape
- [ ] Create portfolio.ts with placeholder data structure for all resume content
- [ ] Create f1Mappings.ts with F1 terminology map
- [ ] Add a blank R3F Canvas to page.tsx, confirm it renders
- [ ] Create .env.example (no actual keys) and .env.local (with real keys)
- [ ] Create GitHub repo named `saisrikaremani`, push initial commit
- [ ] Connect Vercel to GitHub (deploys as saisrikaremani.vercel.app)
- [ ] Write first DEVLOG.md entry
- [ ] Update README.md with project description and local dev instructions

---

## Phase 1: The Garage — Car Selection Screen

> **Duration:** 2–3 days | **Recommended model:** Claude Sonnet 4.6

### Goal

Build the landing page: a dark, cinematic F1 garage where visitors select one of four team-inspired cars. Hovering/clicking a car reveals team-flavored stats about you. After selection, transition to the lights-out sequence.

### Why Sonnet 4.6

This is primarily UI component work: styled cards, hover animations, state management for selection. Sonnet is fast and capable for this.

### Reference Mockup

Refer to the `f1_car_selection.html` artifact created during our design session. Key elements: dark background (#0f0f13), four car slots with team accent colors (teal/Mercedes, red/Ferrari, orange/McLaren, blue/Red Bull), five lights at the top, keyboard hints at the bottom. The header reads "PORTFOLIO GRAND PRIX" in broadcast-style lettering with "Select your car to begin the race" as the subtitle.

### Design Changes From Mockup

- **Team stats on hover/click:** When a user hovers over a car card, it expands or reveals a mini stat card showing: a team-flavored tagline, 2–3 key stats about you presented in that team's personality (e.g., Ferrari's card emphasizes passion-driven projects, McLaren's emphasizes innovation-first approach), and a "Select" button.
- **Team names are original:** Silver Arrow, Scuderia, Papaya, Blue Bull. No official F1 logos.
- **Car preview:** Each card shows a colored silhouette or a small 3D preview of the car in team livery (if feasible with R3F inline).

### Component Breakdown

- **`<GaragePage />`:** Full-screen dark container. Manages which car is hovered/selected.
- **`<CarCard />`:** Individual car slot. Props: teamName, accentColor, tagline, stats, carModel.
- **`<CarStatsOverlay />`:** Expanded stats panel that appears on hover/click. Shows 2–3 resume stats in team voice.
- **`<LightsRow />`:** Five circular lights at the top. Initially dark. Used in Phase 2 for animation.
- **`<KeyboardHints />`:** Bottom bar showing control hints. Updates based on game state.

### State Updates (Zustand)

- `gameStore.selectedCar`: `null | 'mercedes' | 'ferrari' | 'mclaren' | 'redbull'`
- `gameStore.gamePhase`: `'garage'` (set on initial load)
- On car selection: set selectedCar, transition gamePhase to `'lights-out'`

### Phase 1 Checklist

- [ ] Build GaragePage component with dark theme
- [ ] Build CarCard component with four team variants
- [ ] Implement hover state with stat card expansion
- [ ] Wire car selection to Zustand gameStore
- [ ] Add keyboard support (1/2/3/4 to select, Enter to confirm)
- [ ] Add Framer Motion entrance animations
- [ ] Add Music (M) and Sound (S) toggle buttons in footer
- [ ] Test responsive layout (cards stack on mobile)
- [ ] Commit and push to `feature/phase-1-garage`
- [ ] Update CHECKLIST.md and write DEVLOG entry
- [ ] Create PR, review, and merge to main

---

## Phase 2: Lights Out — Launch Sequence

> **Duration:** 1–2 days | **Recommended model:** Claude Sonnet 4.6

### Goal

After car selection, play the iconic F1 lights-out sequence: five red lights illuminate one by one (with audio), then all go dark simultaneously ("lights out and away we go"). The screen transitions to the race track.

### Why Sonnet 4.6

Timed animation sequencing and audio sync. Sonnet handles CSS keyframes and Howler.js integration well.

### Sequence Breakdown

1. Screen fades to black. Selected car silhouette appears center-screen.
2. Five lights turn red one by one at ~1 second intervals. Each light triggers a "click" sound.
3. Random pause (0.5–3 seconds) to build tension.
4. All five lights go dark simultaneously. Engine roar sound plays.
5. Quick 0.5s blackout, then fade into the 3D track scene with car at the start/finish line.

### Audio Assets Needed

- Light activation click (short, metallic) — source from Freesound.org (CC0 license).
- Engine startup/roar — source from Freesound.org. Search "formula car engine start."
- Optional: crowd ambiance for background.

### Phase 2 Checklist

- [ ] Build LightsOutSequence component with timed animation
- [ ] Source and add audio files to /public/audio
- [ ] Integrate Howler.js for light click and engine roar sounds
- [ ] Add random delay between last light and lights-out
- [ ] Implement smooth transition from lights-out to track scene
- [ ] Respect sound toggle setting from Phase 1
- [ ] Handle edge case: user pressing back during sequence
- [ ] Commit and push to `feature/phase-2-lights`
- [ ] Update CHECKLIST.md and write DEVLOG entry
- [ ] Create PR, review, and merge to main

---

## Phase 3: The Circuit — 3D Track, Car & Controls

> **Duration:** 5–7 days | **Recommended model:** Claude Opus 4.6

### Goal

Build the core racing experience: a 3D track that looks like a real F1 circuit, a drivable car model in the selected team livery, keyboard controls for forward/backward/left/right movement, and a camera that follows the car. This is the hardest and most important phase.

### Why Opus 4.6

This phase requires complex 3D math: procedural track generation from a spline curve, car physics (simplified), camera following logic, collision boundaries, and coordinate-based sector detection. Opus's deeper reasoning handles the geometry and spatial logic far better than Sonnet.

### Track Design

The track is generated procedurally from a Catmull-Rom spline defining the center line. The spline is designed to resemble a real F1 circuit with straights, chicanes, and sweeping corners. Key properties:

- **3 Sectors:** Sector 1 (education), Sector 2 (experience), Sector 3 (projects). Each sector has a distinct visual identity: different kerb colors, trackside decoration density, and lighting mood.
- **Points of Interest (POIs):** Defined in `trackLayout.ts` as positions along the spline (0–1 normalized). Each POI has: type (education | experience | project | skill | leetcode), content ID, position, and which side of the track it appears on.
- **Track boundaries:** Invisible collision walls preventing the car from driving off-track. Grass/gravel textures beyond the kerbs.
- **Circuit minimap:** A 2D SVG overlay showing the track shape, car position, sector boundaries, and POI markers.

### Car Model & Controls

- **Model:** Download a CC-licensed open-wheel GLTF from Sketchfab. Swap materials to match selected team livery.
- **Controls:** Arrow keys or WASD. Up/W = accelerate forward, Down/S = brake/reverse, Left/A and Right/D = steer. Speed caps at a maximum. Deceleration when no key pressed (friction).
- **Camera:** Third-person follow camera positioned behind and above the car. Smooth lerp to avoid jarring movement. Built using drei's useFrame.
- **Car sounds:** Tone.js oscillator whose frequency maps to car speed. Low idle hum when stationary, rising pitch on acceleration, descending on brake.

### Trackside Elements (Placed But Not Interactive Yet)

In this phase, trackside elements are placed along the track at POI positions but are NOT yet interactive (clicking, expanding, etc. comes in Phases 4–5). They are visual markers showing the visitor that content exists here.

- **Pit boards:** Flat rectangular planes with text rendered as textures. Show the name of the nearest item (e.g., "Bragify Pit Stop").
- **LED screens:** Larger rectangular planes at DRS zones showing project names and a "slow down to explore" indicator.
- **Banners:** Overhead banner arches at sector boundaries labeled "Sector 1: Origins," "Sector 2: Pit Lane," "Sector 3: Straights."
- **LeetCode timing tower:** A vertical standings board placed trackside showing your LeetCode stats styled as a race timing tower.

### Key Technical Challenges

> ⚠️ **Watch out for these:**
>
> 1. **Spline interpolation:** The car must follow the track center line but be free to move laterally. Use the spline as a reference frame (tangent/normal/binormal) and let the car offset from it.
> 2. **Performance:** R3F scenes with many objects need instancing or LOD. Start simple, optimize later.
> 3. **Camera jitter:** Lerp the camera position smoothly. Use a fixed delta time, not frame-dependent.
> 4. **Asset loading:** GLTF models load asynchronously. Use React Suspense with a loading screen.
> 5. **Track collision:** Start with a simple approach — clamp the car's lateral offset to a max distance from the center line.

### Phase 3 Checklist

- [ ] Design track spline in trackLayout.ts (array of 3D control points)
- [ ] Build TrackMesh component: road surface, kerbs, grass, gravel from spline
- [ ] Download and integrate GLTF car model
- [ ] Implement team livery color swap based on selected car
- [ ] Build useCarControls hook (keyboard input to car physics)
- [ ] Implement car movement along and across the track
- [ ] Build follow camera with smooth lerp
- [ ] Implement sector detection based on spline progress
- [ ] Place static trackside elements at POI positions
- [ ] Build sector boundary banners
- [ ] Build circuit minimap SVG overlay
- [ ] Implement basic Tone.js engine sound tied to car speed
- [ ] Add loading screen with Suspense for model loading
- [ ] Test performance on your laptop (aim for 60fps)
- [ ] Commit frequently to `feature/phase-3-circuit`
- [ ] Update CHECKLIST.md and write DEVLOG entry
- [ ] Create PR, review, and merge to main

---

## Phase 4: Telemetry HUD

> **Duration:** 3–4 days | **Recommended model:** Claude Sonnet 4.6

### Goal

Build the heads-up display that frames the racing viewport. Two modes: a minimized always-on HUD that shows context-aware info about the nearest track element, and an expanded full-screen telemetry dashboard (toggled with T key) showing your complete profile in F1 data viz style.

### Why Sonnet 4.6

HUD is React/Tailwind UI work with Zustand subscriptions. Data formatting and conditional rendering. Sonnet is fast and precise for this.

### Minimized HUD (Always Visible)

Four panels positioned at the corners of the viewport. They UPDATE dynamically based on the car's position:

#### Top-Left: Sector & Position

- Current sector name and number (e.g., "Sector 2 — Pit Lane").
- Current item name (e.g., "Bragify SDE Intern") when near a POI.
- Sector progress bar (done / active / upcoming).

#### Top-Right: Contextual Telemetry

This panel changes based on what is nearest:

- **Near a project:** shows project name, key metric (e.g., ROUGE-1: 41.97), and tech tags.
- **Near an experience:** shows role, company, and duration.
- **Near education:** shows degree, school, GPA.
- **When nothing is near:** shows general skills summary (tire compound = primary language, engine mode = top skill).

#### Bottom-Left: Circuit Minimap

- Track outline with car dot.
- POI markers color-coded by type (education, experience, project).
- Sector boundaries marked.

#### Bottom-Right: Race Engineer Button

- Chat icon + "Race engineer" label.
- Click opens the chatbot panel (Phase 6).

### Expanded Telemetry (T Key Toggle)

Full-screen overlay styled as an F1 strategy screen. Contains four quadrants (reference the `f1_screen_full_telemetry_dashboard` mockup):

- **Project lap times:** All projects with their key metrics displayed as lap time splits. Color coded by domain (ML = green, full-stack = amber, data = blue).
- **Tire compound allocation:** Languages mapped to tire types. Python = soft (red), JavaScript = medium (yellow), Java = hard (white), SQL = intermediate (green), Frameworks = wet (blue).
- **Engine modes (skill depth):** Bar chart of skills with proficiency levels. Deep learning, NLP, computer vision, RAG, full-stack, MLOps, cloud.
- **Pit stop history:** Work experience timeline with role, company, and dates.

### Phase 4 Checklist

- [ ] Build useNearbyPOI hook (calculates nearest POI from car position)
- [ ] Build HUDLayout component (four-corner positioning)
- [ ] Build SectorPanel (top-left)
- [ ] Build ContextTelemetry (top-right, switches content by POI type)
- [ ] Build CircuitMinimap (bottom-left, SVG with car dot)
- [ ] Build RaceEngineerButton (bottom-right, placeholder for Phase 6)
- [ ] Build ExpandedTelemetry overlay (T key toggle)
- [ ] Wire all HUD panels to Zustand store
- [ ] Add Framer Motion transitions for telemetry expand/collapse
- [ ] Ensure HUD is non-blocking (pointer-events: none on inactive areas)
- [ ] Commit to `feature/phase-4-hud`
- [ ] Update CHECKLIST.md and write DEVLOG entry
- [ ] Create PR, review, and merge to main

---

## Phase 5: DRS Zones — Project Deep-Dives

> **Duration:** 4–6 days | **Recommended model:** Claude Opus 4.6

### Goal

When the car enters a DRS zone (marked by purple track stripes), a project card expands. Clicking "Explore" opens a full interactive case study within the app. The car pauses while any overlay is open.

### Why Opus 4.6

Interactive case studies require structured technical writing, diagram generation, and complex overlay state management. Opus produces higher-quality case study content and handles the interaction design nuances.

### DRS Zone Mechanics

- DRS zones are visually distinct track sections with purple striping.
- When the car enters a DRS zone, a compact project card auto-appears (slides in from the side).
- The compact card shows: project name, one-line summary, key metric, tech tags, and two buttons: "Explore Case Study" and "Close."
- Clicking "Close" dismisses the card and resumes driving.
- Clicking "Explore Case Study" opens a full-screen overlay.

### Car Pause Behavior

> 🔑 **Pause rule:** The car stops moving whenever ANY overlay is open: project card, case study, expanded telemetry, or race engineer chatbot. This is managed by a single Zustand flag: `gameStore.isPaused`. All keyboard input for car movement is suppressed when isPaused is true. The car resumes when all overlays close.

### Interactive Case Study Pages

Each project gets a dedicated case study page accessible from its DRS zone. These are built as React components, not separate routes. They overlay the track scene. Contents:

- **Header:** Project name, date, tech stack tags, GitHub link.
- **Problem statement:** What problem does this project solve? Written in clear, accessible language.
- **Architecture diagram:** SVG or React component showing the system design. For PEGASUS: ingestion pipeline → model → Flask API. For AI Stock Picker: data collection → model training → backtesting → blockchain timestamp.
- **Key decisions:** 2–3 technical decisions you made and why.
- **Results:** Metrics, charts, and outcomes. ROUGE scores, accuracy numbers, backtest performance.
- **Screenshots/GIFs:** Actual app screenshots or terminal output. Store in `/public/images/projects/`.
- **What I learned:** Brief reflection showing growth mindset.

### Projects to Cover

1. PEGASUS Abstractive Summarizer (ROUGE-1: 41.97, Flask API)
2. Colorado Crash Analysis (1.63M records, 99.95% ID3 accuracy)
3. FloraSense Crop Disease Detection (92%+ accuracy, ResNet50 + InceptionV3)
4. AI Stock Picker (6 models, Random Forest winner, blockchain timestamp)
5. Maieutic / Socratic Tutor (RAG + Claude API, Socratic constraint)
6. Stroke Rehab Pipeline (OpenSim, Moco, markerless motion capture)
7. Bragify SDE Work (Slack commands, Node.js, OpenAI summarization)

### Phase 5 Checklist

- [ ] Define DRS zone positions in trackLayout.ts
- [ ] Build DRSZone visual component (purple track stripe)
- [ ] Build CompactProjectCard component (auto-appears on enter)
- [ ] Implement car pause/resume via gameStore.isPaused
- [ ] Build CaseStudyOverlay full-screen component
- [ ] Write case study content for PEGASUS project
- [ ] Write case study content for Colorado Crash Analysis
- [ ] Write case study content for FloraSense
- [ ] Write case study content for AI Stock Picker
- [ ] Write case study content for Maieutic
- [ ] Write case study content for Stroke Rehab Pipeline
- [ ] Write case study content for Bragify SDE work
- [ ] Create/collect architecture diagrams for each project
- [ ] Add project screenshots to /public/images/projects/
- [ ] Add smooth Framer Motion transitions for card appearance/dismissal
- [ ] Test DRS zone detection accuracy
- [ ] Commit to `feature/phase-5-drs`
- [ ] Update CHECKLIST.md and write DEVLOG entry
- [ ] Create PR, review, and merge to main

---

## Phase 6: Race Engineer — AI Chatbot

> **Duration:** 3–4 days | **Recommended model:** Claude Opus 4.6

### Goal

Build the race engineer chatbot: a side panel that opens when the user clicks the engineer button. The AI answers questions about your career in the voice of an F1 race engineer, with ElevenLabs delivering spoken responses. Car pauses while chat is active.

### Why Opus 4.6

The system prompt design is critical. Mapping your entire resume to F1 terminology, handling edge cases (what if someone asks about something not on your resume?), and writing a prompt that is both fun and technically accurate requires Opus's reasoning depth.

### System Prompt Design

The Claude system prompt must accomplish:

- You are the race engineer for Sai Emani. You speak in F1 race engineer radio style: concise, technical, using F1 jargon.
- Map all skills and experience to F1 terms (see [F1 Terminology Master Map](#f1-terminology-master-map)).
- You have complete knowledge of Sai's resume, projects, education, and extracurriculars. Never fabricate information.
- When asked something not on the resume, say: "That's not in our data this weekend. Check the team principal's email for that." (i.e., redirect to email contact).
- Keep responses under 150 words. This is radio comms, not a presentation.
- When asked "what tires is he on?" → respond with programming language breakdown. When asked about "race pace" → respond about project output cadence. Etc.

### ElevenLabs Voice Integration

- API route at `/api/tts` proxies text to ElevenLabs and returns audio buffer.
- Use a professional, calm male voice (search ElevenLabs voice library for "British radio" or "professional narrator").
- Audio plays via Howler.js after each engineer response.
- Fallback: if ElevenLabs rate limit hit or API error, use browser Web Speech API with a British English voice.
- User can mute voice independently from other sounds.

### Chat UI

Reference the `f1_screen_race_engineer_chat` mockup. The panel slides in from the right, dimming the track slightly. Key elements:

- Header with "Race Engineer" label, AI badge, green "on radio" status.
- Message bubbles: engineer messages (dark, left) and user messages (purple, right).
- Suggested prompts at the bottom: "What projects has he built?", "Tell me his tire strategy", "Leadership experience?", "Tech stack depth?"
- Text input with send button. Enter to send.
- Audio playing indicator (waveform or pulsing dot) when engineer voice is speaking.

### Phase 6 Checklist

- [ ] Build /api/chat route (proxies to Claude API with system prompt)
- [ ] Write comprehensive race engineer system prompt
- [ ] Build /api/tts route (proxies to ElevenLabs)
- [ ] Build RaceEngineerPanel component (slide-in side panel)
- [ ] Build ChatMessage component (engineer and user variants)
- [ ] Build SuggestedPrompts component
- [ ] Implement chat history in Zustand
- [ ] Wire car pause when chat panel is open
- [ ] Integrate ElevenLabs audio playback via Howler
- [ ] Add browser Web Speech API fallback
- [ ] Add voice mute toggle
- [ ] Add typing indicator while waiting for Claude response
- [ ] Test with 10+ sample questions
- [ ] Commit to `feature/phase-6-engineer`
- [ ] Update CHECKLIST.md and write DEVLOG entry
- [ ] Create PR, review, and merge to main

---

## Phase 7: Chequered Flag — Contact & Podium

> **Duration:** 1–2 days | **Recommended model:** Claude Sonnet 4.6

### Goal

When the car crosses the finish line, the track fades and the podium ceremony begins. Your three contact channels (Email, GitHub, LinkedIn) appear as P1/P2/P3 positions. Resume download button, race stats summary, and a "Race Again" option.

### Reference Mockup

See the `f1_screen_podium_contact` mockup. Chequered flag pattern at top, podium blocks at different heights, contact links, stat cards, and download button.

### Additional Elements

- **Race summary stats:** Total "distance" (items explored), sectors completed, projects viewed, time spent. Fun F1-style stats.
- **Resume download:** PDF resume stored in /public. Direct download link styled as a pit lane button.
- **Race again:** Button that resets gameStore and returns to the garage, letting the visitor pick a different car.
- **Built with:** Footer showing "Built with React, Three.js, and Claude API by Sai Emani." This is subtle self-promotion of your technical stack.

### Phase 7 Checklist

- [ ] Detect finish line crossing (spline progress >= 1.0)
- [ ] Build PodiumScene component with chequered flag animation
- [ ] Build ContactPodium (P1 email, P2 GitHub, P3 LinkedIn)
- [ ] Build RaceSummaryStats (items explored, time, projects viewed)
- [ ] Add resume PDF to /public and wire download button
- [ ] Build RaceAgain button with state reset logic
- [ ] Add Framer Motion entrance animations for podium elements
- [ ] Commit to `feature/phase-7-podium`
- [ ] Update CHECKLIST.md and write DEVLOG entry
- [ ] Create PR, review, and merge to main

---

## Phase 8: Audio & Visual Polish

> **Duration:** 3–4 days | **Recommended model:** Claude Sonnet 4.6 + manual tuning

### Goal

Source, integrate, and fine-tune all audio. Add visual polish: post-processing effects, particle systems (tire smoke, sparks), lighting refinements, and animation smoothing. This phase makes the site feel professional rather than prototype-quality.

### Audio System

#### Engine Sound (Tone.js)

- Base frequency ~80Hz when idle, rising to ~400Hz at max speed.
- Mapped from car speed via a logarithmic curve (sounds more natural than linear).
- On braking: frequency drops quickly. On lateral movement: slight pitch warble.
- Gearshift effect: brief frequency spike at defined speed thresholds.

#### Ambient & UI Sounds (Howler.js)

- Track ambiance: subtle crowd murmur, wind. Loops continuously during race.
- UI sounds: click for button presses, whoosh for panel transitions, chime for DRS zone entry.
- Lights-out sequence sounds (already in Phase 2, refine here).
- Podium: champagne pop, crowd cheer.

#### Sound Control

- Global mute (M key): mutes all audio.
- Voice mute (V key): mutes only engineer TTS.
- Volume persists in localStorage.

### Visual Polish

- Post-processing: subtle bloom on light sources, vignette on the viewport edges. Use @react-three/postprocessing.
- Tire smoke particles when braking hard (simple particle system).
- Trackside environment: low-poly grandstands, trees, sky dome. Keep it minimal but not empty.
- Smooth animations on all UI transitions (250ms ease-out minimum).
- Loading screen with progress bar for initial asset load.

### Phase 8 Checklist

- [ ] Implement Tone.js engine sound with speed mapping
- [ ] Add gear shift sound effects at speed thresholds
- [ ] Source and add ambient audio loops (Freesound.org CC0)
- [ ] Source and add UI sound effects
- [ ] Build AudioManager component for centralized control
- [ ] Add M key mute and V key voice mute
- [ ] Add post-processing (bloom, vignette)
- [ ] Add particle effects for tire smoke/sparks
- [ ] Add basic trackside environment (grandstands, trees, sky)
- [ ] Refine loading screen with asset progress
- [ ] Polish all UI transition animations
- [ ] Performance audit: ensure 60fps on target hardware
- [ ] Commit to `feature/phase-8-polish`
- [ ] Update CHECKLIST.md and write DEVLOG entry
- [ ] Create PR, review, and merge to main

---

## Phase 9: Deploy, Performance & SEO

> **Duration:** 2–3 days | **Recommended model:** Claude Sonnet 4.6

### Goal

Final deployment, performance optimization, SEO, analytics, and Open Graph tags so the site looks great when shared on LinkedIn. Custom domain if desired.

### Performance Optimization

- Lazy-load 3D scene components with dynamic imports.
- Use draco compression on GLTF models (reduce by ~70%).
- Texture compression: use basis/KTX2 format for textures.
- Code split: each phase's components in separate chunks.
- Image optimization: next/image for all 2D images.
- Bundle analysis: `npx next build && npx @next/bundle-analyzer`.
- Target: Lighthouse score > 80 on mobile, > 90 on desktop.

### SEO & Social

- Open Graph meta tags: title, description, and og:image (design a custom OG image of the garage screen).
- Twitter card meta tags.
- Structured data (JSON-LD) for Person schema with your name, job title, and social links.
- Sitemap.xml and robots.txt.
- Page title: "Sai Srikar Emani — Portfolio Grand Prix."

### Analytics

- Vercel Analytics (free with Vercel). Basic pageviews and web vitals.
- Optional: simple event tracking for "car selected," "project viewed," "engineer chat opened" to understand what recruiters engage with.

### Accessibility

- Skip to content link (bypasses the 3D scene for screen readers).
- Alt text on all images in case studies.
- Fallback static version: a simple HTML page with your resume content for users whose devices can't run WebGL. Detect via Modernizr or a WebGL context test.

### Phase 9 Checklist

- [ ] Enable draco compression on GLTF loader
- [ ] Add dynamic imports for heavy components
- [ ] Set up next/image for all 2D images
- [ ] Run bundle analysis and optimize large chunks
- [ ] Add Open Graph and Twitter Card meta tags
- [ ] Design and add OG image
- [ ] Add JSON-LD structured data
- [ ] Add sitemap.xml and robots.txt
- [ ] Set up Vercel Analytics
- [ ] Add event tracking for key interactions
- [ ] Build static fallback page for non-WebGL devices
- [ ] Add skip-to-content accessibility link
- [ ] Run Lighthouse audit, fix any issues below 80
- [ ] Final review of README.md with screenshots/GIF
- [ ] Commit to `feature/phase-9-deploy`
- [ ] Merge to main, verify live Vercel deployment
- [ ] Share on LinkedIn

---

## F1 Terminology Master Map

This mapping drives the telemetry HUD, the race engineer chatbot's system prompt, and all trackside visuals. Store this in `/src/data/f1Mappings.ts`.

| F1 Term | Portfolio Mapping | Where It Appears |
|---------|------------------|-----------------|
| Tire compound (Soft) | Python | Telemetry, chatbot |
| Tire compound (Medium) | JavaScript / Node.js | Telemetry, chatbot |
| Tire compound (Hard) | Java | Telemetry, chatbot |
| Tire compound (Inter) | SQL | Telemetry, chatbot |
| Tire compound (Wet) | Frameworks (PyTorch, etc.) | Telemetry, chatbot |
| Engine mode | Primary skill domain (ML/AI) | Telemetry top-right |
| ERS deploy | Secondary skill (full-stack) | Telemetry top-right |
| DRS zone | Project deep-dive area | Track + project cards |
| Pit stop | Work experience | Track + experience cards |
| Sector 1: Origins | Education | Track banners, HUD |
| Sector 2: Pit Lane | Work experience | Track banners, HUD |
| Sector 3: Straights | Projects | Track banners, HUD |
| Lap time / splits | Project metrics | Telemetry expanded |
| Race engineer | AI chatbot (Claude) | Chat panel |
| Chequered flag | Finish / contact section | Podium |
| Podium P1/P2/P3 | Email / GitHub / LinkedIn | Contact page |
| Timing tower | LeetCode stats | Trackside element |
| Grid position | Career starting point | Sector 1 narrative |
| Fastest lap | Best project metric | Telemetry highlight |
| Safety car | Career pause / pivot | Chatbot lore |
| Team radio | Chatbot conversation | Chat panel header |
| Garage | Landing / car selection | Screen 1 |
| Race pace | Project output cadence | Chatbot response |
| Undercut / overcut | Strategic career moves | Chatbot response |
| Circuit name | Emani International Circuit | Minimap, track signage |
| Race weekend | Portfolio Grand Prix (PGP) | Garage screen, browser tab |

---

## Content Inventory

Everything from your resume, GitHub, and our past project work that needs to be represented on the track. This is the master list for populating `/src/data/portfolio.ts`.

### Education

- **MS Computer Science, CU Denver:** GPA 3.77, Aug 2023 – May 2025. Coursework: NLP & Gen AI, Social Networks, Computer Vision, Deep Learning, Computational Motor Control, Algorithm Design, Big Data Science.
- **BTech Computer Science, KL University:** GPA 9.6, Aug 2019 – May 2023. Data Science Club co-founder & president, College Radio lead RJ.

### Experience

- **ML Research Assistant, CU Anschutz:** Sep 2024 – Present. Stroke-rehab analytics pipeline. OpenSim, Moco, markerless motion capture.
- **SDE Intern, Bragify:** Feb 2025 – May 2025. Slack commands, Node.js/Express, PostgreSQL, OpenAI summarization.
- **Project Intern, Samsung R&D:** Jun 2021 – Feb 2022. Image/video inpainting pipeline, PyTorch, U-Net, optical flow.
- **ISA President, CU Denver:** Leadership, event organization, community building.

### Projects

- **PEGASUS Summarizer:** ROUGE-1 41.97, ROUGE-L 38.21, BLEU 42.23. Flask API + UI. Fine-tuned on arXiv, CNN/DailyMail, XSum.
- **Colorado Crash Analysis:** 1.63M+ records, 80+ features. ID3 ~99.95%, Random Forest ~97.5%.
- **FloraSense:** ~90k images, 38 classes, >92% accuracy. ResNet50 + InceptionV3 hybrid.
- **AI Stock Picker:** 6 regression models. Random Forest winner. Blockchain-timestamped picks.
- **Maieutic (Socratic Tutor):** RAG over course materials, Claude API, Socratic constraint, weak spot tracking.
- **Stroke Rehab Pipeline:** OpenSim inverse kinematics, Moco optimization, batch reports for clinicians.

### Skills (for Telemetry Engine Modes)

Deep Learning, NLP/Transformers, Computer Vision, RAG/Embeddings, Full-Stack Dev, MLOps/Docker, Cloud (AWS/GCP)

### External Data

- **GitHub:** github.com/semani01 — 28 repos, pinned projects.
- **LeetCode:** Pull stats via alfa-leetcode-api (your username needed).
- **LinkedIn:** linkedin.com/in/saisrikaremani/ — linked from podium.

---

*End of document. This roadmap is designed to be handed to Claude Code phase by phase. Start with Phase 0, read the relevant section, and begin building.*
