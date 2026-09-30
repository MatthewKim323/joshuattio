"use client";

import { useCallback, useEffect, useRef } from "react";

// Short synthesized tick (noise + tone through a filter), scheduled in bursts
// with an eased spacing. One AudioContext is shared by every hook instance and
// unlocked on the first pointerdown / keydown.

export type ClickSoundOptions = {
  randomness?: number;
  toneMix?: number;
  toneFrequency?: number;
  attack?: number;
  release?: number;
  sustain?: number;
  singleVoice?: boolean;
  highpassFrequency?: number;
  lowpassFrequency?: number;
  lowpassQ?: number;
  volume?: number;
};

export type PlayOptions = {
  animationDuration?: number;
  timeEase?: (t: number) => number;
  bypassSingleVoiceGate?: boolean;
};

let sharedCtx: AudioContext | null = null;
let unlockInstalled = false;

function useAudioContext() {
  const ref = useRef<AudioContext | null>(null);
  useEffect(() => {
    if (unlockInstalled) {
      ref.current = sharedCtx;
      return;
    }
    unlockInstalled = true;
    if (!sharedCtx) sharedCtx = new AudioContext();
    const ctx = sharedCtx;
    ref.current = ctx;
    const unlock = () => {
      if (ctx.state === "suspended") void ctx.resume();
      const src = ctx.createBufferSource();
      src.buffer = ctx.createBuffer(1, 1, ctx.sampleRate);
      src.connect(ctx.destination);
      src.start(0);
      document.removeEventListener("pointerdown", unlock);
      document.removeEventListener("keydown", unlock);
    };
    document.addEventListener("pointerdown", unlock);
    document.addEventListener("keydown", unlock);
    return () => {
      document.removeEventListener("pointerdown", unlock);
      document.removeEventListener("keydown", unlock);
    };
  }, []);
  return ref;
}

export function useClickSound(opts?: ClickSoundOptions) {
  const ctxRef = useAudioContext();
  const noiseRef = useRef<Float32Array | null>(null);
  const gateRef = useRef(0);
  const randomness = opts?.randomness ?? 0.5;
  const toneMix = opts?.toneMix ?? 0;
  const toneFrequency = opts?.toneFrequency ?? 1500;
  const attack = opts?.attack ?? 0.002;
  const release = opts?.release ?? 0.001;
  const sustain = opts?.sustain ?? 0;
  const singleVoice = opts?.singleVoice ?? false;
  const highpassFrequency = opts?.highpassFrequency ?? 1e3;
  const lowpassFrequency = opts?.lowpassFrequency ?? 8e3;
  const lowpassQ = opts?.lowpassQ ?? 8;
  const volume = opts?.volume ?? 0.1;
  const total = attack + sustain + release;

  useEffect(() => {
    const ctx = ctxRef.current;
    if (!ctx) return;
    const size = Math.max(1, Math.ceil(ctx.sampleRate * total));
    const noise = new Float32Array(size);
    let seed = 12345;
    for (let i = 0; i < size; i++) {
      seed = (0x41c64e6d * seed + 12345) & 0x7fffffff;
      noise[i] = (seed / 0x7fffffff) * 2 - 1;
    }
    noiseRef.current = noise;
  }, [ctxRef, total]);

  return useCallback(
    (count: number, play?: PlayOptions) => {
      if (count <= 0) return;
      const ctx = ctxRef.current;
      if (!ctx) return;
      const sampleRate = ctx.sampleRate;
      const bufferSize = Math.max(1, Math.ceil(sampleRate * total));
      const noise = noiseRef.current;
      if (!noise) return;
      const now = ctx.currentTime;
      if (singleVoice && !play?.bypassSingleVoiceGate && now < gateRef.current) return;
      const span = play?.animationDuration ?? 0.3;
      const ease = play?.timeEase;
      const at = (i: number) => {
        const t = count <= 1 ? 0 : i / count;
        return ease ? ease(t) : t;
      };
      if (singleVoice) gateRef.current = now + at(count - 1) * span + total;
      for (let i = 0; i < count; i++) {
        const start = now + at(i) * span;
        const src = ctx.createBufferSource();
        const buffer = ctx.createBuffer(1, bufferSize, sampleRate);
        const data = buffer.getChannelData(0);
        for (let s = 0; s < bufferSize; s++) {
          const n = noise[s] * (1 - randomness) + (2 * Math.random() - 1) * randomness;
          const tone = Math.sin((2 * Math.PI * toneFrequency * s) / sampleRate);
          data[s] = n * (1 - toneMix) + tone * toneMix;
        }
        src.buffer = buffer;
        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0, start);
        gain.gain.linearRampToValueAtTime(volume, start + attack);
        if (sustain > 0) gain.gain.linearRampToValueAtTime(volume, start + attack + sustain);
        gain.gain.linearRampToValueAtTime(0, start + total);
        const lowpass = ctx.createBiquadFilter();
        lowpass.type = "lowpass";
        lowpass.frequency.value = lowpassFrequency;
        lowpass.Q.value = lowpassQ;
        let node: AudioNode = src;
        if (highpassFrequency > 0) {
          const highpass = ctx.createBiquadFilter();
          highpass.type = "highpass";
          highpass.frequency.value = highpassFrequency;
          node.connect(highpass);
          node = highpass;
        }
        node.connect(lowpass);
        lowpass.connect(gain);
        gain.connect(ctx.destination);
        src.start(start);
        src.stop(start + total);
      }
    },
    [ctxRef, randomness, toneMix, toneFrequency, attack, sustain, release, total, singleVoice, highpassFrequency, lowpassFrequency, lowpassQ, volume],
  );
}
