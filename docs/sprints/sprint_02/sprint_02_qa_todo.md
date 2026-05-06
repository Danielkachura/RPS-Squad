# Sprint 02 — QA TODO (Visuals & Motion)

## Unit Tests — AnimationTimingAgent (`animationTimingAgent.test.ts`)

| # | Test | Type | Pass Criteria |
|---|---|---|---|
| Q1 | `register()` stores strip by name | unit | `agent.getStrip("red_idle")` returns the strip |
| Q2 | `play()` on file-mode asset swaps `img.src` to frame 0 immediately | unit | `img.src` === `expectedPath` after first tick |
| Q3 | `play()` advances to next frame after `frames[0].durationMs` ms | unit | mock `rAF` + fake timer; assert src swaps |
| Q4 | Loop mode restarts at frame 0 after last frame | unit | after all frames elapsed, cursor resets to 0 |
| Q5 | Once mode holds last frame and calls `onEnd` callback | unit | `onEnd` called exactly once, src stays at last frame |
| Q6 | `stop()` cancels `rAF` and no further src changes occur | unit | call `stop()` mid-loop; assert src frozen |
| Q7 | Sheet mode sets `backgroundPosition` correctly for `frameIndex=5` in a 4-col sheet | unit | `x = -cellW * (5%4)`, `y = -cellH * floor(5/4)` |
| Q8 | `play()` with unknown strip name throws `UnknownStripError` | unit | expect throw with strip name in message |
| Q9 | Calling `play()` on an element already playing stops previous animation first | unit | previous `onEnd` is NOT called; new animation starts at frame 0 |
| Q10 | `useAnimation` hook cleans up on unmount (no rAF after unmount) | unit (RTL) | render → unmount → fake timer → assert no src change |

## Component Tests — `<AnimatedSprite />` (`animatedSprite.test.tsx`)

| # | Test | Pass Criteria |
|---|---|---|
| Q11 | Renders `<img>` for file-mode strips | DOM has `<img>` with correct initial `src` |
| Q12 | Renders `<div>` with `backgroundImage` for sheet-mode strips | DOM has `<div>` with `backgroundImage` CSS |
| Q13 | `className` prop forwarded to root element | element has expected class |
| Q14 | Re-render with different `name` prop cancels old animation and starts new | strip change triggers `stop` then `play` |
| Q15 | Unmount calls `agent.stop()` | spy on `agent.stop` — called once on unmount |

## Integration Tests — Board + Animation (`board.integration.test.tsx`)

| # | Test | Pass Criteria |
|---|---|---|
| Q16 | Player cells render `red_idle` strip on Phase 2 start | `<img>` src === `char-red-idle.png` (or first idle frame) |
| Q17 | CPU cells render `blue_silhouette` (dark head) on Phase 2 | `<div>` has `backgroundImage` pointing to `char-blue-head-dark.png` |
| Q18 | Selected player cell switches strip to `red_attack` pose on click | after click, src changes to kick frame |
| Q19 | Phase 1: all 28 cells show weapon-reveal strip after `PHASE_REVEAL` game state | weapon src present on all cells |
| Q20 | Phase 1→2 transition: after 10s timer, all cells flip to idle/hide strip | weapon src gone from all cells |

## Duel Animation Tests (`duel.animation.test.tsx`)

| # | Test | Pass Criteria |
|---|---|---|
| Q21 | Duel attacker plays `*_attack` strip during duel state | src = kick frame during duel |
| Q22 | Duel target plays `*_hit` strip during duel state | hit strip starts on target element |
| Q23 | Winner element gets green glow class `glow-win` after resolution | winner element has `.glow-win` in classList |
| Q24 | Loser element gets death strip then disappears | loser has `opacity: 0` and `display: none` after 300ms |
| Q25 | Decoy absorb: Decoy element stays alive and resumes `*_idle` | Decoy element visible, src = idle frame after duel |
| Q26 | Rock weapon triggers jump strip (`red_rock_full`) not standard attack | when weapon = Rock, strip name = `red_rock_full` |

## Referee Sidebar Tests (`referee.animation.test.tsx`)

| # | Test | Pass Criteria |
|---|---|---|
| Q27 | Referee renders `ref_wave` on idle state | sheet `backgroundPosition` = frame 0 of wave |
| Q28 | Referee plays `ref_point` when player makes a move | `ref_point` strip triggered after move event |
| Q29 | Referee plays `ref_sad` on game over | `ref_sad` strip triggered; `onEnd` not re-triggering (once mode) |
| Q30 | Referee wave loops: frame 15→0 wraps correctly | after 16 frames elapsed, cursor = 0 |

## Visual Regression (Playwright, `animation.e2e.ts`)

| # | Scenario | Pass Criteria |
|---|---|---|
| Q31 | Phase 1 screenshot: all characters showing weapon icons | Playwright screenshot baseline matches — no missing sprites |
| Q32 | Phase 2 screenshot: player side shows weapons, CPU side shows silhouettes | Screenshot delta < 1% vs baseline |
| Q33 | Duel: attacker and target show correct attack/hit frames | Screenshot at duel tick T=150ms contains kick frame |
| Q34 | Death: loser cell is empty (opacity 0) at T=300ms after duel | Screenshot shows empty cell |
| Q35 | No sprite clipping: all characters fully visible within cell bounds (no head cutoff) | No pixel outside cell bounds has non-transparent character pixel — assert with canvas snapshot |
| Q36 | Performance: 28 animated sprites on board ≥ 55 FPS | Playwright `page.metrics()` → JS frame time < 18ms per frame sustained 5s |

## Accessibility (`a11y.test.tsx`)

| # | Test | Pass Criteria |
|---|---|---|
| Q37 | `<AnimatedSprite>` exposes `role="img"` + `aria-label` | element has `role="img"` and non-empty `aria-label` |
| Q38 | Weapon icon overlays have `aria-label` matching weapon name | overlay `aria-label` = "Rock" / "Paper" / "Scissors" |
| Q39 | Dead unit exposes `aria-hidden="true"` | dead cell has `aria-hidden` after death animation |

## Coverage Gate
- `animationTimingAgent.ts` — **≥ 90% line coverage** (critical path code)
- `AnimatedSprite.tsx` — **≥ 80%**
- `strips/*.ts` — **100% export coverage** (every strip name reachable)
