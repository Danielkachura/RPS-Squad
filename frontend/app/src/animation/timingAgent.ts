export const TIMING_AGENT_CONTRACT_VERSION = 1;

export interface FileSpriteAsset {
  type: "file";
  src: string;
}

export interface SheetSpriteAsset {
  type: "sheet";
  src: string;
  sheetCols: number;
  sheetRows: number;
  frameIndex: number;
  cellW: number;
  cellH: number;
}

export type SpriteAsset = FileSpriteAsset | SheetSpriteAsset;

export interface StripFrame {
  durationMs: number;
  asset: SpriteAsset;
}

export interface TimingStrip {
  name: string;
  mode: "loop" | "once";
  frames: readonly StripFrame[];
}

interface Playback {
  strip: TimingStrip;
  frameIndex: number;
  elapsedMs: number;
  lastTimestamp: number | null;
  rafId: number;
  onEnd?: () => void;
}

export class AnimationTimingAgent {
  private readonly strips = new Map<string, TimingStrip>();
  private readonly active = new WeakMap<HTMLElement, Playback>();

  register(strip: TimingStrip): void {
    if (strip.frames.length === 0) {
      throw new Error(`Timing strip "${strip.name}" must include at least one frame.`);
    }

    this.strips.set(strip.name, strip);
  }

  play(name: string, el: HTMLElement, onEnd?: () => void): void {
    const strip = this.strips.get(name);
    if (!strip) {
      throw new Error(`Timing strip "${name}" is not registered.`);
    }

    this.stop(el);
    this.renderFrame(el, strip.frames[0]);

    const playback: Playback = {
      strip,
      frameIndex: 0,
      elapsedMs: 0,
      lastTimestamp: null,
      rafId: 0,
      onEnd,
    };

    const tick = (timestamp: number): void => {
      const current = this.active.get(el);
      if (current !== playback) return;

      if (playback.lastTimestamp === null) {
        playback.lastTimestamp = timestamp;
      } else {
        playback.elapsedMs += timestamp - playback.lastTimestamp;
        playback.lastTimestamp = timestamp;
        this.advance(el, playback);
      }

      if (this.active.get(el) === playback) {
        playback.rafId = window.requestAnimationFrame(tick);
      }
    };

    playback.rafId = window.requestAnimationFrame(tick);
    this.active.set(el, playback);
  }

  stop(el: HTMLElement): void {
    const playback = this.active.get(el);
    if (!playback) return;

    window.cancelAnimationFrame(playback.rafId);
    this.active.delete(el);
  }

  private advance(el: HTMLElement, playback: Playback): void {
    let frame = playback.strip.frames[playback.frameIndex];

    while (playback.elapsedMs >= frame.durationMs) {
      playback.elapsedMs -= frame.durationMs;

      if (playback.frameIndex < playback.strip.frames.length - 1) {
        playback.frameIndex += 1;
        frame = playback.strip.frames[playback.frameIndex];
        this.renderFrame(el, frame);
      } else if (playback.strip.mode === "loop") {
        playback.frameIndex = 0;
        frame = playback.strip.frames[0];
        this.renderFrame(el, frame);
      } else {
        playback.onEnd?.();
        this.stop(el);
        return;
      }

      if (frame.durationMs === 0 && playback.frameIndex === playback.strip.frames.length - 1 && playback.strip.mode === "once") {
        playback.onEnd?.();
        this.stop(el);
        return;
      }
    }
  }

  private renderFrame(el: HTMLElement, frame: StripFrame): void {
    const { asset } = frame;

    if (asset.type === "file") {
      if (el instanceof HTMLImageElement) {
        el.src = asset.src;
      } else {
        el.style.backgroundImage = `url("${asset.src}")`;
      }
      return;
    }

    const col = asset.frameIndex % asset.sheetCols;
    const row = Math.floor(asset.frameIndex / asset.sheetCols);

    el.style.backgroundImage = `url("${asset.src}")`;
    el.style.backgroundRepeat = "no-repeat";
    el.style.backgroundPosition = `${-col * asset.cellW}px ${-row * asset.cellH}px`;
    el.style.backgroundSize = `${asset.sheetCols * asset.cellW}px ${asset.sheetRows * asset.cellH}px`;
    el.style.width = `${asset.cellW}px`;
    el.style.height = `${asset.cellH}px`;
  }
}
