# Fwoosh canon — approved decisions and open design

Reviewed September 15, 2026. Tony's explicit decisions supersede contradictory prototype text. This file records current story and cross-game canon; implementation status belongs in [STATUS.md](STATUS.md), and planned work belongs in [ROADMAP.md](ROADMAP.md).

## Premise

Fwoosh tells Duy's experience between dying with his team and earning resurrection. It must stand alone, and it can later serve as the playable route used to recover Duy in a larger multi-game, multi-genre story.

Duy initially understands almost nothing. He dies and is dropped directly into the burning-town action. The situation does not wait for him. Khet-Tak-Tor, the Ratkin Arbiter, gives brief present-tense guidance during controllable gameplay: Duy is being punished, he must relieve the ratkin's suffering and he will die repeatedly. The game reveals more as he progresses. His name is pronounced **KET-tak-TOR** and carries the Ratkin sense **“the voice that closes the debt.”** The current live build still uses the deprecated name Keith.

Present events use paced bottom-screen dialogue. Past revelations happen rarely during runs and mainly through the optional diary. Immediate danger and objectives should be clear even while the larger mystery unfolds.

## Duy's debt and the ratkin

After the team's deaths and the gods' offer, Duy and Cuong arrive in a dark cell. Frightened by movement around them, they fire and kill nineteen unarmed ratkin who were fleeing toward an open door rather than attacking. Duy later sacrifices himself beneath a gate so his companions can escape and awakens in the burning ratkin town.

Khet-Tak-Tor is a Ratkin jailer and Arbiter. The current human presentation will be replaced with a Ratkin Makko design. He can punish, test and obstruct Duy, and he administers the judgment process; defeating him never grants freedom by itself. Duy must rebuild what Ratkin society lost and earn their favor. Ratkin society supplies the authority behind his release. Whether Khet-Tak-Tor announces their collective verdict or holds delegated authority to release Duy remains to be decided. Nineteen rescues and five district victories are meaningful progress, but neither automatically earns release.

Rescuing a burning ratkin draws its heat into Duy. The process hurts, and the pain grows as he carries more heat. A released ratkin ascends rather than merely stumbling away.

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

## Release and the wider RPG

Completing Duy's restoration/favor path releases and resurrects him. Fwoosh must provide a satisfying, comprehensible ending even when no other game is present.

Duy's return also reduces Cuong's debt by an amount determined by embers Duy collected. Chit-tat-to's Invoice applies that credit and can provide bonuses, rare or unique items and upgrades. After Duy rejoins the RPG party, a System Shop can sell Duy-specific upgrades funded by embers. A Ratkin character can become a missable recruit after Duy returns having rebuilt ratkin society.

Keep the connection small; the full city economy does not need to transfer into the RPG.

## Accounting conflict that must remain explicit

Current Vovinam Ledger material assigns the nineteen ratkin lives to Cuong and a separate five-life Caedite Eos balance to Duy, transferred to Cuong on Duy's death. Fwoosh presents the nineteen deaths through Duy's experience. Do not silently rewrite either ledger or assume that Fwoosh clears five, nineteen, twenty-four or the whole balance.

Ledger also has a route where Duy survives and older language saying dead guests do not resurrect. Tony has established this intended Duy resurrection path as an exception. Preserve alternate routes until their relationship is explicitly decided; do not generalize Duy's exception to every dead guest.

## Open design decisions

- What exactly constitutes complete restoration and which acts earn ratkin favor.
- Khet-Tak-Tor's exact mandate as jailer and Arbiter.
- Whether Khet-Tak-Tor announces a collective Ratkin verdict or personally holds delegated release authority.
- Why Khet-Tak-Tor maintains or uses the recurring fire as part of Duy's punishment without making Ratkin lives disposable.
- How district/Arbiter progress contributes without making one combat victory the release condition.
- City costs, construction times, production ratios and offline limits.
- Whether the Invoice uses lifetime collected embers, unspent embers or another auditable total.
- Invoice conversion, caps, reward thresholds and interaction with Fwoosh spending.
- System Shop inventory and relationship to Invoice rewards.
- Ratkin recruit identity, abilities, eligibility and miss condition.
- The exact 19-plus-5 debt reconciliation and Duy-survives route treatment.

Do not invent these values during implementation. Resolve them through the owning issues and update this file plus the Fwoosh/Ledger shared handoff together.

## Current implementation boundary

The live dialogue and diary follow the gradual-discovery direction and no longer promise freedom for a raw rescue or district count, but they still use the deprecated Keith name and human art. The Ratkin Arbiter migration is tracked in issue #39. The arcade loop and current town upgrades exist. City construction/production/logistics, favor judgment, resurrection ending, Invoice redemption, System Shop, Ratkin recruit and cross-game payload remain unimplemented and are tracked in issues #27–#30.
