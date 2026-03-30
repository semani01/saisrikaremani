/**
 * f1Mappings.ts — F1 terminology ↔ portfolio concept map
 * Used by: Telemetry HUD labels, race engineer chatbot system prompt,
 * trackside visuals, and sector banners.
 */

import type { TireCompound, SectorInfo } from '@/types'

// ─── Tire Compounds → Programming Languages ───────────────────────────────────

export const tireCompounds: TireCompound[] = [
  {
    id: 'soft',
    color: '#e24b4a',
    label: 'Soft',
    skill: 'Python',
    detail: 'Primary — ML, data, backend',
  },
  {
    id: 'medium',
    color: '#ef9f27',
    label: 'Medium',
    skill: 'JavaScript / Node.js',
    detail: 'Full-stack, APIs, React',
  },
  {
    id: 'hard',
    color: '#e8e6e0',
    label: 'Hard',
    skill: 'Java',
    detail: 'Systems, algorithms',
  },
  {
    id: 'intermediate',
    color: '#5dca85',
    label: 'Intermediate',
    skill: 'SQL',
    detail: 'PostgreSQL, MongoDB, SQLite',
  },
  {
    id: 'wet',
    color: '#85b7eb',
    label: 'Wet',
    skill: 'ML Frameworks',
    detail: 'PyTorch, TensorFlow, Flask, Express',
  },
  {
    id: 'hypersoft',
    color: '#afa9ec',
    label: 'Hypersoft',
    skill: 'GenAI / RAG Stack',
    detail: 'LangChain, FAISS, Chroma, Embeddings',
  },
]

// ─── Sectors ──────────────────────────────────────────────────────────────────

export const sectors: SectorInfo[] = [
  { number: 1, name: 'Origins', content: 'Education' },
  { number: 2, name: 'Pit Lane', content: 'Work Experience' },
  { number: 3, name: 'Straights', content: 'Projects' },
]

// ─── Full F1 Terminology Map ──────────────────────────────────────────────────
// Used as reference for the race engineer chatbot system prompt.

export const f1TermMap: Record<string, { portfolioMeaning: string; appearsIn: string }> = {
  'Tire compound (Soft)':     { portfolioMeaning: 'Python',                          appearsIn: 'Telemetry, chatbot' },
  'Tire compound (Medium)':   { portfolioMeaning: 'JavaScript / Node.js',            appearsIn: 'Telemetry, chatbot' },
  'Tire compound (Hard)':     { portfolioMeaning: 'Java',                            appearsIn: 'Telemetry, chatbot' },
  'Tire compound (Inter)':    { portfolioMeaning: 'SQL',                             appearsIn: 'Telemetry, chatbot' },
  'Tire compound (Wet)':      { portfolioMeaning: 'Frameworks (PyTorch, etc.)',      appearsIn: 'Telemetry, chatbot' },
  'Tire compound (Hypersoft)':{ portfolioMeaning: 'GenAI / RAG stack',               appearsIn: 'Telemetry, chatbot' },
  'Engine mode':              { portfolioMeaning: 'Primary skill domain (ML/AI)',    appearsIn: 'Telemetry top-right' },
  'ERS deploy':               { portfolioMeaning: 'Secondary skill (full-stack)',    appearsIn: 'Telemetry top-right' },
  'DRS zone':                 { portfolioMeaning: 'Project deep-dive area',          appearsIn: 'Track + project cards' },
  'Pit stop':                 { portfolioMeaning: 'Work experience',                 appearsIn: 'Track + experience cards' },
  'Sector 1 — Origins':       { portfolioMeaning: 'Education',                       appearsIn: 'Track banners, HUD' },
  'Sector 2 — Pit Lane':      { portfolioMeaning: 'Work experience',                 appearsIn: 'Track banners, HUD' },
  'Sector 3 — Straights':     { portfolioMeaning: 'Projects',                        appearsIn: 'Track banners, HUD' },
  'Lap time / splits':        { portfolioMeaning: 'Project metrics',                 appearsIn: 'Telemetry expanded' },
  'Race engineer':            { portfolioMeaning: 'AI chatbot (Claude)',             appearsIn: 'Chat panel' },
  'Chequered flag':           { portfolioMeaning: 'Finish / contact section',        appearsIn: 'Podium' },
  'Podium P1':                { portfolioMeaning: 'Email',                           appearsIn: 'Contact page' },
  'Podium P2':                { portfolioMeaning: 'GitHub',                          appearsIn: 'Contact page' },
  'Podium P3':                { portfolioMeaning: 'LinkedIn',                        appearsIn: 'Contact page' },
  'Timing tower':             { portfolioMeaning: 'LeetCode stats',                  appearsIn: 'Trackside element' },
  'Grid position':            { portfolioMeaning: 'Career starting point',           appearsIn: 'Sector 1 narrative' },
  'Fastest lap':              { portfolioMeaning: 'Best project metric',             appearsIn: 'Telemetry highlight' },
  'Safety car':               { portfolioMeaning: 'Career pause / pivot',            appearsIn: 'Chatbot lore' },
  'Team radio':               { portfolioMeaning: 'Chatbot conversation',            appearsIn: 'Chat panel header' },
  'Garage':                   { portfolioMeaning: 'Landing / car selection',         appearsIn: 'Screen 1' },
  'Race pace':                { portfolioMeaning: 'Project output cadence',          appearsIn: 'Chatbot response' },
  'Undercut / overcut':       { portfolioMeaning: 'Strategic career moves',          appearsIn: 'Chatbot response' },
  'Circuit name':             { portfolioMeaning: 'Emani International Circuit',     appearsIn: 'Minimap, track signage' },
  'Race weekend':             { portfolioMeaning: 'Portfolio Grand Prix (PGP)',      appearsIn: 'Garage screen, browser tab' },
}

// ─── Team Cards (Garage Screen) ───────────────────────────────────────────────

export const teamCards = {
  mercedes: {
    name: 'Silver Arrow',
    tagline: 'Precision engineering',
    accentColor: '#00d2be',
    bgColor: '#1a1f1a',
    borderColor: '#2d5a3a',
    number: '44',
    personality: 'Analytical, methodical, data-driven',
    stats: [
      { label: 'Approach', value: 'ML/AI first' },
      { label: 'Strength', value: 'Deep Learning' },
      { label: 'Specialty', value: 'NLP & Transformers' },
    ],
  },
  ferrari: {
    name: 'Scuderia',
    tagline: 'Passion-driven',
    accentColor: '#dc1430',
    bgColor: '#1f1a1a',
    borderColor: '#5a2d2d',
    number: '16',
    personality: 'Bold, creative, full-stack energy',
    stats: [
      { label: 'Approach', value: 'Build fast' },
      { label: 'Strength', value: 'Full-Stack' },
      { label: 'Specialty', value: 'AI Products' },
    ],
  },
  mclaren: {
    name: 'Papaya',
    tagline: 'Innovation first',
    accentColor: '#ff8000',
    bgColor: '#1f1c1a',
    borderColor: '#5a4a2d',
    number: '04',
    personality: 'Curious, experimental, RAG-native',
    stats: [
      { label: 'Approach', value: 'Research-grade' },
      { label: 'Strength', value: 'Computer Vision' },
      { label: 'Specialty', value: 'RAG & Embeddings' },
    ],
  },
  redbull: {
    name: 'Blue Bull',
    tagline: 'Relentless pace',
    accentColor: '#3671c6',
    bgColor: '#1a1a22',
    borderColor: '#2d2d5a',
    number: '01',
    personality: 'Competitive, production-focused, ship-it mentality',
    stats: [
      { label: 'Approach', value: 'Production scale' },
      { label: 'Strength', value: 'MLOps & Cloud' },
      { label: 'Specialty', value: 'Model Deployment' },
    ],
  },
}
