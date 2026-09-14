# Fwoosh canon — story interview in progress

Tony's explicit decisions supersede contradictory prototype text. This record distinguishes confirmed decisions from implementation. See the latest story implementation checkpoint below.

## Confirmed by Tony

- Duy's death, debt and sentence are the canonical origin. The old Keith rivalry / leaving town / becoming famous origin must be replaced.
- Fwoosh tells Duy's path from death to earning resurrection. It must stand alone and later serve as a playable resurrection chapter in a larger story told across games and eventually a multi-genre experience.
- Keith is the jailer. Defeating him is not the narrative goal or the authority that grants release.
- Duy must rebuild the ratkin civilization and what they lost, then earn their favor. The ratkin decide when he is released.
- Nineteen rescues or five district victories alone must not be described as automatically granting release. Existing diary promises to that effect require reconciliation with Tony's decisions.
- All game artwork must be Makko art; see ART.md and AGENTS.md.

## Existing backstory in js/story.js

The diary already answers why Duy owes the ratkin a debt. After the team's deaths and accepting the gods' offer, Duy and Cuong arrive in a dark cell. Afraid of the movement around them, they fire their pistols and kill nineteen unarmed ratkin. When the light comes up, they discover the ratkin were fleeing past them toward an open door, not attacking. The System records nineteen lives owed. Duy later sacrifices himself beneath a gate so his companions can escape; he subsequently awakens in the burning ratkin town, where Keith is the warden.

These events are existing diary content, not new interview inventions. Read the source before asking Tony to repeat established history. Some existing diary interpretations of repayment and release conflict with his confirmed decisions above.

## Additional city and integration decisions confirmed by Tony

- The action arcade game remains the core; an incremental/idle ratkin-city rebuilding game sits behind it.
- Embers are magical fuel. Spending them clears a building site and summons its foundation; ratkin then construct the building over time, including while the player is away.
- A completed building must be sealed with embers before it becomes active. Active buildings produce resources for city growth.
- Food supports workers, materials support construction, and homes increase the workforce. Tony approved this simple resource model.
- Embers also fund upgrades and acceleration. Production upgrades are predictable. Sealing and major upgrade milestones grant random cosmetic appearances; every unlocked appearance is retained permanently.
- Cosmetic rarity does not determine rebuilding progress or ratkin release judgment (approved as part of the milestone recommendation).
- Embers will never be sold for real money.
- Keep main-game integration simple: when Duy rejoins the party in the Shining Force-style RPG, the System Shop can sell Duy-specific upgrades for embers. The city economy need not transfer wholesale.
- Whether that shop receives unspent embers or a budget based on lifetime earnings is still unanswered; Tony directed us to inspect Vovinam Ledger before continuing that discussion.

## Vovinam Ledger reference found

Local project: `C:\Users\19415\Documents\Code Workspace\Vovinam Ledger`; remote: `Tvalc/vovinam-ledger`. Claude's local project memory is available under `.claude/projects/C--Users-19415-Documents-Code-Workspace-Vovinam-Ledger/memory`. Its memory index still describes P0, and README still says P2, but commits/changelog show P3 towns/saves/onboarding and subsequent tile/art work through 28c2040. Do not treat those stale phase labels as current evidence.

Read its `docs/00b_locked_decisions.md`, `docs/03_story.md`, and `docs/21_canon_systems.md` when designing the connection. Existing Ledger text says dead guests never resurrect and assigns the ratkin balance 19 to Cuong, with Duy's separate Caedite Eos balance 5 transferring on his death. Fwoosh's diary currently describes nineteen as Duy's own debt. These are recorded cross-project conflicts; do not silently invent a reconciliation. Tony's new resurrection/rebuilding direction supersedes the blanket prohibition for this intended Duy path. No Vovinam Ledger files have been edited.

## Still to establish in the interview

- Tony confirmed Duy's release also reduces Cuong's debt in Vovinam Ledger. The amount remains undecided; do not assume five or the entire balance.
- What constitutes a complete rebuild, and which systems belong in this story-update task versus later expansion.
- What player actions earn ratkin favor, who communicates their judgment, and how release becomes available.
- How the current district/Keith encounters represent progress toward restoration without presenting Keith's defeat as liberation.
- How much backstory the standalone intro reveals, and how the resurrection ending connects to the wider story without depending on another game.

Do not invent answers to these questions or implement a new favor/release system before the interview resolves its design.

## September 14 follow-up: Invoice and release cadence

- Tony confirmed that the debt repaid for Cuong depends on the amount of embers Duy has collected. Chit-tat-to's Invoice is the repayment mechanism.
- The Invoice can also provide bonuses, rare unique items and upgrades for players.
- A missable Ratkin character can join the RPG after Duy returns having rebuilt ratkin society.
- The conversion rate, collection/budget definition, redemption rules, reward tables and conditions for missing the recruit are not specified. Do not invent or implement these values before the interview resolves them.
- Tony authorized integrating and publishing the immediate Fwoosh release, then deploying each major completed change to the live website for his testing. This supersedes earlier instructions to leave everything in draft pending release permission. Continue checking changes before deployment and preserve saves.

## First-run direction and story implementation

Tony clarified: Duy initially understands almost nothing. He has just died and is dropped into action. Keith speaks DURING gameplay, vaguely explaining punishment, relieving ratkin suffering, and repeated death. More is revealed with progress. No upfront death/massacre explanation.

Story release 2026-09-14-story-1 implements that direction: direct control with Keith narration; fixes title boot consuming the intro; replays the new intro once without resetting progress; keeps the mobile vent HUD exposed. Later dialogue, diary, title and victory text now align with rebuilding/favor and ratkin judgment. The Shrine records rescues without declaring a nineteen-rescue debt payoff. City construction, favor judgment, resurrection and Invoice redemption remain unimplemented pending their detailed interview.
