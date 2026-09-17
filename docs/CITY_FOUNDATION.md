# Ratkin Quarter foundation

Build `2026-09-15-city-1` establishes the smallest complete rebuilding loop behind Fwoosh's arcade game. It is an initial tuning slice for issue #27.

Build `2026-09-15-logistics-1` extends that foundation with Mushroom Farms, Storehouses, food costs, visible road carriers, shared-route congestion and optional priorities. See [LOGISTICS.md](LOGISTICS.md).

Build `2026-09-15-judgment-1` makes the first complete restoration milestone playable. See [JUDGMENT.md](JUDGMENT.md).

## Sanctuary extension — 2026-09-17-sanctuary-1

Persistent rescued residents now occupy housing and supply actual workers. Burrows house one adult household; Apartments house three (100 foundation, 180 seconds, 50 seal, five materials for later copies). Empty houses and children do not generate workers. Housing grants +10% work rate, or +20% for a preferred type. Both housing types count equally toward restoration/favor. The city toolbar now has two readable rows. Sanctuary opens the refuge roster and household chronicles. See [SANCTUARY_SOCIETY.md](SANCTUARY_SOCIETY.md) for migration, canon and remaining celebration/routine work. The following original foundation values describe the earlier slice; the resident system supersedes its abstract worker-per-building rule.

## Player loop

1. Extend free roads from the fixed gate across a 5×5 plan.
2. Spend embers to summon a Burrow or Salvage Yard foundation beside the connected road network.
3. Let Ratkin build during runs and while away, or spend five embers to remove 30 seconds.
4. Spend embers again to seal the completed structure. An unsealed building never operates.
5. A connected sealed Burrow supplies one worker. Automatic assignment sends available workers to connected sealed Yards in stable construction order.
6. A working Yard converts ruin salvage into materials for later copies. Moving a building recalculates its route and clears partial work.

## Initial tuning

| Building | Foundation | Build time | Seal | Later-copy materials | Output |
|---|---:|---:|---:|---:|---|
| Ratkin Burrow | 40 embers | 90 seconds | 20 embers | 2 | 1 connected worker |
| Salvage Yard | 60 embers | 150 seconds | 30 embers | 3 | 1 material per cycle |

The shortest Yard cycle is 45 seconds. Each road step beyond a route distance of two adds five seconds. Construction and production catch-up are capped at eight hours per return. These are playtest values, not final balance.

## Automation and optimization

The city works without worker micromanagement. The first connected Yards receive available Burrow workers automatically; blocked stations explain whether they lack a road or worker. Players optimize by shortening roads, moving buildings and choosing construction order. Issue #28 adds visible hauling, food, storage, congestion and optional priority controls without removing this automatic baseline.

## Art boundary

The exterior currently uses the verified Makko Ashford environment at low opacity. Roads, panels, progress and the station's Ratkin status marker are code-native interface graphics. No new character or building illustration is claimed. Approved Ratkin workers, structures and workstation animations must come from Makko and retain provenance under issue #31.

## Save behavior

The existing `fwoosh.meta` v1 record gains an optional `city` object. Older saves receive a fresh gate-only plan without losing embers, upgrades, district progress, diary state or run history. City actions and important timer completions persist locally. See [SAVE_DATA.md](SAVE_DATA.md) for the exact fields.
