# Sai Srikar Emani — Portfolio Grand Prix

**An F1-themed interactive portfolio where you drive a race car through my career.**

Live: [saisrikaremani.vercel.app](https://saisrikaremani.vercel.app) · Future: [saisrikaremani.com](https://saisrikaremani.com)

---

## What Is This

Portfolio Grand Prix (PGP) is a 3D portfolio experience built with React Three Fiber and Next.js. Visitors select a race car, watch the F1 lights-out sequence, and then drive along the Emani International Circuit — a procedurally generated track where every corner, straight, and sector tells a part of my story.

- **Sector 1 — Origins:** Education (MS CS at CU Denver, BTech at KL University)
- **Sector 2 — Pit Lane:** Work experience (CU Anschutz ML Research, Bragify SDE, Samsung R&D)
- **Sector 3 — Straights:** Projects (PEGASUS, FloraSense, AI Stock Picker, Maieutic, and more)
- **DRS Zones:** Deep-dive case studies for each project — architecture, metrics, decisions
- **Race Engineer:** Claude-powered AI chatbot that answers questions about my career in F1 radio voice
- **Podium:** Contact info (Email P1, GitHub P2, LinkedIn P3) + resume download

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js (App Router) |
| 3D Engine | React Three Fiber + @react-three/drei |
| Styling | Tailwind CSS |
| State | Zustand |
| Animation | Framer Motion |
| Audio | Howler.js + Tone.js |
| AI Chatbot | Claude API (claude-sonnet-4-6) |
| Voice TTS | ElevenLabs + Web Speech API fallback |
| Hosting | Vercel |

---

## Running Locally

**Prerequisites:** Node.js v20+, npm

```bash
# Clone
git clone https://github.com/semani01/saisrikaremani.git
cd saisrikaremani

# Install
npm install

# Environment variables
cp .env.example .env.local
# Fill in ANTHROPIC_API_KEY and ELEVENLABS_API_KEY in .env.local

# Dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Project Status

Currently in active development. See [docs/CHECKLIST.md](docs/CHECKLIST.md) for phase-by-phase progress.

| Phase | Description | Status |
|-------|-------------|--------|
| 0 | Scaffolding & Setup | ✅ Complete |
| 1 | The Garage (Car Selection) | Pending |
| 2 | Lights Out (Launch Sequence) | Pending |
| 3 | The Circuit (3D Track & Car) | Pending |
| 4 | Telemetry HUD | Pending |
| 5 | DRS Zones (Project Deep-Dives) | Pending |
| 6 | Race Engineer (AI Chatbot) | Pending |
| 7 | Chequered Flag (Contact & Podium) | Pending |
| 8 | Audio & Visual Polish | Pending |
| 9 | Deploy, Performance & SEO | Pending |

---

## Docs

- [ROADMAP.md](docs/ROADMAP.md) — Full build plan with phase breakdowns and design decisions
- [ARCHITECTURE.md](docs/ARCHITECTURE.md) — System design, state shape, component tree, data flow
- [CHECKLIST.md](docs/CHECKLIST.md) — Phase-by-phase task tracking
- [DEVLOG.md](docs/DEVLOG.md) — Engineering journal
- [PROJECTS.md](docs/PROJECTS.md) — Detailed case studies for all 8 projects

---

## About Me

I'm Sai Srikar Emani — MS Computer Science candidate at CU Denver (GPA 3.77), focused on ML/AI, NLP, and full-stack engineering. This portfolio is both a professional showcase and a technical project in its own right.

- GitHub: [github.com/semani01](https://github.com/semani01)
- LinkedIn: [linkedin.com/in/saisrikaremani](https://linkedin.com/in/saisrikaremani)
- Email: contact via the podium on the site

---

*Built with React, Three.js, and Claude API.*
