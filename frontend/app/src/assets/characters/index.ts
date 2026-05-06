const CHARACTER_ROOT = "/src/assets/characters";

export const ASSET_PATHS = {
  red: {
    idle:          `${CHARACTER_ROOT}/red/char-red-idle.png`,
    rock:          `${CHARACTER_ROOT}/red/char-red-rock.png`,
    paper:         `${CHARACTER_ROOT}/red/char-red-paper.png`,
    scissors:      `${CHARACTER_ROOT}/red/char-red-scissors.png`,
    kick:          `${CHARACTER_ROOT}/red/char-red-kick.png`,
    flag:          `${CHARACTER_ROOT}/red/char-red-flag.png`,
    readingScroll: `${CHARACTER_ROOT}/red/char-red-reading-scroll.png`,
    trophy:        `${CHARACTER_ROOT}/red/char-red-trophy.png`,
    kickSprite:    `${CHARACTER_ROOT}/red/char-red-kick-sprite.png`,
  },
  blue: {
    idle:        `${CHARACTER_ROOT}/blue/char-blue-idle.png`,
    scissors:    `${CHARACTER_ROOT}/blue/char-blue-scissors.png`,
    flag:        `${CHARACTER_ROOT}/blue/char-blue-flag.png`,
    kick:        `${CHARACTER_ROOT}/blue/char-blue-kick.png`,
    pointing:    `${CHARACTER_ROOT}/blue/char-blue-pointing.png`,
    front:       `${CHARACTER_ROOT}/blue/char-blue-front.png`,
    head:        `${CHARACTER_ROOT}/blue/char-blue-head.png`,
    silhouette:  `${CHARACTER_ROOT}/blue/char-blue-head-dark.png`,
    headNeutral: `${CHARACTER_ROOT}/blue/char-blue-head-neutral.png`,
  },
  yellow: {
    idle:        `${CHARACTER_ROOT}/yellow/char-yellow-idle.png`,
    fallen:      `${CHARACTER_ROOT}/yellow/char-yellow-fallen.png`,
    reading:     `${CHARACTER_ROOT}/yellow/char-yellow-reading.png`,
    oneFlag:     `${CHARACTER_ROOT}/yellow/char-yellow-one-flag.png`,
    twoFlags:    `${CHARACTER_ROOT}/yellow/char-yellow-two-flags.png`,
    flagsSpread: `${CHARACTER_ROOT}/yellow/char-yellow-flags-spread.png`,
    flagPoint:   `${CHARACTER_ROOT}/yellow/char-yellow-flag-point.png`,
  },
  weapons: {
    rock:          `${CHARACTER_ROOT}/weapons/weapon-rock.png`,
    scroll:        `${CHARACTER_ROOT}/weapons/weapon-scroll.png`,
    scrollLarge:   `${CHARACTER_ROOT}/weapons/weapon-scroll-large.png`,
    scissors:      `${CHARACTER_ROOT}/weapons/weapon-scissors.png`,
    scissorsLarge: `${CHARACTER_ROOT}/weapons/weapon-scissors-large.png`,
  },
  sheets: {
    refereeFlagsMatrix: `${CHARACTER_ROOT}/sheets/referee-flags-matrix.png`,
    heroRedJumpSprites: `${CHARACTER_ROOT}/sheets/hero-red-jump-sprites.png`,
  },
} as const;

export type CharacterAssetPaths = typeof ASSET_PATHS;
