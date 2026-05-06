import { ASSET_PATHS } from "../../assets/characters";
import type { TimingStrip } from "../timingAgent";

const blueFile = (src: string) => ({ type: "file", src }) as const;

export const BLUE_STRIPS = {
  blue_idle: {
    name: "blue_idle",
    mode: "loop",
    frames: [
      { durationMs: 800, asset: blueFile(ASSET_PATHS.blue.idle) },
      { durationMs: 800, asset: blueFile(ASSET_PATHS.blue.idle) },
    ],
  },
  blue_weapon_reveal: {
    name: "blue_weapon_reveal",
    mode: "once",
    frames: [
      { durationMs: 0, asset: blueFile(ASSET_PATHS.blue.idle) },
      { durationMs: 300, asset: blueFile(ASSET_PATHS.blue.scissors) },
    ],
  },
  blue_weapon_hide: {
    name: "blue_weapon_hide",
    mode: "once",
    frames: [
      { durationMs: 0, asset: blueFile(ASSET_PATHS.blue.scissors) },
      { durationMs: 400, asset: blueFile(ASSET_PATHS.blue.front) },
    ],
  },
  blue_attack: {
    name: "blue_attack",
    mode: "once",
    frames: [
      { durationMs: 0, asset: blueFile(ASSET_PATHS.blue.idle) },
      { durationMs: 150, asset: blueFile(ASSET_PATHS.blue.kick) },
      { durationMs: 300, asset: blueFile(ASSET_PATHS.blue.idle) },
    ],
  },
  blue_hit: {
    name: "blue_hit",
    mode: "once",
    frames: [
      { durationMs: 0, asset: blueFile(ASSET_PATHS.blue.idle) },
      { durationMs: 100, asset: blueFile(ASSET_PATHS.blue.kick) },
      { durationMs: 200, asset: blueFile(ASSET_PATHS.blue.idle) },
    ],
  },
  blue_death: {
    name: "blue_death",
    mode: "once",
    frames: [{ durationMs: 300, asset: blueFile(ASSET_PATHS.blue.idle) }],
  },
  blue_silhouette: {
    name: "blue_silhouette",
    mode: "loop",
    frames: [{ durationMs: 1_000_000, asset: blueFile(ASSET_PATHS.blue.silhouette) }],
  },
  blue_selected: {
    name: "blue_selected",
    mode: "loop",
    frames: [
      { durationMs: 0, asset: blueFile(ASSET_PATHS.blue.pointing) },
      { durationMs: 800, asset: blueFile(ASSET_PATHS.blue.idle) },
    ],
  },
} as const satisfies Record<string, TimingStrip>;
