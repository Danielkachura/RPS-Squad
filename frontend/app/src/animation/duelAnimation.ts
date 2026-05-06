import type { Owner, Weapon } from "@shared/types";
import type { StripName } from "./strips";

interface ResolveDuelAnimationInput {
  attackerOwner: Owner;
  targetOwner: Owner;
  attackerWeapon: Weapon;
  decoyAbsorbed?: boolean;
}

interface ResolvedDuelAnimation {
  attackerStripName: StripName;
  targetStripName: StripName;
  attackerDurationMs: number;
  targetDurationMs: number;
  weaponRevealMs: number;
  winnerFlashMs: number;
  winnerFlashBoxShadow: string;
  loserDeathMs: number;
  hideLoserAfterDeath: boolean;
  decoyResumeStripName?: StripName;
  rockSpecial: boolean;
}

export function resolveDuelAnimation({
  attackerOwner,
  targetOwner,
  attackerWeapon,
  decoyAbsorbed = false,
}: ResolveDuelAnimationInput): ResolvedDuelAnimation {
  const attackerStripName: StripName =
    attackerOwner === "player" && attackerWeapon === "rock"
      ? "red_rock_full"
      : attackerOwner === "player"
      ? "red_attack"
      : "blue_attack";

  return {
    attackerStripName,
    targetStripName: targetOwner === "player" ? "red_hit" : "blue_hit",
    attackerDurationMs: attackerStripName === "red_rock_full" ? 960 : 450,
    targetDurationMs: 300,
    weaponRevealMs: 800,
    winnerFlashMs: 600,
    winnerFlashBoxShadow: "0 0 12px #44bb44",
    loserDeathMs: 300,
    hideLoserAfterDeath: true,
    decoyResumeStripName: decoyAbsorbed ? (targetOwner === "player" ? "red_idle" : "blue_idle") : undefined,
    rockSpecial: attackerStripName === "red_rock_full",
  };
}
