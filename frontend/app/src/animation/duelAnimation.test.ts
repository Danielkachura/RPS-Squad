import { describe, expect, it } from "vitest";
import { resolveDuelAnimation } from "./duelAnimation";

describe("duel animation resolver", () => {
  it("V18 maps attacker to attack and target to hit strips", () => {
    expect(resolveDuelAnimation({
      attackerOwner: "player",
      targetOwner: "ai",
      attackerWeapon: "paper",
    })).toMatchObject({
      attackerStripName: "red_attack",
      targetStripName: "blue_hit",
      attackerDurationMs: 450,
      targetDurationMs: 300,
      weaponRevealMs: 800,
      winnerFlashMs: 600,
      winnerFlashBoxShadow: "0 0 12px #44bb44",
      loserDeathMs: 300,
      hideLoserAfterDeath: true,
    });
  });

  it("V22 resumes the decoy idle strip after an absorbed duel", () => {
    expect(resolveDuelAnimation({
      attackerOwner: "player",
      targetOwner: "ai",
      attackerWeapon: "scissors",
      decoyAbsorbed: true,
    }).decoyResumeStripName).toBe("blue_idle");
  });

  it("V23 uses the red rock full jump sequence for player rock attacks", () => {
    expect(resolveDuelAnimation({
      attackerOwner: "player",
      targetOwner: "ai",
      attackerWeapon: "rock",
    })).toMatchObject({
      attackerStripName: "red_rock_full",
      attackerDurationMs: 960,
      rockSpecial: true,
    });
  });
});
