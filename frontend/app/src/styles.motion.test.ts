import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const css = readFileSync(resolve(__dirname, "styles.css"), "utf8");

describe("motion polish CSS", () => {
  it("V34 defines idle breathing with translateY over 1600ms", () => {
    expect(css).toContain("@keyframes idleBreathing");
    expect(css).toContain("translateY(-3px)");
    expect(css).toContain("animation: idleBreathing 1600ms ease-in-out infinite");
  });

  it("V35 defines board cell hover scale with a 100ms transition", () => {
    expect(css).toContain(".board-cell");
    expect(css).toContain("transition: transform 100ms ease");
    expect(css).toContain(".board-cell:hover");
    expect(css).toContain("transform: scale(1.12)");
  });

  it("V36 defines duel overlay top slide entrance over 300ms ease-out", () => {
    expect(css).toContain("@keyframes duelSlideIn");
    expect(css).toContain("translateY(-100%)");
    expect(css).toContain("animation: duelSlideIn 300ms ease-out");
  });

  it("player and board motion classes exist", () => {
    expect(css).toContain(".idle-breathing");
    expect(css).toContain(".game-board-ambient");
    expect(css).toContain("@keyframes boardAmbientPulse");
  });
});
