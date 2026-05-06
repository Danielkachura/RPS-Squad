import type { Owner } from "@shared/types";
import type { StripName } from "./strips";

interface RevealHideOptions {
  columns: number;
  rowsPerTeam: number;
}

interface UnitTransitionAction {
  owner: Owner;
  row: number;
  col: number;
  delayMs: number;
  stripName: StripName;
}

export function createRevealHideTransition({ columns, rowsPerTeam }: RevealHideOptions): UnitTransitionAction[] {
  const actions: UnitTransitionAction[] = [];

  for (const owner of ["ai", "player"] as const) {
    for (let row = 1; row <= rowsPerTeam; row += 1) {
      for (let col = 1; col <= columns; col += 1) {
        actions.push({
          owner,
          row,
          col,
          delayMs: (col - 1) * 20,
          stripName: owner === "player" ? "red_weapon_hide" : "blue_weapon_hide",
        });
      }
    }
  }

  return actions;
}

export function createBattleStartTransition() {
  return {
    unitBobStripName: "red_idle",
    unitBobOnce: true,
    refereeStripName: "ref_point",
    turnText: "YOUR TURN",
    turnTextAnimation: "fadeIn",
  } as const;
}
