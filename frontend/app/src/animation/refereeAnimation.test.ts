import { describe, expect, it } from "vitest";
import { resolveRefereeAnimation } from "./refereeAnimation";

describe("referee animation resolver", () => {
  it("V24 uses ref_wave during idle and player-turn thinking", () => {
    expect(resolveRefereeAnimation({ state: "idle" })).toEqual({ stripName: "ref_wave", mode: "loop" });
    expect(resolveRefereeAnimation({ state: "player_turn" })).toEqual({ stripName: "ref_wave", mode: "loop" });
  });

  it("V25 plays ref_point once after the player moves", () => {
    expect(resolveRefereeAnimation({ state: "player_moved" })).toEqual({
      stripName: "ref_point",
      mode: "once",
      holdLastFrame: true,
    });
  });

  it("V26 plays ref_sad once on game over and holds sad pose", () => {
    expect(resolveRefereeAnimation({ state: "game_over" })).toEqual({
      stripName: "ref_sad",
      mode: "once",
      holdLastFrame: true,
      postHoldStripName: "ref_sad",
    });
  });

  it("V27 loops ref_wave during phase 1 reveal with arms spread", () => {
    expect(resolveRefereeAnimation({ state: "reveal" })).toEqual({
      stripName: "ref_wave",
      mode: "loop",
      poseHint: "arms_spread",
    });
  });
});
