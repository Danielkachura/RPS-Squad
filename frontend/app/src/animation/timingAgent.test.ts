import { describe, expect, expectTypeOf, it, vi } from "vitest";
import { AnimationTimingAgent, TIMING_AGENT_CONTRACT_VERSION } from "./timingAgent";
import type { SpriteAsset, StripFrame, TimingStrip } from "./timingAgent";

describe("AnimationTimingAgent contracts", () => {
  it("V5 exports strict timing strip types", () => {
    const fileAsset: SpriteAsset = {
      type: "file",
      src: "/src/assets/characters/red/char-red-idle.png",
    };
    const sheetAsset: SpriteAsset = {
      type: "sheet",
      src: "/src/assets/characters/sheets/referee-flags-matrix.png",
      sheetCols: 4,
      sheetRows: 4,
      frameIndex: 5,
      cellW: 72,
      cellH: 72,
    };
    const frame: StripFrame = { durationMs: 250, asset: fileAsset };
    const strip: TimingStrip = { name: "red_idle", mode: "loop", frames: [frame, { durationMs: 250, asset: sheetAsset }] };

    expect(strip.name).toBe("red_idle");
    expect(TIMING_AGENT_CONTRACT_VERSION).toBe(1);
    expectTypeOf(strip.mode).toEqualTypeOf<"loop" | "once">();
  });

  it("V6 plays registered file strips on img elements and fires onEnd for one-shots", () => {
    const agent = new AnimationTimingAgent();
    const img = document.createElement("img");
    const onEnd = vi.fn();
    let raf: FrameRequestCallback | null = null;

    vi.spyOn(window, "requestAnimationFrame").mockImplementation((callback) => {
      raf = callback;
      return 1;
    });
    vi.spyOn(window, "cancelAnimationFrame").mockImplementation(() => undefined);

    agent.register({
      name: "red_attack",
      mode: "once",
      frames: [
        { durationMs: 0, asset: { type: "file", src: "/idle.png" } },
        { durationMs: 150, asset: { type: "file", src: "/kick.png" } },
      ],
    });

    agent.play("red_attack", img, onEnd);

    expect(img.src).toContain("/idle.png");
    raf?.(0);
    raf?.(151);

    expect(img.src).toContain("/kick.png");
    expect(onEnd).toHaveBeenCalledTimes(1);
  });

  it("V6 computes sheet background positioning from frameIndex", () => {
    const agent = new AnimationTimingAgent();
    const el = document.createElement("div");

    vi.spyOn(window, "requestAnimationFrame").mockImplementation(() => 1);

    agent.register({
      name: "ref_point",
      mode: "once",
      frames: [
        {
          durationMs: 250,
          asset: {
            type: "sheet",
            src: "/referee.png",
            sheetCols: 4,
            sheetRows: 4,
            frameIndex: 6,
            cellW: 72,
            cellH: 72,
          },
        },
      ],
    });

    agent.play("ref_point", el);

    expect(el.style.backgroundImage).toContain("/referee.png");
    expect(el.style.backgroundPosition).toBe("-144px -72px");
    expect(el.style.width).toBe("72px");
    expect(el.style.height).toBe("72px");
  });

  it("V6 stops active playback on an element", () => {
    const agent = new AnimationTimingAgent();
    const el = document.createElement("img");
    const cancel = vi.spyOn(window, "cancelAnimationFrame").mockImplementation(() => undefined);

    vi.spyOn(window, "requestAnimationFrame").mockImplementation(() => 44);
    agent.register({
      name: "red_idle",
      mode: "loop",
      frames: [{ durationMs: 800, asset: { type: "file", src: "/idle.png" } }],
    });

    agent.play("red_idle", el);
    agent.stop(el);

    expect(cancel).toHaveBeenCalledWith(44);
  });
});
