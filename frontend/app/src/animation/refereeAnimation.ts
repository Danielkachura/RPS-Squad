import type { StripName } from "./strips";

export type RefereeAnimationState =
  | "idle"
  | "player_turn"
  | "player_moved"
  | "game_over"
  | "reveal";

interface ResolvedRefereeAnimation {
  stripName: StripName;
  mode: "loop" | "once";
  holdLastFrame?: boolean;
  postHoldStripName?: StripName;
  poseHint?: "arms_spread";
}

export function resolveRefereeAnimation({ state }: { state: RefereeAnimationState }): ResolvedRefereeAnimation {
  if (state === "player_moved") return { stripName: "ref_point", mode: "once", holdLastFrame: true };
  if (state === "game_over") {
    return { stripName: "ref_sad", mode: "once", holdLastFrame: true, postHoldStripName: "ref_sad" };
  }
  if (state === "reveal") return { stripName: "ref_wave", mode: "loop", poseHint: "arms_spread" };

  return { stripName: "ref_wave", mode: "loop" };
}
