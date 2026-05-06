import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { useRef } from "react";
import { animationAgent } from "./strips";
import { useAnimation } from "./useAnimation";

function Harness({ stripName }: { stripName: "red_idle" | "blue_idle" }) {
  const ref = useRef<HTMLImageElement>(null);
  useAnimation(ref, stripName);
  return <img ref={ref} alt="" />;
}

describe("useAnimation", () => {
  it("V8 plays the requested strip and stops it on cleanup", () => {
    const play = vi.spyOn(animationAgent, "play").mockImplementation(() => undefined);
    const stop = vi.spyOn(animationAgent, "stop").mockImplementation(() => undefined);

    const { unmount } = render(<Harness stripName="red_idle" />);
    const el = document.querySelector("img");

    expect(play).toHaveBeenCalledWith("red_idle", el, undefined);
    unmount();
    expect(stop).toHaveBeenCalledWith(el);
  });
});
