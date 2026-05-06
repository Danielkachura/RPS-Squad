import { describe, expect, it } from "vitest";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { ASSET_PATHS } from "./index";

const charactersDir = resolve(__dirname);

describe("character asset pipeline", () => {
  it("V1 creates the character asset folder structure", () => {
    expect(existsSync(resolve(charactersDir, "red"))).toBe(true);
    expect(existsSync(resolve(charactersDir, "blue"))).toBe(true);
    expect(existsSync(resolve(charactersDir, "yellow"))).toBe(true);
    expect(existsSync(resolve(charactersDir, "weapons"))).toBe(true);
    expect(existsSync(resolve(charactersDir, "sheets"))).toBe(true);
  });

  it("V2 copies the listed source sprites into the character asset folders", () => {
    const expectedFiles = [
      "red/character_red_idle_nobg.png",
      "red/character_red_rock_nobg.png",
      "red/character_red_paper_nobg.png",
      "red/character_red_scissors_nobg.png",
      "red/character_red_kick_nobg.png",
      "red/character_red_flag_nobg.png",
      "red/character_red_reading_scroll_nobg.png",
      "red/character_red_trophy_nobg.png",
      "red/character_red_kick_sprite_nobg.png",
      "blue/character_blue_idle_nobg.png",
      "blue/character_blue_scissors_nobg.png",
      "blue/character_blue_flag_nobg.png",
      "blue/character_blue_kick_nobg.png",
      "blue/character_blue_pointing_nobg.png",
      "blue/character_blue_front_nobg.png",
      "blue/character_blue_head_nobg.png",
      "blue/character_blue_head_dark_nobg.png",
      "blue/character_blue_head_neutral_nobg.png",
      "yellow/character_yellow_idle_nobg.png",
      "yellow/character_yellow_fallen_nobg.png",
      "yellow/character_yellow_reading_nobg.png",
      "yellow/character_yellow_one_flag_nobg.png",
      "yellow/character_yellow_two_flags_nobg.png",
      "yellow/character_yellow_flags_spread_nobg.png",
      "yellow/character_yellow_flag_point_nobg.png",
      "weapons/rock_nobg.png",
      "weapons/scroll_nobg.png",
      "weapons/scroll_large_nobg.png",
      "weapons/scissors_nobg.png",
      "weapons/scissors_large_nobg.png",
      "sheets/referee_flags_matrix.png.png",
      "sheets/hero_red_jump_sprites.png.png",
    ];

    for (const file of expectedFiles) {
      expect(existsSync(resolve(charactersDir, file)), file).toBe(true);
    }
  });

  it("V3 exposes kebab-case character asset filenames", () => {
    const kebabFiles = [
      "red/char-red-idle.png",
      "red/char-red-rock.png",
      "red/char-red-paper.png",
      "red/char-red-scissors.png",
      "red/char-red-kick.png",
      "red/char-red-flag.png",
      "red/char-red-reading-scroll.png",
      "red/char-red-trophy.png",
      "red/char-red-kick-sprite.png",
      "blue/char-blue-idle.png",
      "blue/char-blue-scissors.png",
      "blue/char-blue-flag.png",
      "blue/char-blue-kick.png",
      "blue/char-blue-pointing.png",
      "blue/char-blue-front.png",
      "blue/char-blue-head.png",
      "blue/char-blue-head-dark.png",
      "blue/char-blue-head-neutral.png",
      "yellow/char-yellow-idle.png",
      "yellow/char-yellow-fallen.png",
      "yellow/char-yellow-reading.png",
      "yellow/char-yellow-one-flag.png",
      "yellow/char-yellow-two-flags.png",
      "yellow/char-yellow-flags-spread.png",
      "yellow/char-yellow-flag-point.png",
      "weapons/weapon-rock.png",
      "weapons/weapon-scroll.png",
      "weapons/weapon-scroll-large.png",
      "weapons/weapon-scissors.png",
      "weapons/weapon-scissors-large.png",
      "sheets/referee-flags-matrix.png",
      "sheets/hero-red-jump-sprites.png",
    ];

    for (const file of kebabFiles) {
      expect(existsSync(resolve(charactersDir, file)), file).toBe(true);
    }
  });

  it("V4 exports typed character asset paths", () => {
    expect(ASSET_PATHS.red.idle).toBe("/src/assets/characters/red/char-red-idle.png");
    expect(ASSET_PATHS.blue.silhouette).toBe("/src/assets/characters/blue/char-blue-head-dark.png");
    expect(ASSET_PATHS.yellow.idle).toBe("/src/assets/characters/yellow/char-yellow-idle.png");
    expect(ASSET_PATHS.weapons.rock).toBe("/src/assets/characters/weapons/weapon-rock.png");
    expect(ASSET_PATHS.sheets.refereeFlagsMatrix).toBe("/src/assets/characters/sheets/referee-flags-matrix.png");
  });
});
