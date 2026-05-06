import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { animationAgent } from "./strips";
import { AnimatedSprite } from "./AnimatedSprite";

describe("AnimatedSprite", () => {
  it("V9 renders file strips as img elements and starts animation", () => {
    const play = vi.spyOn(animationAgent, "play").mockImplementation(() => undefined);

    render(<AnimatedSprite name="red_idle" className="unit" />);

    const sprite = screen.getByTestId("animated-sprite-red_idle");
    expect(sprite.tagName).toBe("IMG");
    expect(sprite).toHaveClass("unit");
    expect(play).toHaveBeenCalledWith("red_idle", sprite, undefined);
  });

  it("V9 renders sheet strips as div elements", () => {
    vi.spyOn(animationAgent, "play").mockImplementation(() => undefined);

    render(<AnimatedSprite name="ref_wave" />);

    expect(screen.getByTestId("animated-sprite-ref_wave").tagName).toBe("DIV");
  });
});
