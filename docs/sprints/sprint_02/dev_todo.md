# Sprint 02 — dev_todo.md
## Fix All Problems

**Sprint Goal:** Close every bug, broken link, type error, and gameplay gap found in the
real Sprint-01 codebase — leaving a fully playable, test-covered, zero-error game.

---

## 🔴 UGLY — Must fix before any new work

### U1 — CPU sprite map is broken [S]
**File:** `UnitSprite.tsx` → `CPU_IMG`
```ts
// CURRENT (broken)
rock:     "/character_blue_idle_nobg.png",   // shows idle, not rock
paper:    "/character_blue_idle_nobg.png",   // shows idle, not paper
scissors: "/logo_rps_online_nobg.png",       // shows logo — completely wrong
```
**Fix:** add the real per-weapon blue sprites:
- rock → `/character_blue_idle_nobg.png` (no blue rock sprite exists → keep idle as fallback, but document it)
- paper → `/character_blue_idle_nobg.png` (same)
- scissors → `/character_blue_scissors_nobg.png`  ← at minimum fix scissors

---

### U2 — Player scissors sprite is the game logo [S]
**File:** `UnitSprite.tsx` → `PLAYER_IMG`
```ts
scissors: "/logo_rps_online_nobg.png",   // WRONG — shows the logo
```
**Fix:** use the correct asset:
```ts
scissors: "/character_red_scissors_nobg.png",
```
Verify file exists in `main_menu_asset.png/` ✅ (confirmed: `character_red_scissors_nobg.png`)

---

### U3 — `visible_piece()` leaks weapon during reveal for AI pieces [M]
**File:** `backend/python_api/app.py` → `visible_piece()`
```python
show_weapon = phase == "reveal" or is_owner or reveal_all
```
During Phase 1 (`reveal`), **all** weapons are shown to both sides — correct per PRD.
But after `reveal_complete`, `phase` flips to `player_turn` and this condition becomes
`is_owner or reveal_all`, which is correct. **However**, in `build_player_view()` the
board is filtered for viewer `"player"` only — meaning AI pieces during reveal show
their weapon to the player view (intentional) — **and the silhouette flag is `False`
when weapon is shown**. After reveal ends, the AI weapons are correctly hidden again.

Actual bug: `silhouette` is computed as `not show_weapon and piece["alive"]`. During
reveal `show_weapon = True` so `silhouette = False` — correct for Phase 1.
After reveal, for AI pieces: `show_weapon = False`, so `silhouette = True` — correct.

**No actual security leak here**, but `weapon` is sent as `null` for hidden AI pieces,
which is correct. ✅ Mark as audited. No code change needed.

---

### U4 — `visible_piece()` sends AI `role` too early [M]
**File:** `backend/python_api/app.py` → `visible_piece()`
```python
show_role = (
    (is_owner and phase != "reveal")
    or (is_owner and phase == "reveal" and piece["role"] == "flag")
    or (reveal_all and piece["role"] != "soldier")
)
```
For `owner = "ai"`, `is_owner = False`, so `show_role = False` unless `reveal_all`.
AI role is only sent as non-null on game over. ✅ Correct — no bug.

---

### U5 — `RefereePanel` spritesheet URL missing `.png` extension [S]
**File:** `styles.css`
```css
background-image: url('/referee_flags_matrix.png');
```
**File:** `main_menu_asset.png/` directory → the file is named `referee_flags_matrix.png.png`
(double extension, confirmed from filesystem listing).

**Fix two things:**
1. Rename asset file to `referee_flags_matrix.png` (remove the extra `.png`), OR
2. Update the CSS to `url('/referee_flags_matrix.png.png')` — whichever is canonical.

Decision: **Rename the file to `referee_flags_matrix.png`** (cleaner). Update CSS and
any other reference. Same issue exists for `hero_red_jump_sprites.png.png`.

---

### U6 — Hero jump sprite unused / wrong path in CSS [S]
**File:** `styles.css`
```css
.hero-jump-sprite {
  background-size: 400% 100%;   /* assumes 4-frame horizontal strip */
}
```
The actual sheet `hero_red_jump_sprites.png.png` is a **4×2 grid** (8 frames, two rows).
The CSS math is wrong. Also `heroJumpFrames` only animates row 0 (first row) in a 4-col
strip — it never addresses the landing frames in row 1.

**Fix:** The `.hero-jump-sprite` class is referenced nowhere in TSX — it's dead CSS.
Remove the `heroJumpFrames` + `.hero-jump-sprite` block entirely until the jump
animation is fully implemented in Sprint 03.

---

### U7 — `DUEL_TURN_BUFFER_SECONDS` silently changes turn timer [S]
**File:** `backend/python_api/app.py`
```python
DUEL_TURN_BUFFER_SECONDS = 2
# ...
set_turn_deadline(match_state, TURN_DURATION_SECONDS + DUEL_TURN_BUFFER_SECONDS)
```
After any resolved duel, the turn deadline becomes **12 seconds** not 10. The frontend
displays `Math.min(turnSecondsLeft, TURN_DURATION_SECONDS)` which caps at 10, hiding
the buffer from the player. This is intentional (gives a grace period), but:
- It's undocumented in PRD / DECISIONS.md.
- The frontend cap `Math.min(turnSecondsLeft, TURN_DURATION_SECONDS)` silently discards
  the extra 2 seconds — the player sees "10s" but actually has 12.

**Fix:**
1. Add an entry to `DECISIONS.md`: "Post-duel turn buffer: 2s padding added server-side after every duel resolution, hidden from player UI by the frontend cap."
2. No code change needed — behavior is acceptable, just needs documentation.

---

### U8 — Stalemate rule (last-standing Decoy) not implemented [M]
**PRD section 3:** "Stalemate (only enemy Decoy remains) → Decoy becomes killable."
**DECISIONS.md:** "Stalemate rule: when only Decoy remains on one side, it becomes killable to prevent deadlock."

**Code check:** `apply_duel_outcome()` checks `defender["role"] == "decoy"` and marks
`decoyAbsorbed = True` unconditionally — the Decoy **always** absorbs, even when it
is the last piece. This means the game can never end via stalemate.

**Fix:** In `apply_duel_outcome()`, before setting `decoyAbsorbed = True`, check:
```python
alive_opponents = [p for p in match_state["pieces"]
                   if p["owner"] == defender["owner"] and p["alive"]]
last_piece_standing = len(alive_opponents) == 1
if defender["role"] == "decoy" and not last_piece_standing:
    # normal decoy absorb
    duel["decoyAbsorbed"] = True
    ...
else:
    # last decoy is killable — resolve as normal attacker-wins
    defender["alive"] = False
    ...
```

---

### U9 — Tie cap (5 ties → forced random) not implemented [M]
**DECISIONS.md:** "Tie cap: 5 consecutive ties → forced random resolution to prevent infinite loops."

**Code check:** `resolve_attack()` calls itself recursively via `tie_repick` endpoint.
There is no counter for consecutive ties in `pending_repick` or match state.

**Fix:**
1. Add `"tie_count": 0` inside `pending_repick` when first tie is detected.
2. In `tie_repick` endpoint: before calling `resolve_attack()`, if
   `pending["tie_count"] >= 4` (i.e., 5th tie), force a random winner instead of
   calling `resolve_attack()` again.
3. Add `tie_count` to `TieRepickRequest` if needed, or track server-side only.

---

## ⚠️ BAD — Must fix this sprint

### B1 — `buildInitialPieces.test.ts` imports path is fragile [S]
**File:** `frontend/app/src/buildInitialPieces.test.ts`
```ts
import { buildInitialPieces } from "../../modules/shared/src/utils/buildInitialPieces";
```
Uses a relative `../../` path instead of the `@shared/utils` alias. Breaks if the test
file moves.

**Fix:** Add `utils` to the `@shared` barrel export (`modules/shared/src/index.ts`):
```ts
export { buildInitialPieces } from "./utils/buildInitialPieces";
```
Then update the import:
```ts
import { buildInitialPieces } from "@shared/utils/buildInitialPieces";
```

---

### B2 — `Sidebar.test.tsx` and `App.test.tsx` — no assertions [S]
**File:** `frontend/app/src/App.test.tsx`
```ts
it("renders without crashing", () => {
  render(<App />);
  expect(document.body).toBeDefined();   // always true — tests nothing
});
```
**Fix:** Replace with meaningful assertions:
```ts
it("renders StartScreen when phase is setup", () => {
  render(<App />);
  expect(screen.getByText(/SQUAD RPS/i)).toBeInTheDocument();
});
```
Also add: renders START button, clicking START calls fetch, loading state shows "PREPARING...".

---

### B3 — `visible_piece()` sends `weapon` for dead pieces [S]
**File:** `backend/python_api/app.py`
```python
"weapon": piece["weapon"] if show_weapon and piece["alive"] else None,
```
`piece["alive"]` guard is present ✅. But `silhouette` is also gated on `alive`:
```python
"silhouette": not show_weapon and piece["alive"],
```
Dead pieces get `silhouette: False`, `weapon: null`, `alive: False` — which is correct.
However, dead pieces still appear in the board array. The frontend filters them:
```ts
(match?.board ?? []).filter(p => p.alive).forEach(...)
```
✅ Correct. But the backend still sends all 28 pieces including dead ones — consider
filtering dead pieces from the board response for payload efficiency. **Not a bug but
worth a task.**

---

### B4 — No backend test for stalemate [S]
`test_app.py` has no test for the Decoy stalemate rule (last-piece Decoy becomes killable).
Once U8 is fixed, add:
```python
def test_last_decoy_is_killable():
    ...
```

---

### B5 — No backend test for tie cap [S]
Once U9 is fixed, add:
```python
def test_five_consecutive_ties_force_resolution():
    ...
```

---

### B6 — `audioManager.ts` extensions are wrong [S]
**File:** `frontend/modules/game/src/utils/audioManager.ts`
```ts
const SFX_PATHS: Record<SfxKey, string> = {
  shuffle:      "/audio/shuffle.wav.mp4",   // .wav.mp4 — double extension
  ...
  battle_start: "/audio/battle_start.wav.m4a",  // inconsistent: .m4a not .mp4
};
```
**Fix:** Verify actual file extensions in `/assets/audio/` and align all paths.
Until audio files are confirmed, wrap all `el.play()` calls in try/catch (already done ✅)
and add `console.warn` so missing audio is visible in dev.

---

### B7 — `FallingLeavesBackground` has no test [S]
The component exists in the component directory but has zero test coverage. It renders
purely decorative leaves. Add a smoke test that it renders without throwing.

---

### B8 — `useGame.ts`: `completeReveal` is called on every render during reveal [M]
**File:** `frontend/modules/game/src/hooks/useGame.ts`
```ts
useEffect(() => {
  if (!match || match.phase !== "reveal") return;
  if (Date.now() / 1000 < match.revealEndsAt) return;
  void completeReveal();
}, [match, revealSecondsLeft]);   // ← fires every 250ms tick
```
`revealSecondsLeft` ticks every 250ms. When `revealEndsAt` has passed, `completeReveal`
is called **every 250ms** until the match state updates. The guard `match.phase !== "reveal"`
stops it after the first success, but if the first call is in-flight, a second one fires.

**Fix:** Add a `revealInFlightRef` (same pattern as `aiInFlightRef`):
```ts
const revealInFlightRef = useRef(false);

useEffect(() => {
  if (!match || match.phase !== "reveal") return;
  if (Date.now() / 1000 < match.revealEndsAt) return;
  if (revealInFlightRef.current) return;
  revealInFlightRef.current = true;
  void completeReveal().finally(() => { revealInFlightRef.current = false; });
}, [match, revealSecondsLeft]);
```

---

### B9 — `onCellClick` silently drops valid moves during duel [S]
**File:** `useGame.ts`
```ts
function onCellClick(row: number, col: number) {
  if (!match || showDuel || match.phase !== "player_turn" || !selectedPieceId) return;
  ...
}
```
During `showDuel = true`, the duel overlay covers the board and clicks reach the board
underneath via `pointer-events: auto`. If the player clicks behind the overlay during a
duel, the `onCellClick` guard fires `return` — correct behavior. But the `DuelOverlay`
itself does not set `pointer-events: none` on the board layer.

**Fix:** In `GameScreen.tsx`, wrap `GameBoard` in a div that sets `pointer-events: none`
when `showDuel` is true:
```tsx
<div style={{ pointerEvents: showDuel ? "none" : "auto" }}>
  <GameBoard ... />
</div>
```

---

### B10 — `PlayerMoveRequest` uses camelCase alias but frontend sends camelCase JSON [S]
**File:** `backend/python_api/schemas.py`
```python
class PlayerMoveRequest(BaseModel):
    piece_id: str = Field(alias="pieceId")
    target_row: int = Field(alias="targetRow")
    target_col: int = Field(alias="targetCol")
```
Pydantic V2 requires `model_config = ConfigDict(populate_by_name=True)` for aliases
to work bidirectionally. Without it, sending `{"pieceId": "..."}` may fail validation
in some Pydantic V2 versions.

**Fix:** Verify Pydantic version in `requirements.txt`, then add to affected models:
```python
from pydantic import BaseModel, Field, ConfigDict

class PlayerMoveRequest(BaseModel):
    model_config = ConfigDict(populate_by_name=True)
    piece_id: str = Field(alias="pieceId")
    target_row: int = Field(alias="targetRow")
    target_col: int = Field(alias="targetCol")
```
Do the same for `PlayerFlagRequest`.

---

## ✅ GOOD — Complete these new features

### G1 — Add `DECISIONS.md` entries for undocumented behavior [S]
Add entries for:
- Post-duel 2s turn buffer (U7)
- Tie cap implementation (after U9)
- Stalemate implementation (after U8)

---

### G2 — Backend: filter dead pieces from board response [S]
In `build_player_view()`, only include `alive` pieces in the board array sent to the
client. Dead pieces serve no purpose in the client view after death animation completes.
```python
board = [
    visible_piece(p, "player", match_state["phase"], finished)
    for p in match_state["pieces"]
    if p["alive"] or finished   # reveal all dead on game over
]
```

---

### G3 — `Sidebar.tsx`: Shuffle button shows during wrong phase [S]
**File:** `Sidebar.tsx`
```tsx
{phase === "reveal" && !hasPlayerFlag && (
  <button onClick={() => void onShufflePositions()}>ערבב חיילים</button>
)}
```
Shuffle is disabled once a flag is chosen (correct). But the button is still shown
during the grace period between `revealEndsAt` passing and `completeReveal` completing.
Add a `revealSecondsLeft > 0` guard — pass `revealSecondsLeft` as a prop to `Sidebar`:
```tsx
{phase === "reveal" && !hasPlayerFlag && revealSecondsLeft > 0 && (
  <button>ערבב חיילים</button>
)}
```

---

### G4 — `GameOverScreen.tsx`: show duration and decoy stats [S]
Stats grid currently shows: Total Duels, Duels Won, Duels Lost, Win Rate.
PRD requires: duration, decoyAbsorbs, ties. Add them to the grid (6 cells, 3-col layout).

---

### G5 — Backend: `choose_ai_move()` ignores Decoy stalemate on AI side [M]
After U8 is fixed, update `choose_ai_move()` so when the AI's only remaining piece is
its own Decoy and the player has living non-Decoy pieces, the AI cannot "attack" and
win — it should fall through to `plain_moves` only. This is an edge case but must be
consistent with the stalemate rule.

---

### G6 — Add E2E smoke test (Playwright) [M]
**File:** `tests/` (root level, `playwright.config.ts` already exists)

Minimum E2E: start the dev server + backend, click START, verify the board renders with
28 pieces, verify the reveal timer appears. This is the minimum CI gate.

---

### G7 — `vite.config.ts` — verify `@shared` and `@game` path aliases [S]
**File:** `frontend/app/vite.config.ts` (currently `.js` and `.ts` both exist — dual config)

The presence of both `vite.config.js` and `vite.config.ts` is ambiguous. Vite will use
one and ignore the other (alphabetical, `.js` wins in some versions).

**Fix:**
1. Delete `vite.config.js` (keep `.ts`).
2. Confirm `tsconfig.app.json` `paths` match the `vite.config.ts` `resolve.alias` map.

---

### G8 — `package.json` — confirm test script runs all test files [S]
**File:** `frontend/app/package.json`
Verify `"test"` script includes `--run` for CI and that coverage threshold ≥80% is
configured in `vitest.config` or `vite.config.ts`. Add if missing:
```json
"test:coverage": "vitest run --coverage"
```
And in `vite.config.ts`:
```ts
test: {
  coverage: {
    thresholds: { lines: 80, branches: 80 }
  }
}
```

---

## Task Order (dependency-sorted)

```
Phase A — Critical bugs (block gameplay):
  U1 → U2                    (sprite fixes, 30 min)
  U5                         (rename asset files, 10 min)
  U8 + B4                    (stalemate impl + test, 1 hr)
  U9 + B5                    (tie cap impl + test, 1 hr)
  B10                        (Pydantic alias fix, 20 min)
  B8                         (reveal in-flight guard, 20 min)

Phase B — Test quality:
  B1                         (fix fragile import, 10 min)
  B2                         (meaningful App.test assertions, 30 min)
  B7                         (FallingLeaves smoke test, 15 min)

Phase C — UX improvements:
  B9                         (board pointer-events during duel, 15 min)
  G3                         (shuffle button timer guard, 10 min)
  G4                         (game-over stats, 20 min)
  B6                         (audio path audit, 20 min)

Phase D — Architecture:
  U6                         (remove dead CSS, 10 min)
  U7 + G1                    (document decisions, 20 min)
  G2                         (filter dead pieces, 20 min)
  G5                         (AI Decoy stalemate edge, 30 min)
  G7                         (vite config dedup, 15 min)
  G8                         (coverage threshold, 15 min)

Phase E — E2E:
  G6                         (Playwright smoke test, 1 hr)
```

---

## Complexity Key
`[S]` = Small < 1 hr | `[M]` = Medium 1–3 hrs | `[L]` = Large 3–6 hrs

---

## Sprint 02 Release Blockers

- [ ] U1 + U2 — correct sprites for all weapons on both teams
- [ ] U5 — referee spritesheet loads (filename fixed)
- [ ] U8 — stalemate rule implemented and tested
- [ ] U9 — tie cap implemented and tested
- [ ] B8 — reveal double-fire guard in place
- [ ] B10 — Pydantic aliases validated
- [ ] B2 — App test has real assertions
- [ ] G6 — Playwright smoke test passes
- [ ] Zero `tsc --noEmit` errors
- [ ] Backend `pytest` green (all existing + new tests)
- [ ] Frontend `vitest run` green
- [ ] CTO GBU review signed off
