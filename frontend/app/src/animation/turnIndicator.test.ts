import { describe, expect, it } from "vitest";
import { getTurnIndicatorClass } from "./turnIndicator";

describe("turn indicator animation", () => {
  it("V30 marks current player's alive units with a pulse class", () => {
    expect(getTurnIndicatorClass({ owner: "player", currentTurn: "player", alive: true })).toBe("current-turn-pulse");
    expect(getTurnIndicatorClass({ owner: "ai", currentTurn: "player", alive: true })).toBeUndefined();
    expect(getTurnIndicatorClass({ owner: "player", currentTurn: "player", alive: false })).toBeUndefined();
  });
});
