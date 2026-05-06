import { describe, expect, it } from "vitest";
import { BLUE_STRIPS } from "./blue";
import { RED_STRIPS } from "./red";
import { REFEREE_STRIPS } from "./referee";
import { STRIP_REGISTRY } from "./index";

describe("animation strip definitions", () => {
  it("V7 defines every sprint 02 strip by team", () => {
    expect(Object.keys(RED_STRIPS).sort()).toEqual([
      "red_attack",
      "red_death",
      "red_hit",
      "red_idle",
      "red_rock_full",
      "red_rock_jump",
      "red_rock_land",
      "red_weapon_hide",
      "red_weapon_reveal",
      "red_win",
    ]);
    expect(Object.keys(BLUE_STRIPS).sort()).toEqual([
      "blue_attack",
      "blue_death",
      "blue_hit",
      "blue_idle",
      "blue_selected",
      "blue_silhouette",
      "blue_weapon_hide",
      "blue_weapon_reveal",
    ]);
    expect(Object.keys(REFEREE_STRIPS).sort()).toEqual([
      "ref_point",
      "ref_point_blue",
      "ref_point_red",
      "ref_sad",
      "ref_wave",
    ]);
    expect(Object.keys(STRIP_REGISTRY)).toHaveLength(23);
  });

  it("V7 uses sheet math metadata for referee and rock jump strips", () => {
    expect(REFEREE_STRIPS.ref_wave.frames[7].asset).toMatchObject({
      type: "sheet",
      sheetCols: 4,
      sheetRows: 4,
      frameIndex: 7,
      cellW: 72,
      cellH: 72,
    });
    expect(RED_STRIPS.red_rock_full.frames[7].asset).toMatchObject({
      type: "sheet",
      sheetCols: 4,
      sheetRows: 2,
      frameIndex: 7,
      cellW: 72,
      cellH: 72,
    });
  });
});
