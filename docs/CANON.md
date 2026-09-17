# Fwoosh canon — approved decisions and open design

Reviewed September 17, 2026. Tony's explicit decisions supersede contradictory prototype text. This file records current story and cross-game canon; implementation status belongs in [STATUS.md](STATUS.md), and planned work belongs in [ROADMAP.md](ROADMAP.md).

## Premise

Fwoosh tells Duy's experience between dying with his team and earning resurrection. It must stand alone, and it can later serve as the playable route used to recover Duy in a larger multi-game, multi-genre story.

Duy initially understands almost nothing. He dies and is dropped directly into the burning-town action. The situation does not wait for him. Khet-Tak-Tor, the Ratkin Arbiter, gives brief present-tense guidance during controllable gameplay: Duy is being punished, he must relieve the ratkin's suffering and he will die repeatedly. The game reveals more as he progresses. His name is pronounced **KET-tak-TOR** and carries the Ratkin sense **“the voice that closes the debt.”**

Present events use paced bottom-screen dialogue. Past revelations happen rarely during runs and mainly through the optional diary. Immediate danger and objectives should be clear even while the larger mystery unfolds.

## Duy's debt and the ratkin

After the team's deaths and the gods' offer, Duy and Cuong arrive in a dark cell. Frightened by movement around them, they fire and kill nineteen unarmed ratkin who were fleeing toward an open door rather than attacking. Duy later sacrifices himself beneath a gate so his companions can escape and awakens in the burning ratkin town.

Khet-Tak-Tor was Duy's Ratkin jailer before the gate fell. The collapse kills him briefly alongside Duy. The Ratkin revive Khet-Tak-Tor in time; they cannot revive Duy. During their shared interval near death, the Ratkin god, Adonai and Odin bind Ratkin and humanity through Khet-Tak-Tor and Duy. The bond can endure only if the two peoples overcome the heinous violence of their introduction. Khet-Tak-Tor returns as the Ratkin Arbiter and Duy remains among the dead, making their afterlife conflict a continuation of personal history and a trial of that larger covenant.

The Ratkin Makko design now replaces the earlier human presentation. Khet-Tak-Tor can punish, test and obstruct Duy, and he administers the judgment process; defeating him never grants freedom by itself. Duy must rebuild what Ratkin society lost and earn their favor. The rebuilt Ratkin community alone supplies the authority behind his release through five distinct voting blocs. Four votes release and resurrect Duy. A unanimous five-vote verdict is optional: it grants the strongest Chit-tat-to's Invoice reward tier and makes the missable Ratkin recruit eligible. Khet-Tak-Tor presents the evidence, announces the collective verdict and executes the resulting sentence under the covenant, but he cannot personally forgive the debt or substitute his will for theirs. Nineteen rescues and five district victories are meaningful progress, but neither automatically earns release.

Rescuing a burning ratkin draws its heat into Duy. The process hurts, and the pain grows as he carries more heat. A released ratkin ascends rather than merely stumbling away. Duy can free Ratkin in three states: flaming, non-flaming and cinder. Flaming rescues still draw one heat into him. Touching a non-flaming Ratkin or cinder person spends one carried heat to ascend them, so stopping demons and intercepting fire imps can enable rescue before anyone burns. All three states count fully toward rescue progress and sanctuary arrivals; at the same incoming heat their direct rescue rewards are equal. Heat already committed to a vent unit cannot also fund an ascension.

## Sanctuary and household life

Rescued Ratkin ascend into sanctuary, keeping their individual identities. After centuries of injustice, they are granted eternal life there and must build the society that makes it fulfilling. Children may be born by resident choice, grow into adults and cease aging. Sanctuary protects residents from death. They may voluntarily leave, becoming mortal while away; returning restores their protection. This exception is specific to the Ratkin sanctuary, not a rule for every dead guest in Ledger. Departures remain lore/chronicles in the first release.

The communal refuge is a joyful place of welcome, shared living and celebration. Personal homes and apartments are equally valid choices; singles, friends, couples and families all belong. Residents choose their own relationships and life paths. Housing preferences and household development affect happiness and production. Every household keeps a persistent chronicle. Celebrations run without interrupting play, with optional zoomed-in visual vignettes. See [SANCTUARY_SOCIETY.md](SANCTUARY_SOCIETY.md) for the approved direction and explicit implementation boundaries.

Every sanctuary resident is to have an individually authored name, background and personal lore in their chronicle. The nineteen Ratkin killed by Duy and Cuong came from a nomadic forest society. That directly affected community is the first society rebuilt in sanctuary; its goal includes growth, expansion and a better future beyond restoration. The first authored group shares that community, with arrivals from other worlds coming later. This does not limit sanctuary to the nineteen victims or imply that the whole community died in the massacre. Its name, specific traditions and future balance of settled and nomadic life remain open; biographies are not yet implemented.

## Rebuilding layer

The action arcade game remains central. An incremental ratkin-city layer sits behind it.

- Players place buildings and design the town rather than restoring only fixed sites.
- Homes and production buildings can have multiple copies; landmarks are unique.
- Embers magically clear a site and summon its foundation.
- Ratkin construct over time during runs and while the player is away.
- A completed building must be sealed with embers before it operates.
- Food supports workers, materials support construction and homes expand workforce.
- Ratkin physically carry goods over roads; distance and congestion affect output.
- Staffing and priorities work automatically by default. Players can optimize if they want without mandatory micromanagement.
- Embers can accelerate work and buy predictable upgrades.
- Sealing and major upgrade milestones can unlock random cosmetic appearances. Every appearance remains selectable; rarity grants no Fwoosh gameplay power and never determines favor or release.
- Embers are earned and will never be sold for money.

The first playable Ratkin Quarter uses a 5×5 plan with a fixed gate. Its initial playtest buildings are a worker-providing Burrow and a material-producing Salvage Yard. Current costs, timers, acceleration rate, offline cap and road-distance penalty are tuning values recorded in [CITY_FOUNDATION.md](CITY_FOUNDATION.md), not immutable story canon.

The first Ratkin Judgment recognizes a minimum self-sustaining society rather than demanding a large copy quota. It requires five actually cleared districts, nineteen ascended Ratkin, two connected sealed residential buildings (Burrows or Apartments), a connected sealed Farm that has produced food, and a connected sealed Yard plus Storehouse after material production. Khet-Tak-Tor summons the hearing and acknowledges that Ratkin society can survive. The hearing explicitly does not release Duy: Ratkin favor and the final verdict remain separate. Larger settlements and optimized layouts are optional for this judgment.

After that hearing, five social blocs judge what Duy does with the restored society. The Hearth asks for another connected sealed home. The Bowl asks for eight new food. The Hand asks for six new materials. The Claw asks for twelve more ascensions and another Arbiter trial victory. The Memory asks Duy to read all fifteen diary chapters and face the truth of his path. Earned support is permanent. Any four votes release and resurrect Duy, so the diary remains optional to finish the standalone game. A fifth vote creates the unanimous Invoice and recruit outcome.

## Release and the wider RPG

Completing Duy's restoration/favor path releases and resurrects him. Fwoosh must provide a satisfying, comprehensible ending even when no other game is present.

Duy's return also reduces Cuong's debt by an amount determined by lifetime embers Duy earned. Embers already spent rebuilding or buying upgrades still count; Fwoosh spending never reduces the debt-relief basis. Chit-tat-to's Invoice applies that credit and can provide bonuses, rare or unique items and upgrades. A four-of-five verdict is sufficient for Duy's return; unanimous support upgrades the Invoice to its strongest reward tier and makes a Ratkin character eligible to become a missable recruit. After Duy rejoins the RPG party, a System Shop can sell Duy-specific upgrades funded by embers.

Keep the connection small; the full city economy does not need to transfer into the RPG.

## Accounting conflict that must remain explicit

Current Vovinam Ledger material assigns the nineteen ratkin lives to Cuong and a separate five-life Caedite Eos balance to Duy, transferred to Cuong on Duy's death. Fwoosh presents the nineteen deaths through Duy's experience. Do not silently rewrite either ledger or assume that Fwoosh clears five, nineteen, twenty-four or the whole balance.

Ledger also has a route where Duy survives and older language saying dead guests do not resurrect. Tony has established this intended Duy resurrection path as an exception. Preserve alternate routes until their relationship is explicitly decided; do not generalize Duy's exception to every dead guest.

## Open design decisions

- The exact powers and limits of Khet-Tak-Tor's mandate under the divine covenant.
- Why Khet-Tak-Tor maintains or uses the recurring fire as part of Duy's punishment without making Ratkin lives disposable.
- How district/Arbiter progress contributes without making one combat victory the release condition.
- Long-term city costs, construction times, production ratios and offline limits after playtesting the initial slice.
- Ember-to-debt conversion, caps and reward thresholds; the lifetime-earned basis is locked.
- Invoice conversion, caps, reward thresholds and interaction with Fwoosh spending.
- System Shop inventory and relationship to Invoice rewards.
- Ratkin recruit identity, abilities, acquisition window and miss condition after unanimous support establishes eligibility.
- The exact 19-plus-5 debt reconciliation and Duy-survives route treatment.

Do not invent these values during implementation. Resolve them through the owning issues and update this file plus the Fwoosh/Ledger shared handoff together.

## Current implementation boundary

The live dialogue, HUD and diary use Khet-Tak-Tor's approved identity and follow the gradual-discovery direction without promising freedom for a raw rescue or district count. The save-compatible `keith` media key now displays the Makko Ratkin Arbiter; dedicated emotional portraits remain under issue #39. The arcade loop and current town upgrades exist. Ratkin Quarter implements roads, five building types including apartments, offline construction, sealing, persistent sanctuary residents, automatic housing/staffing, household chronicles, happiness/work-rate effects, food/material storage, visible route carriers, congestion and optional station priorities. The five-term Shrine record and first restoration hearing are implemented. Carriers now display Makko farmer/mason locomotion; dedicated cargo and work actions remain pending. Favor, the final verdict and the standalone resurrection ending are implemented; Invoice redemption, System Shop, Ratkin recruit and cross-game payload remain under #30. Authored sanctuary celebrations, diverse shared households and generational growth remain under #27/#28/#31.


## Shared-world clarification — September 17

Tony clarified through the Ledger task: Ledger's Ratkin village is a related material-world settlement for living Ratkin. Fwoosh's sanctuary is the new afterlife awarded to the entire Ratkin race across the multiverse, preserving individual identity. When created, the System announced it to Ratkin societies everywhere, using pictograms where necessary and words where societies could receive them. Deaths remain permanent events in Ledger's mortal world; sanctuary continuation does not reverse a death or battle result or create a general resurrection rule for other guests. Keep the settlements' populations, geography and economies distinct. This is canon documentation, not a new cross-game runtime.
