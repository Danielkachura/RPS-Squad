import { describe, expect, it } from "vitest";
import { createEndgameRevealPlan, resolveFlagDeathAnimation, resolveWinningTeamAnimation } from "./endgameAnimation";

describe("endgame animation resolver", () => {
  it("V31 plays flag death then triggers game-over overlay", () => {
    expect(resolveFlagDeathAnimation({ owner: "ai" })).toEqual({
      stripName: "blue_death",
      deathMs: 300,
      triggerGameOverOverlay: true,
    });
  });

  it("V32 switches winning player characters to red trophy pose", () => {
    expect(resolveWinningTeamAnimation({ winner: "player", aliveCount: 14 })).toEqual({
      winner: "player",
      stripName: "red_win",
      affectedUnits: 14,
    });
  });

  it("V33 fades CPU hidden weapons in with a 1s stagger after match end", () => {
    expect(createEndgameRevealPlan(["ai-1", "ai-2", "ai-3"])).toEqual([
      { pieceId: "ai-1", delayMs: 0, durationMs: 1000 },
      { pieceId: "ai-2", delayMs: 1000, durationMs: 1000 },
      { pieceId: "ai-3", delayMs: 2000, durationMs: 1000 },
    ]);
  });
});
