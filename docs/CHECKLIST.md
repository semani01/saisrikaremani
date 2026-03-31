# Portfolio Grand Prix — Master Checklist

> **Track your progress phase by phase. Check items off as you complete them. When a phase is 100% complete, create a PR and merge to main.**

---

## Phase 0: Project Scaffolding & Repo Setup
> Branch: `feature/phase-0-scaffold`

- [x] Run `npx create-next-app@latest` with TypeScript and Tailwind
- [x] Install R3F: `npm install @react-three/fiber @react-three/drei three`
- [x] Install Zustand: `npm install zustand`
- [x] Install Howler + Tone: `npm install howler tone`
- [x] Install Anthropic SDK: `npm install @anthropic-ai/sdk`
- [x] Install Framer Motion: `npm install framer-motion`
- [x] Create folder structure matching architecture plan
- [x] Scaffold `gameStore.ts` with initial state shape
- [x] Scaffold `audioStore.ts` with initial state shape
- [x] Create `portfolio.ts` with placeholder data structure for all resume content
- [x] Create `f1Mappings.ts` with F1 terminology map
- [x] Add a blank R3F Canvas to `page.tsx`, confirm it renders
- [x] Create `.env.example` (no actual keys) and `.env.local` (with real keys)
- [x] Create GitHub repo named `saisrikaremani`, push initial commit
- [x] Connect Vercel to GitHub (deploys as `saisrikaremani.vercel.app`)
- [x] Write first DEVLOG.md entry
- [x] Update README.md with project description and local dev instructions

**Status: 17 / 17** ✅

---

## Phase 1: The Garage — Car Selection Screen
> Branch: `feature/phase-1-garage`

- [x] Build `GaragePage` component with dark theme (`#0f0f13` background)
- [x] Build `CarCard` component with four team variants (Silver Arrow, Scuderia, Papaya, Blue Bull)
- [x] Implement hover state with stat card expansion (crossfade inside fixed-height card)
- [x] Wire car selection to Zustand `gameStore.selectedCar`
- [x] Add keyboard support (1/2/3/4 to highlight, Enter to confirm, arrow keys to navigate)
- [x] Add `LightsRow` (five dark circles at top of screen)
- [x] Add `KeyboardHints` bar at bottom
- [x] Add Framer Motion entrance animations
- [x] Add Music (M) and Sound (S) toggle buttons in footer
- [ ] Test responsive layout (cards stack on mobile)
- [x] Commit and push to `feature/phase-1-garage`
- [x] Update CHECKLIST.md and write DEVLOG entry
- [ ] Create PR, review, and merge to main

**Status: 11 / 13**

---

## Phase 2: Lights Out — Launch Sequence
> Branch: `feature/phase-2-lights`

- [ ] Build `LightsOutSequence` component with timed animation
- [ ] Source and add audio files to `/public/audio` (light click, engine roar, optional crowd)
- [ ] Integrate Howler.js for light click and engine roar sounds
- [ ] Add random delay (0.5–3s) between last light and lights-out
- [ ] Implement smooth transition from lights-out to track scene
- [ ] Respect sound toggle setting from Phase 1
- [ ] Handle edge case: user pressing back during sequence
- [ ] Commit and push to `feature/phase-2-lights`
- [ ] Update CHECKLIST.md and write DEVLOG entry
- [ ] Create PR, review, and merge to main

**Status: 0 / 10**

---

## Phase 3: The Circuit — 3D Track, Car & Controls
> Branch: `feature/phase-3-circuit`

- [ ] Design track spline in `trackLayout.ts` (array of 3D control points)
- [ ] Build `TrackMesh` component: road surface, kerbs, grass, gravel from spline
- [ ] Download and integrate GLTF car model (CC-licensed from Sketchfab)
- [ ] Implement team livery color swap based on selected car
- [ ] Build `useCarControls` hook (keyboard input to car physics)
- [ ] Implement car movement along and across the track
- [ ] Build follow camera with smooth lerp (`useFrame` + drei)
- [ ] Implement sector detection based on spline progress
- [ ] Place static trackside elements at POI positions (pit boards, LED screens, banners)
- [ ] Build sector boundary banners ("Sector 1: Origins", "Sector 2: Pit Lane", "Sector 3: Straights")
- [ ] Build LeetCode timing tower trackside element
- [ ] Build circuit minimap SVG overlay
- [ ] Implement basic Tone.js engine sound tied to car speed
- [ ] Add loading screen with Suspense for model loading
- [ ] Test performance on target hardware (aim for 60fps)
- [ ] Commit frequently to `feature/phase-3-circuit`
- [ ] Update CHECKLIST.md and write DEVLOG entry
- [ ] Create PR, review, and merge to main

**Status: 0 / 18**

---

## Phase 4: Telemetry HUD
> Branch: `feature/phase-4-hud`

- [ ] Build `useNearbyPOI` hook (calculates nearest POI from car position)
- [ ] Build `HUDLayout` component (four-corner positioning)
- [ ] Build `SectorPanel` (top-left: sector name, item name, progress bar)
- [ ] Build `ContextTelemetry` (top-right: switches content by POI type)
- [ ] Build `CircuitMinimap` (bottom-left: SVG with car dot and POI markers)
- [ ] Build `RaceEngineerButton` (bottom-right: placeholder for Phase 6)
- [ ] Build `ExpandedTelemetry` overlay (T key toggle, four-quadrant layout)
  - [ ] Project lap times quadrant
  - [ ] Tire compound allocation quadrant
  - [ ] Engine modes (skill depth) bar chart quadrant
  - [ ] Pit stop history (work experience) quadrant
- [ ] Wire all HUD panels to Zustand store
- [ ] Add Framer Motion transitions for telemetry expand/collapse
- [ ] Ensure HUD is non-blocking (`pointer-events: none` on inactive areas)
- [ ] Commit to `feature/phase-4-hud`
- [ ] Update CHECKLIST.md and write DEVLOG entry
- [ ] Create PR, review, and merge to main

**Status: 0 / 15**

---

## Phase 5: DRS Zones — Project Deep-Dives
> Branch: `feature/phase-5-drs`

- [ ] Define DRS zone positions in `trackLayout.ts`
- [ ] Build `DRSZone` visual component (purple track stripe)
- [ ] Build `CompactProjectCard` component (auto-appears on zone entry)
- [ ] Implement car pause/resume via `gameStore.isPaused`
- [ ] Build `CaseStudyOverlay` full-screen component
- [ ] Write case study content for PEGASUS Summarizer
- [ ] Write case study content for Colorado Crash Analysis
- [ ] Write case study content for FloraSense
- [ ] Write case study content for AI Stock Picker
- [ ] Write case study content for Maieutic (Socratic Tutor)
- [ ] Write case study content for Stroke Rehab Pipeline
- [ ] Write case study content for Bragify SDE work
- [ ] Create/collect architecture diagrams for each project
- [ ] Add project screenshots to `/public/images/projects/`
- [ ] Add smooth Framer Motion transitions for card appearance/dismissal
- [ ] Test DRS zone detection accuracy
- [ ] Commit to `feature/phase-5-drs`
- [ ] Update CHECKLIST.md and write DEVLOG entry
- [ ] Create PR, review, and merge to main

**Status: 0 / 19**

---

## Phase 6: Race Engineer — AI Chatbot
> Branch: `feature/phase-6-engineer`

- [ ] Build `/api/chat` route (proxies to Claude API with system prompt)
- [ ] Write comprehensive race engineer system prompt (F1-voice + full resume context)
- [ ] Build `/api/tts` route (proxies to ElevenLabs)
- [ ] Build `RaceEngineerPanel` component (slide-in from right)
- [ ] Build `ChatMessage` component (engineer and user variants)
- [ ] Build `SuggestedPrompts` component (4 starter questions)
- [ ] Implement chat history in Zustand
- [ ] Wire car pause when chat panel is open
- [ ] Integrate ElevenLabs audio playback via Howler
- [ ] Add browser Web Speech API fallback (British English voice)
- [ ] Add voice mute toggle (V key)
- [ ] Add typing indicator while waiting for Claude response
- [ ] Test with 10+ sample questions
- [ ] Commit to `feature/phase-6-engineer`
- [ ] Update CHECKLIST.md and write DEVLOG entry
- [ ] Create PR, review, and merge to main

**Status: 0 / 16**

---

## Phase 7: Chequered Flag — Contact & Podium
> Branch: `feature/phase-7-podium`

- [ ] Detect finish line crossing (spline progress >= 1.0)
- [ ] Build `PodiumScene` component with chequered flag animation
- [ ] Build `ContactPodium` (P1 = Email, P2 = GitHub, P3 = LinkedIn)
- [ ] Build `RaceSummaryStats` (items explored, time, projects viewed)
- [ ] Add resume PDF to `/public` and wire download button
- [ ] Build `RaceAgain` button with full state reset logic
- [ ] Add Framer Motion entrance animations for all podium elements
- [ ] Commit to `feature/phase-7-podium`
- [ ] Update CHECKLIST.md and write DEVLOG entry
- [ ] Create PR, review, and merge to main

**Status: 0 / 10**

---

## Phase 8: Audio & Visual Polish
> Branch: `feature/phase-8-polish`

- [ ] Implement Tone.js engine sound with logarithmic speed mapping (80Hz–400Hz)
- [ ] Add gear shift sound effects at speed thresholds
- [ ] Source and add ambient audio loops from Freesound.org (CC0)
- [ ] Source and add UI sound effects (click, whoosh, chime, champagne pop)
- [ ] Build `AudioManager` component for centralized audio control
- [ ] Add M key global mute and V key voice mute
- [ ] Persist volume settings in localStorage
- [ ] Add post-processing: bloom (light sources) + vignette (viewport edges)
- [ ] Add tire smoke particle effects on hard braking
- [ ] Add basic trackside environment (grandstands, trees, sky dome)
- [ ] Refine loading screen with asset progress bar
- [ ] Polish all UI transition animations (250ms ease-out minimum)
- [ ] Performance audit: verify 60fps on target hardware
- [ ] Commit to `feature/phase-8-polish`
- [ ] Update CHECKLIST.md and write DEVLOG entry
- [ ] Create PR, review, and merge to main

**Status: 0 / 16**

---

## Phase 9: Deploy, Performance & SEO
> Branch: `feature/phase-9-deploy`

- [ ] Enable draco compression on GLTF loader
- [ ] Add dynamic imports for heavy components (3D scene)
- [ ] Set up `next/image` for all 2D images
- [ ] Run bundle analysis: `npx next build && npx @next/bundle-analyzer`
- [ ] Optimize any large chunks identified in bundle analysis
- [ ] Add Open Graph meta tags (title, description, og:image)
- [ ] Design and add OG image (garage screen visual)
- [ ] Add Twitter Card meta tags
- [ ] Add JSON-LD structured data (Person schema)
- [ ] Add `sitemap.xml` and `robots.txt`
- [ ] Set up Vercel Analytics
- [ ] Add event tracking (car selected, project viewed, engineer chat opened)
- [ ] Build static fallback page for non-WebGL devices
- [ ] Add skip-to-content accessibility link
- [ ] Add alt text to all case study images
- [ ] Run Lighthouse audit on mobile (target >80) and desktop (target >90)
- [ ] Final review and update of README.md with screenshots/GIF
- [ ] Commit to `feature/phase-9-deploy`
- [ ] Merge to main, verify live Vercel deployment
- [ ] Share on LinkedIn

**Status: 0 / 20**

---

## Overall Progress

| Phase | Name | Status |
|-------|------|--------|
| 0 | Project Scaffolding | 17 / 17 ✅ |
| 1 | The Garage | 11 / 13 |
| 2 | Lights Out | 0 / 10 |
| 3 | The Circuit | 0 / 18 |
| 4 | Telemetry HUD | 0 / 15 |
| 5 | DRS Zones | 0 / 19 |
| 6 | Race Engineer | 0 / 16 |
| 7 | Chequered Flag | 0 / 10 |
| 8 | Audio & Polish | 0 / 16 |
| 9 | Deploy & SEO | 0 / 20 |
| **Total** | | **0 / 154** |
