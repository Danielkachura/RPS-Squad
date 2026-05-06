import { AnimationTimingAgent } from "../timingAgent";
import { BLUE_STRIPS } from "./blue";
import { RED_STRIPS } from "./red";
import { REFEREE_STRIPS } from "./referee";

export { BLUE_STRIPS } from "./blue";
export { RED_STRIPS } from "./red";
export { REFEREE_STRIPS } from "./referee";

export const STRIP_REGISTRY = {
  ...RED_STRIPS,
  ...BLUE_STRIPS,
  ...REFEREE_STRIPS,
} as const;

export type StripName = keyof typeof STRIP_REGISTRY;

export const animationAgent = new AnimationTimingAgent();

for (const strip of Object.values(STRIP_REGISTRY)) {
  animationAgent.register(strip);
}
