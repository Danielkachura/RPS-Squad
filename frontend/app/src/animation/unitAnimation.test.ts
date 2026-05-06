import { describe, expect, it } from "vitest";
import { resolveUnitAnimation } from "./unitAnimation";

describe("unit animation state resolver", () => {
  it("V15 holds weapon reveal strips during the reveal countdown", () => {
    expect(resolveUnitAnimation({ owner: "player", phase: "reveal_hold" }).stripName).toBe("red_weapon_reveal");
    expect(resolveUnitAnimation({ owner: "ai", phase: "reveal_hold" }).stripName).toBe("blue_weapon_reveal");
  });

  it("V16 resolves T=0 reveal transition to weapon hide and then idle", () => {
    expect(resolveUnitAnimation({ owner: "player", phase: "reveal_hide" })).toEqual({
      stripName: "red_weapon_hide",
      nextStripName: "red_idle",
    });
    expect(resolveUnitAnimation({ owner: "ai", phase: "reveal_hide" })).toEqual({
      stripName: "blue_weapon_hide",
      nextStripName: "blue_idle",
    });
  });
});
