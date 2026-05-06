import { ASSET_PATHS } from "../../assets/characters";
import type { TimingStrip } from "../timingAgent";

const redFile = (src: string) => ({ type: "file", src }) as const;
const rockSheet = (frameIndex: number) => ({
  type: "sheet",
  src: ASSET_PATHS.sheets.heroRedJumpSprites,
  sheetCols: 4,
  sheetRows: 2,
  frameIndex,
  cellW: 72,
  cellH: 72,
}) as const;

export const RED_STRIPS = {
  red_idle: {
    name: "red_idle",
    mode: "loop",
    frames: [
      { durationMs: 800, asset: redFile(ASSET_PATHS.red.idle) },
      { durationMs: 800, asset: redFile(ASSET_PATHS.red.idle) },
    ],
  },
  red_weapon_reveal: {
    name: "red_weapon_reveal",
    mode: "once",
    frames: [
      { durationMs: 0, asset: redFile(ASSET_PATHS.red.idle) },
      { durationMs: 300, asset: redFile(ASSET_PATHS.red.rock) },
    ],
  },
  red_weapon_hide: {
    name: "red_weapon_hide",
    mode: "once",
    frames: [
      { durationMs: 0, asset: redFile(ASSET_PATHS.red.rock) },
      { durationMs: 400, asset: redFile(ASSET_PATHS.red.idle) },
    ],
  },
  red_attack: {
    name: "red_attack",
    mode: "once",
    frames: [
      { durationMs: 0, asset: redFile(ASSET_PATHS.red.idle) },
      { durationMs: 150, asset: redFile(ASSET_PATHS.red.kick) },
      { durationMs: 300, asset: redFile(ASSET_PATHS.red.idle) },
    ],
  },
  red_hit: {
    name: "red_hit",
    mode: "once",
    frames: [
      { durationMs: 0, asset: redFile(ASSET_PATHS.red.idle) },
      { durationMs: 100, asset: redFile(ASSET_PATHS.red.kickSprite) },
      { durationMs: 200, asset: redFile(ASSET_PATHS.red.idle) },
    ],
  },
  red_death: {
    name: "red_death",
    mode: "once",
    frames: [{ durationMs: 300, asset: redFile(ASSET_PATHS.red.idle) }],
  },
  red_win: {
    name: "red_win",
    mode: "once",
    frames: [{ durationMs: 1_000_000, asset: redFile(ASSET_PATHS.red.trophy) }],
  },
  red_rock_jump: {
    name: "red_rock_jump",
    mode: "once",
    frames: [0, 1, 2, 3].map((frameIndex) => ({ durationMs: 120, asset: rockSheet(frameIndex) })),
  },
  red_rock_land: {
    name: "red_rock_land",
    mode: "once",
    frames: [4, 5, 6, 7].map((frameIndex) => ({ durationMs: 120, asset: rockSheet(frameIndex) })),
  },
  red_rock_full: {
    name: "red_rock_full",
    mode: "once",
    frames: [0, 1, 2, 3, 4, 5, 6, 7].map((frameIndex) => ({ durationMs: 120, asset: rockSheet(frameIndex) })),
  },
} as const satisfies Record<string, TimingStrip>;
