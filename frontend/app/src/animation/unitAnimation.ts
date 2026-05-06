import type { Owner } from "@shared/types";
import type { StripName } from "./strips";

export type UnitAnimationPhase =
  | "idle"
  | "reveal_hold"
  | "reveal_hide"
  | "attack"
  | "hit"
  | "death"
  | "win";

interface ResolveUnitAnimationInput {
  owner: Owner;
  phase: UnitAnimationPhase;
  selected?: boolean;
  silhouette?: boolean;
  weapon?: "rock" | "paper" | "scissors" | null;
}

interface ResolvedUnitAnimation {
  stripName: StripName;
  nextStripName?: StripName;
}

export function resolveUnitAnimation({
  owner,
  phase,
  selected = false,
  silhouette = false,
  weapon = null,
}: ResolveUnitAnimationInput): ResolvedUnitAnimation {
  if (phase === "reveal_hold") {
    return { stripName: owner === "player" ? "red_weapon_reveal" : "blue_weapon_reveal" };
  }

  if (phase === "idle") {
    if (owner === "player") return { stripName: "red_idle" };
    if (selected) return { stripName: "blue_selected" };
    if (silhouette) return { stripName: "blue_silhouette" };
    return { stripName: "blue_idle" };
  }

  if (phase === "attack") {
    if (owner === "player" && weapon === "rock") return { stripName: "red_rock_full" };
    return { stripName: owner === "player" ? "red_attack" : "blue_attack" };
  }

  if (phase === "hit") return { stripName: owner === "player" ? "red_hit" : "blue_death" };
  if (phase === "death") return { stripName: owner === "player" ? "red_death" : "blue_death" };
  if (phase === "win") return { stripName: "red_win" };

  return {
    stripName: owner === "player" ? "red_weapon_hide" : "blue_weapon_hide",
    nextStripName: owner === "player" ? "red_idle" : "blue_idle",
  };
}
