/**
 * circuitEngine.ts — Continuous F1 engine drone for the circuit phase.
 *
 * Unlike engineSynth.ts (one-shot launch roar), this runs continuously and
 * maps car speed (0–1) to engine RPM via frequency sweep.
 *
 * Same signal chain as engineSynth — 3 sawtooth oscillators → soft-clip
 * waveshaper → resonant BPF — but looping indefinitely and speed-reactive.
 */

import * as Tone from 'tone'

export class CircuitEngine {
  private osc1: Tone.Oscillator | null = null
  private osc2: Tone.Oscillator | null = null
  private osc3: Tone.Oscillator | null = null
  private bpf: Tone.Filter | null = null
  private masterGain: Tone.Gain | null = null
  private waveshaper: Tone.WaveShaper | null = null
  private noiseNode: Tone.Noise | null = null
  private noiseGain: Tone.Gain | null = null
  private _running = false

  async start(volume: number): Promise<void> {
    await Tone.start()

    this.masterGain = new Tone.Gain(0).toDestination()

    this.waveshaper = new Tone.WaveShaper(
      (x: number) => (3 / 2) * x * (1 - (x * x) / 3),
      256,
    )
    this.waveshaper.connect(this.masterGain)

    this.bpf = new Tone.Filter({ frequency: 200, type: 'bandpass', Q: 1.5 })
    this.bpf.connect(this.waveshaper)

    this.osc1 = new Tone.Oscillator({ type: 'sawtooth', frequency: 90,  volume: -4  })
    this.osc2 = new Tone.Oscillator({ type: 'sawtooth', frequency: 90,  volume: -8  })
    this.osc3 = new Tone.Oscillator({ type: 'sawtooth', frequency: 180, volume: -12 })
    this.osc2.detune.value = -14

    this.osc1.connect(this.bpf)
    this.osc2.connect(this.bpf)
    this.osc3.connect(this.bpf)

    this.noiseNode = new Tone.Noise('pink')
    this.noiseGain = new Tone.Gain(0.02)
    this.noiseGain.connect(this.waveshaper)
    this.noiseNode.connect(this.noiseGain)

    this.osc1.start()
    this.osc2.start()
    this.osc3.start()
    this.noiseNode.start()

    // Fade in to idle volume over 1 second
    this.masterGain.gain.rampTo(volume * 0.25, 1.0)
    this._running = true
  }

  /** Called every ~frame from CarPhysics useFrame. speed: 0–1. */
  setSpeed(speed: number, volume: number): void {
    if (!this._running || !this.osc1 || !this.osc2 || !this.osc3 || !this.bpf || !this.masterGain) return

    // 90 Hz idle → 270 Hz flat-out
    const freq = 90 + speed * 180
    this.osc1.frequency.rampTo(freq,       0.1)
    this.osc2.frequency.rampTo(freq,       0.1)
    this.osc3.frequency.rampTo(freq * 2,   0.1)
    this.bpf.frequency.rampTo(200 + speed * 280, 0.1)

    // Louder under throttle
    const gain = volume * (0.15 + speed * 0.45)
    this.masterGain.gain.rampTo(gain, 0.06)
  }

  stop(): void {
    if (!this._running || !this.masterGain) return
    this._running = false
    this.masterGain.gain.rampTo(0, 0.4)
    setTimeout(() => {
      try {
        this.osc1?.stop().dispose()
        this.osc2?.stop().dispose()
        this.osc3?.stop().dispose()
        this.noiseNode?.stop().dispose()
        this.noiseGain?.dispose()
        this.bpf?.dispose()
        this.waveshaper?.dispose()
        this.masterGain?.dispose()
      } catch {
        // ignore disposal errors on cleanup
      }
    }, 450)
  }

  get running(): boolean {
    return this._running
  }
}
