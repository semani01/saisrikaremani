# Portfolio Grand Prix — Architecture

> **Living document.** Updated whenever a significant structural decision is made. This is the single source of truth for how the system is wired together.

---

## Table of Contents

1. [System Overview](#1-system-overview)
2. [Tech Stack](#2-tech-stack)
3. [Folder Structure](#3-folder-structure)
4. [State Architecture (Zustand)](#4-state-architecture-zustand)
5. [Component Tree](#5-component-tree)
6. [Data Flow](#6-data-flow)
7. [API Routes](#7-api-routes)
8. [3D Scene Architecture](#8-3d-scene-architecture)
9. [Audio Architecture](#9-audio-architecture)
10. [Data Layer](#10-data-layer)
11. [Environment Variables](#11-environment-variables)

---

## 1. System Overview

Portfolio Grand Prix is a single-page Next.js application built around a React Three Fiber (R3F) 3D experience. The visitor progresses through a linear game loop:

```
Garage (car select) → Lights Out (launch sequence) → Circuit (3D track drive) → Podium (contact)
```

The 3D circuit is the core of the experience. The visitor drives along a procedurally generated Catmull-Rom spline track. Points of Interest (POIs) are positioned at specific normalized positions (0–1) along the spline. As the car approaches each POI, the HUD updates contextually. DRS zones trigger project cards. The finish line triggers the podium.

A Claude-powered AI chatbot acts as the "race engineer," answering questions about Sai's career in F1 radio voice with ElevenLabs TTS audio.

---

## 2. Tech Stack

| Layer | Technology | Notes |
|-------|-----------|-------|
| Framework | Next.js (App Router) | SSR/ISR for SEO + API routes for Claude/ElevenLabs proxy |
| 3D Engine | React Three Fiber + drei | R3F canvas, camera, controls, GLTF loader |
| Styling | Tailwind CSS | HUD, overlays, garage UI. Dark-mode-first |
| State | Zustand | Game state, audio state. R3F-compatible |
| Animation | Framer Motion | UI transitions, overlays, garage animations |
| Audio | Howler.js + Tone.js | Howler: samples/UI. Tone.js: procedural engine sound |
| AI Chat | Claude API (Sonnet 4.6) | via `/api/chat` proxy route |
| Voice TTS | ElevenLabs + Web Speech API | via `/api/tts` proxy route, browser fallback |
| Data: GitHub | GitHub REST API | Fetched at build time via ISR (revalidate 3600s) |
| Data: LeetCode | alfa-leetcode-api | Fetched at build time via ISR |
| Post-processing | @react-three/postprocessing | Bloom, vignette |
| Hosting | Vercel (free tier) | Auto-deploy from main branch |

---

## 3. Folder Structure

```
/saisrikaremani
  /public
    /models               ← GLTF car model(s) (CC-licensed from Sketchfab)
    /audio                ← Sound samples: engine, lights, ambient, UI
    /images
      /projects           ← Screenshots/GIFs for case studies
      og-image.png        ← Open Graph preview image
    resume.pdf            ← Downloadable resume (Phase 7)

  /src
    /app
      /api
        /chat             ← Claude API proxy (POST → Anthropic SDK)
        /tts              ← ElevenLabs TTS proxy (POST → ElevenLabs API)
      layout.tsx          ← Root layout: fonts, meta, OG tags
      page.tsx            ← Entry point: renders <GameRoot />

    /components
      /garage             ← Phase 1: GaragePage, CarCard, CarStatsOverlay, LightsRow, KeyboardHints
      /lights             ← Phase 2: LightsOutSequence
      /track              ← Phase 3: TrackMesh, CarModel, TrackEnvironment, SectorBanners, TracksideElements
      /hud                ← Phase 4: HUDLayout, SectorPanel, ContextTelemetry, CircuitMinimap, ExpandedTelemetry, RaceEngineerButton
      /projects           ← Phase 5: DRSZone, CompactProjectCard, CaseStudyOverlay, individual case studies
      /engineer           ← Phase 6: RaceEngineerPanel, ChatMessage, SuggestedPrompts
      /podium             ← Phase 7: PodiumScene, ContactPodium, RaceSummaryStats
      /audio              ← Phase 8: AudioManager
      /ui                 ← Shared: LoadingScreen, Button, Badge, etc.

    /store
      gameStore.ts        ← Zustand: game phase, car selection, POIs, pause state
      audioStore.ts       ← Zustand: sound toggles, volumes

    /data
      portfolio.ts        ← All resume content: education, experience, projects, skills
      f1Mappings.ts       ← F1 terminology ↔ portfolio concept map
      trackLayout.ts      ← Circuit spline control points + POI positions + DRS zone ranges

    /hooks
      useCarControls.ts   ← Keyboard input → car physics (speed, steering)
      useNearbyPOI.ts     ← Car position → nearest POI lookup
      useSectorDetection.ts ← Spline progress → sector number

    /lib
      claude.ts           ← Anthropic SDK client + system prompt builder
      elevenlabs.ts       ← ElevenLabs API client
      github.ts           ← GitHub REST API fetcher (build-time ISR)
      leetcode.ts         ← LeetCode API fetcher (build-time ISR)

    /types
      index.ts            ← All TypeScript interfaces (GamePhase, CarTeam, POI, CaseStudy, etc.)

  /docs
    ROADMAP.md            ← Master build plan (do not edit during build)
    CHECKLIST.md          ← Phase-by-phase task tracking
    DEVLOG.md             ← Engineering journal
    ARCHITECTURE.md       ← This file

  .env.local              ← Secret keys (gitignored)
  .env.example            ← Template with key names, no values
  .gitignore
  README.md
  next.config.js
  tailwind.config.ts
  tsconfig.json
```

---

## 4. State Architecture (Zustand)

### `gameStore.ts`

```typescript
interface GameStore {
  // Game flow
  gamePhase: 'garage' | 'lights-out' | 'circuit' | 'podium';
  setGamePhase: (phase: GamePhase) => void;

  // Car selection
  selectedCar: null | 'mercedes' | 'ferrari' | 'mclaren' | 'redbull';
  setSelectedCar: (car: CarTeam) => void;

  // Circuit state
  carPosition: THREE.Vector3;          // world position of car
  splineProgress: number;              // 0–1 normalized position along track
  currentSector: 1 | 2 | 3;
  nearbyPOI: POI | null;               // POI within interaction radius

  // Overlay / pause state
  isPaused: boolean;                   // true when ANY overlay is open
  activeOverlay: null | 'project' | 'telemetry' | 'engineer';

  // Race stats (for podium)
  raceStats: {
    poisExplored: number;
    projectsViewed: number;
    sectorsCompleted: number;
    timeOnTrack: number;               // seconds
  };

  // Actions
  setCarPosition: (pos: THREE.Vector3) => void;
  setSplineProgress: (t: number) => void;
  setNearbyPOI: (poi: POI | null) => void;
  openOverlay: (type: OverlayType) => void;
  closeOverlay: () => void;
  resetRace: () => void;
}
```

### `audioStore.ts`

```typescript
interface AudioStore {
  isMuted: boolean;              // M key: mutes all audio
  isVoiceMuted: boolean;         // V key: mutes TTS only
  masterVolume: number;          // 0–1
  musicVolume: number;           // 0–1
  sfxVolume: number;             // 0–1

  toggleMute: () => void;
  toggleVoiceMute: () => void;
  setVolume: (channel: 'master' | 'music' | 'sfx', value: number) => void;
}
```

---

## 5. Component Tree

```
<RootLayout>
  └── <GameRoot>
        ├── [gamePhase === 'garage']    → <GaragePage />
        ├── [gamePhase === 'lights-out'] → <LightsOutSequence />
        ├── [gamePhase === 'circuit']   → <CircuitScene />
        │     ├── <R3F Canvas>
        │     │     ├── <TrackMesh />
        │     │     ├── <CarModel />
        │     │     ├── <TracksideElements />  (pit boards, LED screens, banners)
        │     │     ├── <DRSZones />
        │     │     ├── <TrackEnvironment />   (sky, grandstands, trees)
        │     │     └── <FollowCamera />
        │     ├── <HUDLayout>               (positioned via CSS over canvas)
        │     │     ├── <SectorPanel />          (top-left)
        │     │     ├── <ContextTelemetry />     (top-right)
        │     │     ├── <CircuitMinimap />       (bottom-left)
        │     │     └── <RaceEngineerButton />   (bottom-right)
        │     ├── <ExpandedTelemetry />    (T key overlay, full-screen)
        │     ├── <CompactProjectCard />   (DRS zone trigger, slides in)
        │     ├── <CaseStudyOverlay />     (full-screen case study)
        │     ├── <RaceEngineerPanel />    (slide-in from right)
        │     └── <AudioManager />        (no visual, manages Howler/Tone instances)
        └── [gamePhase === 'podium']   → <PodiumScene />
```

---

## 6. Data Flow

### Car Position → HUD Updates

```
useFrame() loop (R3F)
  → useCarControls() updates car position in world space
  → useSectorDetection() converts position to spline progress (0–1) → sector number
  → useNearbyPOI() finds closest POI within radius
  → gameStore.setCarPosition(), setSplineProgress(), setNearbyPOI() called each frame
  → HUD components (SectorPanel, ContextTelemetry, CircuitMinimap) react to store changes
```

### DRS Zone → Project Card → Case Study

```
useFrame() loop
  → splineProgress checked against DRS zone ranges in trackLayout.ts
  → On zone entry: gameStore.openOverlay('project'), gameStore.isPaused = true
  → <CompactProjectCard /> renders with project data from portfolio.ts
  → User clicks "Explore": <CaseStudyOverlay /> renders case study content
  → User clicks "Close": gameStore.closeOverlay(), isPaused = false
```

### Race Engineer Chatbot

```
User clicks RaceEngineerButton
  → gameStore.openOverlay('engineer'), isPaused = true
  → <RaceEngineerPanel /> renders
  → User types message → POST /api/chat with history + system prompt
  → /api/chat proxies to Claude API (Anthropic SDK), streams response
  → Response text → POST /api/tts (ElevenLabs)
  → Audio buffer returned → Howler.js plays audio
  → Message added to chat history in audioStore (or gameStore)
```

### Build-Time Data (ISR)

```
next build
  → /lib/github.ts fetches GitHub API (repos, language breakdown, commit count)
  → /lib/leetcode.ts fetches alfa-leetcode-api (solved count, difficulty, streak)
  → Data injected into portfolio.ts or page props
  → Revalidates every 3600 seconds (ISR)
```

---

## 7. API Routes

### `POST /api/chat`

Proxies messages to Claude API. Keeps API key server-side.

**Request body:**
```json
{
  "messages": [{ "role": "user", "content": "What projects has he built?" }],
  "context": { "currentSector": 2, "nearbyPOI": "bragify" }
}
```

**Response:** Streamed text/event-stream (Claude streaming response).

**System prompt:** Built in `/lib/claude.ts`. Contains full resume data + F1 voice instructions + context from current game state.

---

### `POST /api/tts`

Proxies text to ElevenLabs TTS API. Returns audio buffer.

**Request body:**
```json
{ "text": "Copy that, driver. He's running Python softs this weekend..." }
```

**Response:** `audio/mpeg` buffer.

**Fallback:** If ElevenLabs returns an error, client uses `window.speechSynthesis` with `lang: 'en-GB'`.

---

## 8. 3D Scene Architecture

### Track Generation

The track centerline is a Catmull-Rom spline defined in `trackLayout.ts` as an array of `THREE.Vector3` control points. The `TrackMesh` component:

1. Samples the spline at N points (e.g., 500).
2. At each sample, computes the tangent (forward), normal (right), and binormal (up) vectors using the Frenet-Serret frame.
3. Extrudes a track cross-section (road + kerb + grass) along this frame to build the mesh geometry.
4. Uses `BufferGeometry` for performance.

### Car Movement

The car is NOT constrained to the spline. It moves freely in 3D space:

- `useCarControls` applies physics: acceleration from input, friction/deceleration when no input, steering rotates the car.
- Collision/boundary: the car's lateral distance from the nearest spline point is clamped to a max (track half-width + margin).
- Spline progress `t` is computed each frame by finding the nearest point on the spline to the car's world position (binary search or incremental).

### Camera

A smooth third-person follow camera built in `useFrame`:

```
cameraTarget = car.position + car.forward * (-8) + UP * (3)
camera.position.lerp(cameraTarget, 0.05)  // smooth follow
camera.lookAt(car.position + car.forward * 5)  // look slightly ahead
```

### Performance Strategy

- Trackside elements (pit boards, LED screens): use `InstancedMesh` if there are many identical items.
- GLTF car model: loaded once, reused. Draco compression applied (Phase 9).
- Post-processing (bloom/vignette): applied via `EffectComposer` from `@react-three/postprocessing`.
- Suspense + LoadingScreen wraps the R3F Canvas to handle async GLTF loading.

---

## 9. Audio Architecture

Two libraries, one manager component:

**Howler.js** — for discrete samples:
- `lights-click.mp3` — played per light in lights-out sequence
- `engine-roar.mp3` — played on lights out
- `drs-enter.mp3` — played on DRS zone entry
- `panel-open.mp3`, `panel-close.mp3` — UI transitions
- `champagne.mp3`, `crowd-cheer.mp3` — podium
- `ambient-track.mp3` — looping crowd/wind ambiance during circuit phase

**Tone.js** — for procedural engine sound:
- A `Tone.Oscillator` runs continuously during circuit phase.
- Frequency mapped from car speed: `freq = 80 + (speed / maxSpeed) * 320` (logarithmic curve)
- On gear shift (speed crosses threshold): brief frequency spike + click sound.

**`AudioManager` component** listens to `audioStore` and manages all Howler/Tone instances. Controls: M key (global mute), V key (voice mute only). Settings persisted to localStorage.

---

## 10. Data Layer

### `portfolio.ts` — Content Master File

Single source of truth for all resume content. Structure:

```typescript
export const portfolio = {
  education: EducationItem[],
  experience: ExperienceItem[],
  projects: ProjectItem[],       // includes case study content
  skills: SkillItem[],
  github: GitHubStats,           // populated at build time
  leetcode: LeetCodeStats,       // populated at build time
};
```

### `trackLayout.ts` — Circuit Geometry

```typescript
export const trackSpline: THREE.Vector3[] = [...];  // control points

export const pois: POI[] = [
  { id: 'cu-denver-ms', type: 'education', t: 0.08, side: 'left', contentId: 'cu-denver-ms' },
  { id: 'bragify', type: 'experience', t: 0.35, side: 'right', contentId: 'bragify' },
  // ...
];

export const drsZones: DRSZone[] = [
  { id: 'pegasus', tStart: 0.55, tEnd: 0.65, projectId: 'pegasus' },
  // ...
];

export const sectorBoundaries = { sector2Start: 0.33, sector3Start: 0.66 };
```

### `f1Mappings.ts` — F1 Terminology Map

Used by the chatbot system prompt and telemetry HUD labels.

```typescript
export const f1Mappings = {
  tireCompounds: {
    soft: 'Python',
    medium: 'JavaScript / Node.js',
    hard: 'Java',
    intermediate: 'SQL',
    wet: 'Frameworks (PyTorch, React, etc.)',
  },
  sectors: {
    1: { name: 'Origins', content: 'Education' },
    2: { name: 'Pit Lane', content: 'Work Experience' },
    3: { name: 'Straights', content: 'Projects' },
  },
  // ... full map from ROADMAP.md Section 15
};
```

---

## 11. Environment Variables

**`.env.local`** (gitignored — never commit):

```
ANTHROPIC_API_KEY=sk-ant-...
ELEVENLABS_API_KEY=...
GITHUB_TOKEN=ghp_...          # optional, increases rate limit
LEETCODE_USERNAME=...
```

**`.env.example`** (committed — no values):

```
ANTHROPIC_API_KEY=
ELEVENLABS_API_KEY=
GITHUB_TOKEN=
LEETCODE_USERNAME=
```

All API keys are accessed only in `/api/*` server routes. They are never exposed to the client bundle.

---

*Last updated: Phase 0 — 2026-03-26*
