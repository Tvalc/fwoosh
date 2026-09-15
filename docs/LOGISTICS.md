# Ratkin Quarter logistics

Build `2026-09-15-logistics-1` completes the first systems pass for issue #28. The city remains automatic by default and exposes layout and priority controls for players who want to optimize it.

## Resource chain

| Structure | Worker | Input | Output or capacity | Base cycle |
|---|---:|---|---|---:|
| Ratkin Burrow | — | connected road | 1 available worker | — |
| Mushroom Farm | 1 | connected road | 1 food | 50 seconds |
| Salvage Yard | 1 | 1 food | 1 building material | 45 seconds |
| Storehouse | — | connected road | +15 food cap and +15 material cap | — |

Both resources have a base cap of 10. A new or migrated city starts with four food so the first Yard can operate before a Farm is sealed. A production station loses partial cycle progress while blocked; disconnected or unstaffed time is never banked.

## Assignment and priorities

Eligible Farms and Yards receive connected Burrow workers automatically. Stations default to normal priority, then break ties by construction order. Players may set low, normal or high priority. At zero food, an eligible Farm receives an automatic emergency boost so a high-priority hungry Yard cannot deadlock the whole city. Once food exists, player priorities apply normally.

## Routes and congestion

Each active station follows its shortest connected road route to the gate network. A code-native `R` carrier marker travels from stores to the station and back. Each other active carrier sharing at least one road cell adds four seconds to that station's cycle. Road distance still adds five seconds per step beyond distance two. Moving a station clears partial work and recalculates both penalties.

The marker is a functional interface element. It will be replaced by approved Makko Ratkin locomotion without changing the simulation or save contract.

## Initial building tuning

| Building | Foundation | Build time | Seal | Later-copy materials |
|---|---:|---:|---:|---:|
| Mushroom Farm | 50 embers | 120 seconds | 25 embers | 2 |
| Storehouse | 70 embers | 180 seconds | 35 embers | 4 |

The Burrow and Yard values remain in [CITY_FOUNDATION.md](CITY_FOUNDATION.md). All values are playtest tuning.
