import type { Owner } from "@shared/types";
import type { StripName } from "./strips";

export function resolveFlagDeathAnimation({ owner }: { owner: Owner }) {
  return {
    stripName: (owner === "player" ? "red_death" : "blue_death") as StripName,
    deathMs: 300,
    triggerGameOverOverlay: true,
  };
}

export function resolveWinningTeamAnimation({ winner, aliveCount }: { winner: Owner; aliveCount: number }) {
  return {
    winner,
    stripName: (winner === "player" ? "red_win" : "blue_idle") as StripName,
    affectedUnits: aliveCount,
  };
}

export function createEndgameRevealPlan(pieceIds: readonly string[]) {
  return pieceIds.map((pieceId, index) => ({
    pieceId,
    delayMs: index * 1000,
    durationMs: 1000,
  }));
}
