import { describe, expect, it } from "vitest";
import { ANIMATION_PERFORMANCE_CONTRACT } from "./performanceContract";

describe("animation performance contract", () => {
  it("V37 records the 28-sprite / 55fps performance target", () => {
    expect(ANIMATION_PERFORMANCE_CONTRACT).toEqual({
      maxAnimatedSprites: 28,
      targetFps: 55,
      rafLoops: "one-per-element",
    });
  });
});
