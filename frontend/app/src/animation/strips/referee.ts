import { ASSET_PATHS } from "../../assets/characters";
import type { TimingStrip } from "../timingAgent";

const refSheet = (frameIndex: number) => ({
  type: "sheet",
  src: ASSET_PATHS.sheets.refereeFlagsMatrix,
  sheetCols: 4,
  sheetRows: 4,
  frameIndex,
  cellW: 72,
  cellH: 72,
}) as const;

export const REFEREE_STRIPS = {
  ref_wave: {
    name: "ref_wave",
    mode: "loop",
    frames: [0, 1, 2, 3, 4, 5, 6, 7].map((frameIndex) => ({ durationMs: 250, asset: refSheet(frameIndex) })),
  },
  ref_point: {
    name: "ref_point",
    mode: "once",
    frames: [8, 9, 10, 11].map((frameIndex) => ({ durationMs: 250, asset: refSheet(frameIndex) })),
  },
  ref_point_blue: {
    name: "ref_point_blue",
    mode: "once",
    frames: [{ durationMs: 250, asset: refSheet(11) }],
  },
  ref_point_red: {
    name: "ref_point_red",
    mode: "once",
    frames: [{ durationMs: 250, asset: refSheet(10) }],
  },
  ref_sad: {
    name: "ref_sad",
    mode: "once",
    frames: [12, 13, 14, 15].map((frameIndex) => ({ durationMs: 250, asset: refSheet(frameIndex) })),
  },
} as const satisfies Record<string, TimingStrip>;
