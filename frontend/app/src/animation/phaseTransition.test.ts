import { describe, expect, it } from "vitest";
import { createBattleStartTransition, createRevealHideTransition } from "./phaseTransition";

describe("phase transition animation plans", () => {
  it("V28 creates 28 weapon-hide actions staggered 20ms by column", () => {
    const actions = createRevealHideTransition({ columns: 7, rowsPerTeam: 2 });

    expect(actions).toHaveLength(28);
    expect(actions[0]).toMatchObject({ owner: "ai", col: 1, delayMs: 0, stripName: "blue_weapon_hide" });
    expect(actions[6]).toMatchObject({ owner: "ai", col: 7, delayMs: 120, stripName: "blue_weapon_hide" });
    expect(actions[14]).toMatchObject({ owner: "player", col: 1, delayMs: 0, stripName: "red_weapon_hide" });
  });

  it("V29 creates battle-start cues for idle bob, referee point, and YOUR TURN fade-in", () => {
    expect(createBattleStartTransition()).toEqual({
      unitBobStripName: "red_idle",
      unitBobOnce: true,
      refereeStripName: "ref_point",
      turnText: "YOUR TURN",
      turnTextAnimation: "fadeIn",
    });
  });
});
