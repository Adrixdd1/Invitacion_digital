import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AudioService {
  private audioCtx: AudioContext | null = null;
  private activePupAudios: { [key: string]: HTMLAudioElement } = {};

  constructor() {}

  private initContext(): AudioContext {
    if (!this.audioCtx) {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      this.audioCtx = new AudioCtxClass();
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  /**
   * Play a clean, cartoonish button click sound (quick frequency sweep)
   */
  playBeep(): void {
    const ctx = this.initContext();
    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    const now = ctx.currentTime;
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(300, now + 0.1);

    gainNode.gain.setValueAtTime(0.3, now);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1);

    osc.start(now);
    osc.stop(now + 0.1);
  }

  /**
   * Play a modulated beep-beep ring representing the Pup Pad alert
   */
  playPupPadRing(): void {
    const ctx = this.initContext();
    const now = ctx.currentTime;

    const playTone = (time: number, freq: number, duration: number) => {
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, time);
      gainNode.gain.setValueAtTime(0.15, time);
      gainNode.gain.exponentialRampToValueAtTime(0.001, time + duration);

      osc.start(time);
      osc.stop(time + duration);
    };

    // Play a sequence: Low-High, Low-High
    playTone(now, 880, 0.08);
    playTone(now + 0.1, 1100, 0.08);
    playTone(now + 0.2, 880, 0.08);
    playTone(now + 0.3, 1100, 0.15);
  }

  /**
   * Synthesize a double cartoon bark: "Ruff Ruff!"
   */
  playBark(): void {
    const ctx = this.initContext();
    const now = ctx.currentTime;

    const singleBark = (startTime: number, pitchOffset: number) => {
      const osc = ctx.createOscillator();
      const noise = ctx.createOscillator(); // Or white noise, but simpler with modulated triangle osc
      const gainNode = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(ctx.destination);

      // Pitch sweep for bark
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(350 + pitchOffset, startTime);
      osc.frequency.exponentialRampToValueAtTime(100 + pitchOffset / 2, startTime + 0.12);

      // Filter settings for husky tone
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(400, startTime);
      filter.Q.setValueAtTime(1, startTime);

      // Envelope
      gainNode.gain.setValueAtTime(0.3, startTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.12);

      osc.start(startTime);
      osc.stop(startTime + 0.12);
    };

    // Bark 1
    singleBark(now, 50);
    // Bark 2 (slightly pitch-shifted and delayed)
    singleBark(now + 0.15, 20);
  }

  /**
   * Synthesize a major chord fanfare for a successful RSVP action
   */
  playSuccessFanfare(): void {
    const ctx = this.initContext();
    const now = ctx.currentTime;
    
    // Notes: C5, E5, G5, C6
    const notes = [523.25, 659.25, 783.99, 1046.50];
    const duration = 0.4;
    
    notes.forEach((freq, idx) => {
      const time = now + (idx * 0.08);
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      osc.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, time);
      
      gainNode.gain.setValueAtTime(0.12, time);
      gainNode.gain.exponentialRampToValueAtTime(0.001, time + duration);
      
      osc.start(time);
      osc.stop(time + duration);
    });
  }

  /**
   * Play the custom catchphrase or sound of a pup from the assets folder.
   * Falls back to playBark() if the audio file fails to load or play.
   */
  playPupSound(pup: string): void {
    // Stop the previous audio of this puppy if it exists and is playing
    if (this.activePupAudios[pup]) {
      try {
        this.activePupAudios[pup].pause();
        this.activePupAudios[pup].currentTime = 0;
      } catch (e) {}
    }

    const audio = new Audio(`assets/sounds/${pup}.mp3`);
    this.activePupAudios[pup] = audio;

    audio.play().catch(err => {
      console.warn(`No se pudo jugar el sonido para ${pup}, usando ladridos por defecto.`, err);
      this.playBark();
    });
  }
}
