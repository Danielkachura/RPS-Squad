# Sprint 02 — Visuals & Motion
## 🎯 Sprint Goal
Wire every game sprite into a living, frame-accurate animation system — idle breathing, weapon reveals, duel attacks, death, and phase transitions — using the Animation Timing Strip agent to drive all character poses from the existing `main_menu_asset.png/` library.

---

## Asset Inventory (confirmed in repo)

### Red Team sprites
| File | Pose / Use |
|---|---|
| `character_red_idle_nobg.png` | Idle standing — board piece default |
| `character_red_rock_nobg.png` | Rock reveal / weapon hold (Phase 1 + Duel) |
| `character_red_paper_nobg.png` | Paper reveal / weapon hold |
| `character_red_scissors_nobg.png` | Scissors reveal / weapon hold |
| `character_red_kick_nobg.png` | Attack swing frame |
| `character_red_flag_nobg.png` | Flag-bearer revealed on death |
| `character_red_reading_scroll_nobg.png` | Paper "hide" pose (weapon behind back) |
| `character_red_trophy_nobg.png` | Win screen |
| `character_red_kick_sprite_nobg.png` | Single kick frame (duel hit) |

### Blue Team sprites
| File | Pose / Use |
|---|---|
| `character_blue_idle_nobg.png` | Idle standing — board piece default |
| `character_blue_scissors_nobg.png` | Scissors reveal (two-char composite) |
| `character_blue_flag_nobg.png` | Flag-bearer hold |
| `character_blue_kick_nobg.png` | Attack swing frame |
| `character_blue_pointing_nobg.png` | Selection / targeting indicator |
| `character_blue_front_nobg.png` | Facing-forward (Phase 2 hide) |
| `character_blue_head_nobg.png` | Head only (silhouette data) |
| `character_blue_head_dark_nobg.png` | Enemy hidden state (dark head) |
| `character_blue_head_neutral_nobg.png` | Neutral/thinking state |

### Yellow / Referee sprites
| File | Pose / Use |
|---|---|
| `character_yellow_idle_nobg.png` | Referee sidebar idle |
| `character_yellow_fallen_nobg.png` | Referee sad / game-over |
| `character_yellow_reading_nobg.png` | Referee phase-change |
| `character_yellow_one_flag_nobg.png` | Referee signals one-flag |
| `character_yellow_two_flags_nobg.png` | Referee signals both flags |
| `character_yellow_flags_spread_nobg.png` | Referee arms spread (reveal) |
| `character_yellow_flag_point_nobg.png` | Referee points (your turn) |
| `referee_flags_matrix.png.png` | **4×4 sprite sheet** — full referee animation loop |

### Sprite Sheets (multi-frame)
| File | Frames | Animation |
|---|---|---|
| `hero_red_jump_sprites.png.png` | 8 frames (4×2 grid) | Rock jump + land cycle |
| `referee_flags_matrix.png.png` | 16 frames (4×4 grid) | Referee wave → point → sad loop |

### Weapons (standalone)
| File | Use |
|---|---|
| `rock_nobg.png` | Rock icon overlay / duel center |
| `scroll_nobg.png` / `scroll_large_nobg.png` | Paper / scroll weapon |
| `scissors_nobg.png` / `scissors_large_nobg.png` | Scissors weapon |

---

## Animation Timing Strip Agent — Spec

The **Animation Timing Strip Agent** (`animationTimingAgent.ts`) is the single source of truth for all character animation. It owns:

1. **Strip definitions** — for each animation name, which frames to use, at what `ms` each frame fires
2. **Playback engine** — requestAnimationFrame loop, frame cursor, loop / one-shot modes
3. **Sprite rendering** — computes `background-position` or `<img src>` swap depending on asset type (sheet vs individual files)

### Strip Format
```ts
interface TimingStrip {
  name: string;            // e.g. "red_idle", "blue_attack", "ref_wave"
  mode: 'loop' | 'once';  // loop = repeating, once = plays through then holds last frame
  frames: StripFrame[];
}

interface StripFrame {
  durationMs: number;      // how long to hold this frame
  asset: SpriteAsset;      // pointer to file or sheet region
}

interface SpriteAsset {
  type: 'file' | 'sheet';
  src: string;             // path relative to /assets/characters/
  // only for type='sheet':
  sheetCols?: number;
  sheetRows?: number;
  frameIndex?: number;     // 0-based, row-major order
}
```

### All Defined Strips

#### Red Team
| Strip name | Frames | Mode | Total duration |
|---|---|---|---|
| `red_idle` | idle(800ms) → idle(800ms) slight bob via CSS translateY | loop | 1600ms |
| `red_weapon_reveal` | idle(0ms) → rock/paper/scissors(300ms) → hold | once | 300ms |
| `red_weapon_hide` | weapon-pose(0ms) → idle(400ms) | once | 400ms |
| `red_attack` | idle(0ms) → kick(150ms) → idle(300ms) | once | 450ms |
| `red_hit` | idle(0ms) → kick-recoil(100ms) → idle(200ms) | once | 300ms |
| `red_death` | idle → shrink+fade CSS (300ms) | once | 300ms |
| `red_win` | trophy pose hold | once | hold |

#### Blue Team (mirror: facing right → CSS scaleX(-1))
| Strip name | Frames | Mode | Total duration |
|---|---|---|---|
| `blue_idle` | idle(800ms) loop bob | loop | 1600ms |
| `blue_weapon_reveal` | idle → scissors/etc (300ms) | once | 300ms |
| `blue_weapon_hide` | weapon → front-facing(400ms) | once | 400ms |
| `blue_attack` | idle → kick(150ms) → idle(300ms) | once | 450ms |
| `blue_death` | shrink+fade (300ms) | once | 300ms |
| `blue_silhouette` | head_dark static | loop | static |
| `blue_selected` | pointing(0ms) → idle loop | loop | — |

#### Yellow / Referee (sidebar)
| Strip name | Sheet region | Mode | Total duration |
|---|---|---|---|
| `ref_wave` | matrix rows 0–1, cols 0–3 → 0–3 | loop | 8×250ms = 2000ms |
| `ref_point` | matrix row 2, cols 0–3 | once | 4×250ms = 1000ms |
| `ref_point_blue` | matrix row 2, col 3 | once | 250ms hold |
| `ref_point_red` | matrix row 2, col 2 | once | 250ms hold |
| `ref_sad` | matrix row 3, cols 0–3 | once | 4×250ms = 1000ms |

#### Jump / Rock Attack (sprite sheet `hero_red_jump_sprites.png.png`, 4×2 grid)
| Strip name | Frames | Mode | Total duration |
|---|---|---|---|
| `red_rock_jump` | frames 0→1→2→3 (row 0) | once | 4×120ms = 480ms |
| `red_rock_land` | frames 4→5→6→7 (row 1) | once | 4×120ms = 480ms |
| `red_rock_full` | frames 0→7 | once | 960ms total |

---

## Dev Tasks

### V1 — Asset Pipeline [S]
- [ ] **V1** Create `/frontend/app/src/assets/characters/` folder structure matching the asset table above
- [ ] **V2** Copy all `*_nobg.png` files from `main_menu_asset.png/` into the new folder (build script or manual)
- [ ] **V3** Rename files to kebab-case convention: `char-red-idle.png`, `char-blue-idle.png`, etc.
- [ ] **V4** Export `ASSET_PATHS` constant in `src/assets/characters/index.ts` — typed record of all paths

### V5 — Animation Timing Strip Agent [M]
- [ ] **V5** Create `src/animation/timingAgent.ts` — exports `TimingStrip`, `StripFrame`, `SpriteAsset` types
- [ ] **V6** Implement `AnimationTimingAgent` class:
  - `register(strip: TimingStrip): void` — registers a named strip
  - `play(name: string, el: HTMLElement, onEnd?: () => void): void` — starts playback on a DOM element
  - `stop(el: HTMLElement): void` — cancels loop/playback on element
  - Uses `requestAnimationFrame` with wall-clock delta accumulation
  - Sheet frames: sets `style.backgroundImage` + `backgroundPosition` computed from `frameIndex`, `sheetCols`, `cellW`, `cellH`
  - File frames: sets `img.src` directly
- [ ] **V7** Define all strips from the table above in `src/animation/strips/` — one file per character team:
  - `strips/red.ts` — all `red_*` strips
  - `strips/blue.ts` — all `blue_*` strips
  - `strips/referee.ts` — all `ref_*` strips (including sheet math)
- [ ] **V8** Create `useAnimation(ref, stripName)` React hook — wraps agent `play`/`stop`, cleans up on unmount
- [ ] **V9** Create `<AnimatedSprite name={stripName} className? style? />` component — renders `<img>` or `<div>` depending on asset type, calls `useAnimation` internally

### V10 — Board Character Integration [M]
- [ ] **V10** `BoardCell` component: swap static sprite `<img>` → `<AnimatedSprite name="red_idle" />` for player units
- [ ] **V11** CPU hidden state: render `<AnimatedSprite name="blue_silhouette" />` (dark head sprite)
- [ ] **V12** Selection state: when a cell is selected, switch to `"blue_selected"` (pointing pose) or CSS glow ring
- [ ] **V13** Valid-attack-target state: yellow border pulse via CSS `@keyframes` on cell, no sprite change needed

### V14 — Phase 1: Weapon Reveal Animation [M]
- [ ] **V14** Phase 1 start: all characters switch from `*_idle` → `*_weapon_reveal` strip (300ms)
- [ ] **V15** Phase 1 countdown: characters hold weapon-pose frames for 10s while timer ticks
- [ ] **V16** T=0 transition: play `*_weapon_hide` strip (400ms), then switch to `*_idle` loop
- [ ] **V17** Weapon icon overlay: small weapon badge in bottom-right corner of sprite during Phase 1 (own side only in Phase 2+)

### V18 — Duel Animation [L]
- [ ] **V18** Duel trigger: attacker plays `*_attack` strip (450ms), target plays `*_hit` strip (300ms)
- [ ] **V19** Weapon reveal moment: during duel, both characters switch to their weapon pose frame for 800ms
- [ ] **V20** Win flash: winner gets green CSS glow (`box-shadow: 0 0 12px #44bb44`) for 600ms
- [ ] **V21** Loser death: loser plays `*_death` strip (shrink + opacity 0, 300ms), then `display:none`
- [ ] **V22** Decoy absorb: loser dies, Decoy stays — play Decoy `*_idle` resume after duel
- [ ] **V23** Rock special: if weapon = Rock, play `red_rock_full` jump sequence (960ms) instead of standard attack

### V24 — Referee Sidebar [S]
- [ ] **V24** Referee renders in sidebar using `<AnimatedSprite name="ref_wave" />` during idle / player's turn thinking
- [ ] **V25** Player moves → play `ref_point` once (points toward board)
- [ ] **V26** Game over → play `ref_sad` once, then hold sad pose
- [ ] **V27** Phase 1 reveal → play `ref_wave` looping (arms spread wide)

### V28 — Phase Transitions [M]
- [ ] **V28** Phase 1→2 transition: weapon-hide animation plays for all 28 characters simultaneously (staggered 20ms per column so it ripples left→right)
- [ ] **V29** Phase 2→3 (battle start): characters do one-time `*_idle` bob, referee points, "YOUR TURN" text fades in
- [ ] **V30** Turn indicator: current player's team gets subtle pulsing CSS ring on all alive units

### V31 — Death & Win States [S]
- [ ] **V31** On flag-bearer death: play `*_death` on flag-bearer, then trigger full game-over overlay
- [ ] **V32** Trophy pose: winning player's characters all switch to `red_win` (trophy pose) on game over screen
- [ ] **V33** End-of-game reveal: CPU hidden weapons fade in (1s stagger) after match ends

### V34 — Polish [S]
- [ ] **V34** Breathing idle: all idle characters get a CSS `translateY(0 → -3px → 0)` 1600ms loop (no JS needed)
- [ ] **V35** Hover scale: board cells scale `1.0 → 1.12` on hover (CSS transition 100ms)
- [ ] **V36** Duel overlay entrance: slide in from top (300ms ease-out)
- [ ] **V37** Performance check: confirm no dropped frames with all 28 animated sprites on board (Chrome DevTools → Performance tab, ≥ 55fps target)

---

## Architecture Notes

### Sprite size standardization
All individual `*_nobg.png` sprites are rendered at `--unit-size: 70px` inside an `82px` cell.
Use `object-fit: contain` + `object-position: bottom center` so the character's feet always sit at the cell floor and the head is never cropped.

### Sheet math for `referee_flags_matrix.png`
The sheet is **4 columns × 4 rows = 16 frames**. Each cell is `(sheetWidth / 4) × (sheetHeight / 4)`.
Background position formula:
```
x = -(frameIndex % 4) * cellW
y = -Math.floor(frameIndex / 4) * cellH
```

### Sheet math for `hero_red_jump_sprites.png` (8 frames, 4×2)
```
cellW = sheetWidth / 4
cellH = sheetHeight / 2
x = -(frameIndex % 4) * cellW
y = -Math.floor(frameIndex / 4) * cellH
```

### No `any` — strict typing
All strip definitions must be `as const` arrays so TypeScript infers frame counts. Agent `play()` must accept `stripName: keyof typeof STRIP_REGISTRY` not `string`.

### Performance contract
- **Agent runs one `rAF` loop per element** — never one loop per strip.
- Dead elements must call `agent.stop()` on unmount.
- Sheet-mode sprites use CSS `background-position` only — never swap `src` for sheet frames (avoids image reloads).

---

## Complexity Key
`[S]` = Small (< 2 hrs) | `[M]` = Medium (2–4 hrs) | `[L]` = Large (4–8 hrs) | `[XL]` = Extra Large (8+ hrs)

---

## Sprint 02 Release Blockers

- [ ] V5–V9 (AnimationTimingAgent + hook + component) reviewed and passing
- [ ] V10–V13 (board integration) — no static `<img>` left for characters
- [ ] V14–V17 (Phase 1 weapon reveal) works end-to-end
- [ ] V18–V22 (duel animation) works with real game state
- [ ] V24–V27 (referee) animates correctly in sidebar
- [ ] V37 performance check passes (≥55fps)
- [ ] Zero TypeScript errors (`tsc --noEmit`)
- [ ] All Vitest unit tests for `AnimationTimingAgent` pass
- [ ] CTO GBU review signed off
