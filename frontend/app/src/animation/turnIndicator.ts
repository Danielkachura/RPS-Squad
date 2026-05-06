import type { Owner } from "@shared/types";

interface TurnIndicatorInput {
  owner: Owner;
  currentTurn: Owner | "none";
  alive: boolean;
}

export function getTurnIndicatorClass({ owner, currentTurn, alive }: TurnIndicatorInput): "current-turn-pulse" | undefined {
  if (!alive) return undefined;
  return owner === currentTurn ? "current-turn-pulse" : undefined;
}
