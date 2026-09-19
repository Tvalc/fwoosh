# You're It! — Fwoosh mechanics remake plan

This is the build plan for recreating **all Fwoosh mechanics** inside Makko with a child-friendly story:

- Kids and robot friends play tag.
- Kids build the indoor and outdoor playground of their dreams.
- Funny teachers and robot staff deliver challenges and rewards.
- **Artbiter** and **Keith** remain important staff characters.

The game behavior comes from Fwoosh. The names, pictures, sounds, dialogue, and story are replaced.

This plan is written as a literal checklist. Finish one box before moving to the next box.

## Rules that cannot be broken

1. Use the public Fwoosh repository only for the first two preparation steps:
   - read the Fwoosh mechanics and asset requirements;
   - write the approved mechanic map and asset list.
2. Open Makko from the Dashboard with **New game** when we are ready to create the new project.
3. After the Makko project exists, all implementation happens in Makko:
   - **Code Studio** builds and changes the game;
   - **Art Studio** creates, edits, and organizes the art;
   - Code Studio's Asset Library adds approved Art Studio assets to the project.
4. Do not invent a Makko button. If a control is not visible, stop and inspect the current screen before describing it.
5. Do not create a second project, duplicate a Makko project, or use a branch as a substitute for a Makko project.
6. Do not use another art generator, stock art, or hand-drawn replacement. Every visual asset must be made in Makko Art Studio or be an approved Fwoosh reference used only to explain the required behavior.
7. Keep an asset provenance note for every art or audio item: Makko prompt, date, source asset if edited, and the Code Studio name used at runtime.
8. A milestone is not complete because the screen looks nice. It is complete only when its behavior works, its assets are present, its saves survive a reload, and its tests pass.

## What “the same mechanics” means

The following Fwoosh systems are all required in the remake. A theme change may rename a system, but it may not remove the behavior.

| Fwoosh behavior | You're It! theme name | Required behavior |
|---|---|---|
| Duy, the player | The player kid | A child moves continuously around a portrait map. |
| Burst/slingshot movement | Tag Dash | Drag or aim opposite the intended direction, release, and dash in the intended direction. |
| Three dash charges and recharge | Dash tokens | Charges are visible, spend one dash, and refill over time. |
| Heat | Tag Spark | Spark increases rescue/tag power, chain reach, and reward; carrying too much drains health. |
| Vent | Cool-down breath | Hold the Vent button/Space to spend Spark, heal, and create a predictable risk. |
| Burning villagers | Overexcited runners | An overexcited kid or robot spreads excitement to nearby friends unless tagged in time. |
| Rescue | Tag and return to play | Direct tags restore a runner and award score, build tokens, and teamwork. |
| Calm/cinder contact | Ready-to-play contact | A ready friend joins play on contact and gives one Spark. |
| Chain rescue | Tag chain | Enough Spark lets a tag jump to the next nearby runner. |
| Fire/demon enemies | Silly challenge bots | Bots interrupt cool-down, collide, knock the player away, and can be defeated. |
| Arson imps | Prank interceptors | Small prank bots try to cross a rescue/tag path and can be intercepted. |
| Husks/wraiths | Tired-out friends/glitch echoes | Failed runners become recoverable targets; recovery costs Spark and creates another risk. |
| Khet-Tak-Tor duel | Teacher challenge | A five-level challenge has readable attacks, counters, allies, and rewards. Final character names are a decision before story production. |
| Edge | Teamwork meter | Downing a challenge target, saving friends, and taking risks change the run’s advantage. |
| Embers | Playground build tokens | Run rewards are banked and spent on upgrades and construction. |
| Districts | Playground zones | Five zones unlock in order and have separate completion rewards. |
| Ratkin Quarter | Playground campus | A persistent 5×5 construction area uses roads, buildings, workers, production, storage, and offline progress. |
| Burrow/apartment | Clubhouse/quiet room | Housing assigns residents and changes happiness and work rate. |
| Mushroom farm | Snack garden | Produces food on a timed cycle. |
| Salvage yard | Maker yard | Consumes food and produces building materials on a timed cycle. |
| Storehouse | Supply shed | Increases shared storage. |
| Hearing and five blocs | Playground council | Five groups ask for improvements; four approvals release the next challenge, and five give the stronger reward. |
| Diary | Memory wall | Reading story entries is optional and gives no required gameplay currency. |
| Well/Forge/Shrine | Fountain/tool bench/friendship tree | Permanent upgrades and a persistent long-term reward path remain. |
| Local browser saves | Local playground save | Closing and reopening the game keeps progress. Invalid or partial saves are repaired safely. |

If a new story idea conflicts with one of these rows, keep the behavior and change the story wrapper.

## The two preparation steps before Makko

### Preparation 1 — Read and freeze Fwoosh mechanics

Read these Fwoosh sources and do not change them while building the remake:

- [Fwoosh README](https://github.com/Tvalc/fwoosh/blob/main/README.md)
- [Fwoosh constants](https://github.com/Tvalc/fwoosh/blob/main/js/constants.js)
- [Fwoosh input](https://github.com/Tvalc/fwoosh/blob/main/js/input.js)
- [Fwoosh city builder](https://github.com/Tvalc/fwoosh/blob/main/js/city.js)
- [Fwoosh meta progression](https://github.com/Tvalc/fwoosh/blob/main/js/meta.js)
- [Fwoosh story structure](https://github.com/Tvalc/fwoosh/blob/main/js/story.js)
- [Fwoosh combat roadmap](https://github.com/Tvalc/fwoosh/blob/main/docs/COMBAT_ROADMAP.md)
- [Fwoosh current roadmap](https://github.com/Tvalc/fwoosh/blob/main/docs/ROADMAP.md)
- [Fwoosh art rules](https://github.com/Tvalc/fwoosh/blob/main/ART.md)
- [Fwoosh asset integration rules](https://github.com/Tvalc/fwoosh/blob/main/docs/ART_INTEGRATION.md)
- [Fwoosh save rules](https://github.com/Tvalc/fwoosh/blob/main/docs/SAVE_DATA.md)
- [Fwoosh viewport rules](https://github.com/Tvalc/fwoosh/blob/main/docs/FULL_MAP_VIEWPORT.md)

Write a one-page “mechanic freeze” with these facts:

- portrait logical world: 720×1280;
- full map visible during play;
- automatic running plus manual steering;
- dash input and charge rules;
- Spark/health/vent rules;
- runner states, spread, direct tags, and tag chains;
- challenge bots, prank interceptors, tired-out friends, and recoveries;
- five-level teacher challenge;
- run rewards, down limits, banking, upgrades, five zones;
- playground construction, production, households, council, memories;
- local save behavior and audit requirements.

Do not start Makko work until this page exists.

### Preparation 2 — Approve the theme map and asset list

Create a second page with two columns: “Fwoosh behavior” and “You're It! presentation.” Every mechanic must have a row. Use the mapping table above as the first draft.

The only story decisions that must be filled in before story assets are generated are:

1. the player kid’s name and pronouns;
2. the exact names of the five playground zones;
3. the final name of the main teacher challenge character;
4. whether Artbiter is the art teacher, head teacher, or robot staff lead;
5. whether Keith is the hall monitor, maintenance robot, or reward clerk;
6. the five council group names;
7. the visual rule for “overexcited,” “cooling down,” and “glitch echo.”

Until these are chosen, use temporary labels such as `PLAYER_KID`, `ZONE_01`, `HEAD_TEACHER`, `ARTBITER`, and `KEITH`. Never silently make up final canon.

## Verified Makko entry workflow

Do this only after the two preparation pages are approved.

1. Open the Makko Dashboard.
2. Choose **New game**.
3. In the **Create New Game Project** dialog, enter the approved project name: **You’re It!**
4. Review the optional repository and privacy choices that are visibly shown in the dialog. Do not guess their state.
5. Create the project.
6. Open the resulting Code Studio project.
7. Open the project’s Art Studio collection or create the approved collection through the visible Dashboard collection workflow.
8. Keep Code Studio and Art Studio open in separate tabs so code and art can be checked together.
9. Do not begin with a giant prompt. Build one milestone at a time.

The project is not created yet. This plan stops before step 2 is executed.

## Milestone 0 — Project rules and test harness

### Build in Code Studio

Ask Code Studio to create only the project skeleton:

> Create a portrait 720×1280 game shell for “You’re It!”. Add a title screen, a play screen, a results screen, a playground hub screen, a city builder screen, and a settings/debug screen. Use placeholder rectangles and text only. Add a fixed-step update loop, a resize-safe full-map camera, a scene switcher, local save/load helpers, and a visible debug panel that shows scene, frame time, player position, health, Spark, dash charges, run score, build tokens, and save version. Do not create final art or story yet. Do not add screen shake.

### Assets needed

- temporary solid-color player marker;
- temporary solid-color runner marker;
- temporary solid-color bot marker;
- temporary zone background colors;
- temporary button labels.

### Pass test

- Play opens without an error.
- Resize does not stretch or crop the logical world.
- Scene changes work.
- Reloading the page shows a valid empty save.
- Debug values update once per frame.
- No final art has been invented yet.

## Milestone 1 — Makko art foundation

### Build in Art Studio

Create and name these assets before asking Code Studio to use them:

1. `player_kid_idle`
2. `player_kid_walk`
3. `player_kid_dash`
4. `player_kid_cooldown`
5. `player_kid_hit`
6. `player_kid_celebrate`
7. `robot_friend_idle`
8. `robot_friend_walk`
9. `runner_kid_calm`
10. `runner_kid_overexcited`
11. `runner_kid_cooling`
12. `runner_robot_calm`
13. `runner_robot_overexcited`
14. `runner_robot_cooling`
15. `challenge_bot_idle`
16. `challenge_bot_chase`
17. `challenge_bot_hit`
18. `prank_interceptor_fly`
19. `tired_friend_idle`
20. `glitch_echo_idle`
21. `artbiter_portrait`
22. `keith_portrait`
23. `head_teacher_portrait`

Every moving character needs a clear idle, movement, impact, and celebration read at small phone size. Use multiple child and robot families so the crowd does not look copied.

### Build in Code Studio

> Add Makko image, character manifest, and animation assets by their exact Asset Library names. Build a sprite manifest so each character has idle, walk, dash, hit, cooldown, and celebration states. Draw actors at the same readable scale in every scene. Add a missing-asset warning to the debug panel instead of silently drawing a blank image.

### Pass test

- Every listed asset appears in the Asset Library and in the project.
- A placeholder scene can display every character without a broken image.
- Animations loop at a readable speed.
- No character is hidden behind the HUD.

## Milestone 2 — Player movement and controls

### Build in Code Studio

> Implement the Fwoosh movement model for “You’re It!”. The player automatically runs around a bounded portrait map. Add continuous keyboard steering with WASD and arrow keys. Add desktop mouse slingshot aiming: drag opposite the desired dash direction and release to dash. Add Shift for dash and Space for cooldown breath. Add a floating touch joystick anywhere outside the Vent button, with deadzone, drag preview, and release-to-dash. A tap without drag must not spend a dash. Extra fingers must not create extra dashes. Resizing cancels an active gesture. Return to the player cancels an uncommitted dash. Keep the full map visible and draw a Makko flame-like directional preview using the approved tag-spark trail asset. Do not add a yellow dashed aim line or screen shake.

### Exact behavior to preserve

- automatic run resumes after a dash;
- dash has three charges at the starting capacity;
- charges refill over time;
- touch input ignores the Vent control area;
- multi-touch fingers are isolated;
- release commits one dash only;
- keyboard steering remains active while running;
- mouse and touch show the actual committed path;
- collision with a hazard interrupts the current action.

### Assets needed

- tag-spark directional trail, 5-frame minimum;
- dash start flash;
- dash end puff;
- player walk and dash animations;
- touch joystick ring and knob;
- three dash-token icons;
- pointer/cursor preview icon if Makko supports one.

### Pass test

Perform each test on desktop and touch:

1. Walk up, down, left, and right.
2. Drag left and release; confirm the player dashes right.
3. Tap without dragging; confirm no dash is spent.
4. Dash three times; confirm the fourth dash is blocked until recharge.
5. Hold two fingers; confirm only the owning finger controls the dash.
6. Hold Vent, resize the window, and confirm the gesture cancels cleanly.
7. Confirm the player never leaves the map or covers the bottom dock.

## Milestone 3 — Health, Spark, cooldown, and run accounting

### Build in Code Studio

> Add the complete player resource model. The player has hearts, a maximum of six Spark units, passive health regeneration, Spark-based health drain, dash charges, and a run score. Spark remains carried until spent. Display hearts, Spark, dash charges, score, current zone, and challenge state. Holding Cool-down Breath spends Spark in small timed units and heals in timed heart units. A Cool-down Breath can be interrupted by contact with a challenge bot. Record every change in the debug panel. Keep constants in one clearly named configuration object so they can be tuned without changing unrelated code.

### Starting tuning values

Use the current Fwoosh behavior as the first test balance, then tune only after the whole loop works:

- maximum Spark: 6;
- dash charges: 3;
- Spark health drain: 0.035 health per second per Spark unit;
- base health regeneration: 0.04 per second;
- cooldown purge interval: 0.40 seconds per Spark unit;
- cooldown heal interval: 0.60 seconds per full heart;
- minimum heart cap: 2;
- no health or Spark value may become negative or exceed its cap.

### Assets needed

- heart full, half, and empty icons;
- six Spark pip states;
- dash token full, empty, and recharge animation;
- breath/cooldown button in normal, pressed, disabled, and interrupted states;
- small numeric glyphs for score and rewards.

### Pass test

- Spark increases the player’s tag power and also creates a real risk.
- Holding Cool-down Breath visibly spends Spark and heals.
- Releasing the button stops the action.
- A hazard interrupts it.
- All values survive a scene change but not a new run unless the mechanic says they should.
- End-of-run accounting shows score, Spark spent, tags, challenge progress, build tokens earned, and teamwork gained.

## Milestone 4 — Runners, tag rescue, spread, and chains

### Build in Code Studio

> Implement the three-state runner system. A runner begins calm, can become overexcited, and can become a cooling/tired state. Overexcited runners spread their state to nearby runners using a timed check. The player can directly tag all three states. A direct tag gives the same full base reward regardless of state; state changes presentation and risk, not the reward rule. Calm or cooling runners that are contacted join the playground and give one Spark. Tag reward and chain reach increase with carried Spark. A tag chain continues only when the next target is within the calculated radius. A failed runner becomes a tired friend or glitch echo rather than disappearing. Add a clear visual state above each runner and never cover the face with the warning effect.

### Starting tuning values

- overexcited spread radius: 52;
- spread check interval: 0.90 seconds;
- spread chance: 0.58;
- overexcited fuse: 6.5 seconds;
- panic movement speed: 205;
- direct tag base reward: 120 score units;
- tag animation: 1.5 seconds;
- chain radius: 120 plus one additional radius unit per full Spark;
- chain tags award extra Teamwork but never create an unbounded loop.

### Assets needed

- at least 12 distinct runner families;
- calm, overexcited, cooling, tired, and recovered poses for each family;
- tag burst impact;
- chain-link or friendly spark arc;
- overexcited warning marks and a small timer;
- return-to-play celebration;
- tired friend recovery effect;
- no frightening flames, skulls, or death imagery.

### Pass test

1. Spawn one calm, one overexcited, and one cooling runner.
2. Let the overexcited runner spread; confirm the timer and nearby-only rule.
3. Tag each state directly; confirm equal base reward.
4. Carry more Spark and confirm the chain reaches farther.
5. Attempt a chain outside the radius; confirm it stops.
6. Let a runner fail; confirm it becomes recoverable.
7. Reload after the run; confirm settled rewards are banked once.

## Milestone 5 — Challenge bots, prank interceptors, and recovery risk

### Build in Code Studio

> Add the complete hazard family. Challenge bots emerge during or after Cool-down Breath, have a maximum active count, chase the player, collide for a heart and knockback, and respect hit cooldown and invulnerability frames. Bot contact interrupts breath and releases the current input. Prank interceptors periodically cross a runner path; intercepting one gives Teamwork and build tokens, while missing it increases pressure. Tired friends can crack into glitch echoes after a timer. Reconnecting a tired friend costs one Spark and can wake another hazard. Add a challenge-bot well with open, emerge, spawn, and respawn timing.

### Starting tuning values

- challenge-bot cap: 8;
- challenge-bot speed: 145;
- hit duration: 0.075 seconds;
- hit cooldown: 0.8 seconds;
- knockback speed: 520 for 0.14 seconds;
- player hurt invulnerability: 0.5 seconds;
- bot lifetime: 2.5 seconds when temporary;
- prank interceptor cadence: 2.25 seconds, scaling to 1.15;
- prank interceptor cap: 5;
- interceptor warning: 0.45 seconds;
- successful interception: +1 Spark, +4 build tokens, +1 Teamwork;
- defeated bot: +1 Spark and the approved reward, except bots created by Cool-down Breath pay zero build tokens;
- recovery cost: 1 Spark.

### Assets needed

- challenge-bot idle, wake, chase, hit, and vanish;
- robot well open, closed, emerge, and glow;
- prank interceptor warning and travel animation;
- contact ring, knockback trail, and invulnerability blink;
- tired-to-glitch transition;
- friendly recovery burst;
- readable warning lines that do not obscure the player.

### Pass test

- Bot contact interrupts breath every time.
- A bot cannot hit continuously every frame.
- A player with no Spark cannot recover a tired friend.
- Vent-created bots produce no build-token reward.
- Interceptors can be seen, avoided, and deliberately intercepted.
- Maximum active bot count is respected.

## Milestone 6 — Full run, downs, banking, and results

### Build in Code Studio

> Implement the full run lifecycle: title → zone selection → run → late-run challenge → results → hub. Track hearts, downs, Spark, tags, chains, interceptions, bot defeats, Teamwork, score, build tokens, and zone progress. Use a bounded down system. Bank rewards once only when the run is settled. A failed run must not duplicate currency. A completed run must show a readable summary and a clear next action.

### Required behavior

- early play teaches movement and tagging;
- late play introduces spread and hazards;
- a run can end by success, player defeat, or explicit return;
- earned build tokens bank at run end;
- Spark carried at the wrong time is dangerous;
- recent runs are recorded for the hub;
- a duplicate settlement must be impossible after reload;
- the results screen offers replay, hub, and memory/story options.

### Assets needed

- zone title cards;
- run start and run end transitions;
- success/failure result panels;
- reward counters and animated number glyphs;
- build-token, Teamwork, and zone-clear icons;
- replay, hub, and memory buttons.

### Pass test

- Run the same short level three times.
- Confirm each settled run pays once.
- Close the page during results and reload.
- Confirm the result is either safely settled or safely uncommitted, never half-paid.
- Confirm a completed zone unlocks exactly one next zone.

## Milestone 7 — Teacher challenge with five levels

### Build in Code Studio

> Add the late-run teacher challenge as a five-level state machine. The teacher has readable telegraphs, movement, damage, stagger, and flee behavior. Level 1 charges. Level 2 throws three projectiles. Level 3 wakes a fast straight-line challenge pattern. Level 4 summons three temporary challenge bots. Level 5 pulls the player toward a pulse zone. The player must spend the required Spark/Teamwork threshold before each level. Add saved friends as allies, passback timing, overload penalty, risers, and a four-piece connected-combo power surge. Keep the challenge readable, bounded, and child-friendly. Do not use screen shake.

### Starting tuning values

- level thresholds: 8, 10, 12, 14, 16 Spark/Teamwork units;
- move cooldown: 3.4 seconds, scaling to 1.7;
- telegraph: 0.8 seconds;
- hit: half a heart;
- level 2: three projectiles, speed 250, spread 0.34;
- level 3: fast wake pattern, speed 560, short segments, lifetime 2.4;
- level 4: three bots, lifetime 7 seconds;
- level 5: pull count 4, pulse radius 96, pulse speed 240, gap 0.9;
- one ally per three saved friends, maximum six;
- passback fuse: 2.5 seconds;
- overload penalty multiplier: 1.35;
- successful four-piece connected combo: 4.5-second power surge, fuse multiplier 0.28, bonus 300.

### Assets needed

- head teacher idle, charge, throw, wake, summon, pull, stagger, flee, and celebration;
- five attack telegraphs;
- three projectile variants or one clear reusable projectile;
- ally-follow and passback effects;
- four-piece combo pieces and power-surge effect;
- challenge arena background;
- Artbiter and Keith commentary portraits;
- victory bow and friendly reset animation.

### Pass test

- Each level can be reached with a debug button.
- Each attack has a visible warning before damage.
- A missed attack does not damage the player.
- A successful counter advances exactly one level.
- The challenge cannot run forever.
- A completed challenge pays its reward once.

## Milestone 8 — Permanent upgrades and five zones

### Build in Code Studio

> Add the persistent hub progression. Create five playground zones with separate unlock and completion state. Add the Fountain shop for heart capacity and faster Cool-down Breath, the Tool Bench for dash capacity and recharge, and the Friendship Tree for the long-term social reward. Add the first-run choice between +1 maximum heart and +1 dash capacity. Add the one-time starter build-token choice. Save every purchase and prevent unaffordable purchases or over-cap upgrades.

### Starting tuning values

Use Fwoosh prices as the first balance pass, renamed for the theme:

| Upgrade | Starting prices |
|---|---:|
| Fountain: heart capacity | 60 / 150 / 360 |
| Fountain: faster Cool-down Breath | 45 / 120 |
| Tool Bench: dash capacity | 80 / 200 / 480 |
| Tool Bench: dash recharge | 70 / 180 |
| Fountain unlock | 6 settled saves |
| Tool Bench unlock | 16 settled saves |
| Starter choice | 20 build tokens, one time |

### Assets needed

- five zone cards and backgrounds;
- Fountain, Tool Bench, and Friendship Tree art;
- upgrade level pips;
- locked, available, purchased, and maximum-state buttons;
- reward chest or envelope from Artbiter/Keith;
- five zone completion badges.

### Pass test

- A purchase is impossible without enough build tokens.
- A maximum upgrade cannot be bought again.
- Closing and reopening preserves every purchase.
- A replayed zone does not unlock it twice.
- The starter choice appears once only.

## Milestone 9 — Playground campus construction

### Build in Code Studio

> Implement the persistent 5×5 playground campus. Keep the entrance at grid cell 2,4. Allow the player to lay roads outward from the entrance, place buildings only beside connected roads, move buildings to empty connected sites, and select a building to inspect it. Construction continues while playing and for up to eight hours while away. A building becomes ready, then must be sealed before it works. Allow a five-token rush that removes thirty seconds. Show visible robot carriers traveling along shared roads. Shared routes add congestion time. Add storage capacity, worker capacity, station priority, food, materials, production totals, and a clear message when a building is disconnected or full.

### Building definitions

Keep these first-pass values and rename only the presentation:

| Fwoosh building | Theme building | Foundation cost | Build time | Seal cost | Production |
|---|---|---:|---:|---:|---|
| Burrow | Clubhouse | 40 | 90 s | 20 | housing |
| Apartment | Quiet room | 100 | 180 s | 50 | housing for three households |
| Salvage yard | Maker yard | 60 | 150 s | 30 | consumes 1 food → 1 material every 45 s before modifiers |
| Mushroom farm | Snack garden | 50 | 120 s | 25 | produces 1 food every 50 s before modifiers |
| Storehouse | Supply shed | 70 | 180 s | 35 | +15 shared storage |

Other required values:

- grid: 5×5;
- base shared storage: 10;
- rush: 5 build tokens for 30 seconds;
- congestion: +4 seconds per shared route;
- offline simulation cap: 8 hours;
- workers are assigned automatically from the resident system;
- station priorities: low, normal, high;
- production stops when disconnected, unsealed, out of input, or full.

### Assets needed

- campus background with 5×5 cells;
- entrance/gate;
- road straight, corner, T, and end pieces;
- foundation, building, ready-to-seal, and sealed versions of all five buildings;
- supply crates, food, material, and storage icons;
- robot carrier walk animation;
- route/congestion visualization;
- selected, invalid, disconnected, full, and working states;
- construction timer and rush button art.

### Pass test

1. Lay a road from the entrance.
2. Attempt to place a building away from the road; confirm it is rejected.
3. Place and construct one building.
4. Confirm it does not work until sealed.
5. Rush it and confirm exactly five tokens are spent.
6. Connect a station and watch a carrier travel the route.
7. Build two stations sharing a road and confirm the cycle becomes slower.
8. Leave the game closed, reopen it, and confirm no more than eight hours of work is simulated.
9. Move a building and confirm its route and production recalculate.

## Milestone 10 — Residents, homes, happiness, and chronicles

### Build in Code Studio

> Add persistent residents with names, visual families, home assignment, work assignment, happiness, relationships, and household chronicles. A Clubhouse houses one adult. A Quiet Room houses three households. Children use community care. Residents prefer certain homes. Refuge, housed, and preferred-home happiness values are 80, 85, and 95. Preferred homes add a 20% production bonus; ordinary housing adds 10%. Add family, friendship, debt, grief, rivalry, distrust, romance, solidarity, mentorship, respect, and care as relationship labels. Add daily routines as data first, then visual celebrations as a later pass.

### Assets needed

- resident portrait set for at least 12 families;
- child, adult, robot, and teacher portraits;
- home occupancy icons;
- relationship icons for every relationship label;
- household chronicle card;
- celebration confetti and group pose;
- sanctuary/campus social background.

### Pass test

- Residents persist after reload.
- A new home automatically receives eligible residents.
- A full home refuses an extra household cleanly.
- Happiness changes when a resident is housed or preferred.
- Production changes by the expected bonus.
- A relationship and chronicle entry can be viewed without paying a reward.

## Milestone 11 — Council, memories, and story delivery

### Build in Code Studio

> Add the child-friendly story layer without changing gameplay rules. Artbiter and Keith introduce challenges, explain rewards, and celebrate construction. The first council meeting checks the required campus goals. Create five persistent council groups. Each group contributes one goal. Four approvals release the next challenge. Five approvals give the stronger reward and recruit eligibility. Add optional memory-wall entries. Reading a memory never pays currency and never blocks required play. Store dialogue history and chapter progress safely.

### Five council goal types

Use the same mechanical checks as Fwoosh, with theme names:

1. build one more connected Clubhouse;
2. produce eight food portions;
3. produce six building materials;
4. return twelve friends to play and win one teacher challenge;
5. read the complete memory-wall set.

### Assets needed

- Artbiter portrait with at least four expressions;
- Keith portrait with at least four expressions;
- head teacher portrait and challenge expressions;
- five council group emblems;
- council room background;
- memory-wall cards and page-turn effect;
- dialogue box, speaker tag, continue indicator, and optional skip control;
- celebration/reward screen.

### Pass test

- Dialogue never blocks input when it should not.
- A skipped optional memory does not break the story.
- Four council approvals unlock the release.
- Five approvals create the stronger reward.
- Reloading in the middle of dialogue resumes at a safe point.

## Milestone 12 — Complete HUD, accessibility, and visual polish

### Build in Code Studio

> Replace every placeholder with approved Makko art. Keep the full portrait map visible. Use a safe header region from y=0–128, player travel from y=40–1240, and a bottom dock from y=1100–1280. Keep important actors at readable scale. Use color plus shape, label, and animation for every state. Do not rely on color alone. Add settings for text size, reduced flashing, mute, and control hints. Do not add screen shake.

### Assets needed

- final map backgrounds for indoor and outdoor zones;
- HUD frame and safe-area panels;
- all meters, buttons, icons, and warning shapes;
- font/glyph set for score and countdowns;
- reduced-flash alternatives;
- mute and settings icons;
- loading and missing-asset states.

### Pass test

- Test on a narrow phone viewport and a wide desktop viewport.
- Nothing important is under the browser edge or bottom dock.
- Text remains readable at normal and enlarged size.
- A player can identify calm, overexcited, cooling, bot, and recovery states without color alone.
- Reduced flashing removes rapid effects without removing game information.

## Milestone 13 — Asset audit, save audit, and human playtest

### Art Studio checklist

For every asset, record:

- exact Makko asset name;
- type: image, audio, character manifest, or animation;
- frame count and intended FPS;
- source prompt;
- whether it was edited from another Makko asset;
- where it is used in Code Studio;
- whether a small-screen review passed;
- whether the original source remains preserved.

Check that there are no missing references, duplicate runtime names, accidental overwrites, or unapproved outside images.

### Code Studio checklist

Ask Code Studio to add and run an in-game audit panel that checks:

- startup and scene transitions;
- all five zone unlocks and replays;
- run settlement and duplicate-payment prevention;
- movement, dash, touch, mouse, keyboard, Vent, resize, and multi-touch;
- Spark, health, hearts, dash charges, cooldown, and caps;
- runner states, spread, direct tags, chains, tired recovery;
- bot caps, damage cooldown, knockback, invulnerability, and breath interruption;
- prank interceptors and their rewards;
- teacher challenge levels 1–5;
- upgrade costs, caps, reload, and unaffordable purchases;
- campus road connection, building states, sealing, rush, storage, workers, priorities, production, congestion, and offline cap;
- residents, housing, happiness, work bonuses, relationships, chronicles, council, and memories;
- invalid JSON, partial saves, missing fields, and older save versions.

### Human tests

Do these with the game actually running, because code tests cannot prove feel or readability:

1. Desktop mouse test.
2. Desktop keyboard test.
3. Physical phone touch test.
4. Slow network/load test.
5. Page close/reopen test.
6. Long run of at least 20 minutes.
7. Complete all five teacher challenge levels.
8. Build a campus with at least one disconnected mistake, one rushed building, one full store, and two congested stations.
9. Watch a child unfamiliar with the game identify the next action from the screen without help.

Record every failure as one sentence: **what I did → what I expected → what happened**.

## Milestone 14 — “Fwoosh-equivalent” finish line

The remake is ready for the large video series only when every line below is true:

- all movement inputs work on desktop and touch;
- every Fwoosh mechanic in the mapping table exists under a new theme name;
- all five zones are playable and replayable;
- a full run can succeed, fail, settle, and reload safely;
- the teacher challenge has five readable levels;
- upgrades, rewards, and council progression persist;
- the campus can be built, staffed, supplied, and visited while offline;
- residents have homes, happiness, work bonuses, relationships, and chronicles;
- Artbiter and Keith deliver challenges and rewards in the game;
- every visual and audio asset has a Makko provenance record;
- the asset and save audits pass;
- physical-phone testing passes;
- there are no blank sprites, missing sounds, stuck inputs, duplicate rewards, or impossible purchases.

Do not start the 20+ video series before this gate passes.

## OBS milestone recording plan

Record one short OBS clip after each milestone. Each clip must show the milestone number on screen, the feature working, and the debug panel or results screen proving the result.

Suggested clips:

1. project shell and resize;
2. first Makko character set;
3. movement and Tag Dash;
4. Spark and Cool-down Breath;
5. first tag and first chain;
6. challenge bots and prank interceptors;
7. first complete run;
8. teacher challenge levels 1–5;
9. Fountain and Tool Bench upgrades;
10. first campus road and Clubhouse;
11. Snack Garden, Maker Yard, and Supply Shed;
12. robot carriers and congestion;
13. residents and homes;
14. council and memory wall;
15. indoor playground zone;
16. outdoor playground zone;
17. touch-phone test;
18. full progression from new save;
19. failure recovery and save reload;
20. complete game tour;
21. Artbiter challenge tutorial;
22. Keith reward tutorial;
23. campus construction tutorial;
24. Tag Dash tutorial;
25. Cool-down Breath tutorial;
26. teacher challenge tutorial.

For each future video, capture this sequence: **one sentence goal → play the mechanic → show the reward → show the next unlock**. That makes every clip useful as both a promo and a tutorial.

## The first real work session

When you say to begin, do only this:

1. Review the two preparation pages.
2. Fill in the seven remaining theme decisions.
3. Open Makko Dashboard.
4. Choose **New game**.
5. Create **You’re It!**.
6. Build Milestone 0 in Code Studio.
7. Stop and test the empty shell before generating final art.

No project has been created while this plan was written.

