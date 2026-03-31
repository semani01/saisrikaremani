/**
 * engineSynth.ts — Procedural F1 engine roar using Tone.js
 *
 * Approach: a sawtooth oscillator is naturally harmonically rich — it contains
 * every integer harmonic of the fundamental. At 85 Hz it already has content
 * at 170, 255, 340, 425 Hz etc. As we sweep the fundamental upward those
 * harmonics scream automatically, just like a real engine.
 *
 * No Chebyshev, no turbo sine, no DJ processing.
 * Just oscillators → mild waveshaper → resonant filter → output.
 *
 * Sweep: 85 Hz idle → 280 Hz full throttle over 2.8s (gradual rev build)
 */

import * as Tone from 'tone'

export async function playEngineRoar(volume = 0.8): Promise<void> {
  await Tone.start()

  const masterGain = new Tone.Gain(volume).toDestination()

  // ── Mild waveshaper — just enough edge, no DJ distortion ─────────────────
  // Soft clipping curve gives harmonic saturation without harsh overdrive
  const waveshaper = new Tone.WaveShaper((x) => {
    return (3 / 2) * x * (1 - (x * x) / 3)  // soft clip (tanh approximation)
  }, 256).connect(masterGain)

  // ── Resonant bandpass — shapes the engine's tonal character ──────────────
  // Real F1 exhausts resonate around 200–400 Hz. This brings out that body.
  const bpf = new Tone.Filter({
    frequency: 220,
    type: 'bandpass',
    Q: 1.8,
  }).connect(waveshaper)

  // ── Three detuned sawtooth oscillators (thickness + slight chorus) ────────
  const osc1 = new Tone.Oscillator({ type: 'sawtooth', frequency: 85, volume: -4  }).connect(bpf)
  const osc2 = new Tone.Oscillator({ type: 'sawtooth', frequency: 85, volume: -8  }).connect(bpf)
  const osc3 = new Tone.Oscillator({ type: 'sawtooth', frequency: 170, volume: -12 }).connect(bpf)
  osc2.detune.value = -14   // slightly flat for width

  // ── Exhaust texture — barely audible pink noise for realism ──────────────
  const noise     = new Tone.Noise('pink')
  const noiseGain = new Tone.Gain(0.03).connect(waveshaper)
  noise.connect(noiseGain)

  // ── Amplitude: idle rumble → full power ───────────────────────────────────
  // Ramp up slowly at first (clutch bite point), then hold at full
  const now = Tone.now()
  masterGain.gain.setValueAtTime(0.05, now)
  masterGain.gain.linearRampToValueAtTime(volume * 0.6, now + 0.4)   // initial bite
  masterGain.gain.linearRampToValueAtTime(volume,       now + 1.2)   // full power
  masterGain.gain.setValueAtTime(volume,                now + 2.5)

  // ── Frequency sweep — gradual like an actual rev ──────────────────────────
  // Holds at idle briefly, then ramps through the rev range
  osc1.frequency.setValueAtTime(85, now)
  osc1.frequency.setValueAtTime(85, now + 0.3)                              // idle hold
  osc1.frequency.exponentialRampToValueAtTime(280, now + 2.8)               // rev up

  osc2.frequency.setValueAtTime(85, now)
  osc2.frequency.setValueAtTime(85, now + 0.3)
  osc2.frequency.exponentialRampToValueAtTime(280, now + 2.8)

  osc3.frequency.setValueAtTime(170, now)
  osc3.frequency.setValueAtTime(170, now + 0.3)
  osc3.frequency.exponentialRampToValueAtTime(560, now + 2.8)

  // BPF center tracks the rev (keeps tonal sweet spot through the sweep)
  bpf.frequency.setValueAtTime(180, now)
  bpf.frequency.exponentialRampToValueAtTime(480, now + 2.8)

  // ── Start ─────────────────────────────────────────────────────────────────
  osc1.start(now)
  osc2.start(now)
  osc3.start(now)
  noise.start(now)

  // ── Fade out and clean up ─────────────────────────────────────────────────
  return new Promise((resolve) => {
    setTimeout(() => {
      masterGain.gain.exponentialRampToValueAtTime(0.0001, Tone.now() + 0.5)
      setTimeout(() => {
        osc1.stop().dispose()
        osc2.stop().dispose()
        osc3.stop().dispose()
        noise.stop().dispose()
        noiseGain.dispose()
        bpf.dispose()
        waveshaper.dispose()
        masterGain.dispose()
        resolve()
      }, 600)
    }, 2800)
  })
}
