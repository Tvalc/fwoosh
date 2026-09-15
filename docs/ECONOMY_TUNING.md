# First-upgrade economy — 2026-09-14-economy-1

Tony approved removing ember payouts from vent-created demons and making a meaningful permanent upgrade affordable after the first completed run, even a short loss. The opening choice is survivability versus mobility, at equal prices. Later upgrades should take longer. The 20-ember price and one-time top-up are initial implementation values for playtesting, not a completed economy balance pass.

## Opening choice

- After the first settled run, offer either Deep Well (+1 max heart, 5 to 6) or Quick Feet (+1 dash capacity, 3 to 4) for 20 embers.
- The offer is available before the Well's 6-rescue or Forge's 16-rescue unlock. It buys the ordinary first tier of the selected track; it is not an extra tier.
- Bank earned embers and any victory bounty first, then top up the wallet to 20 only if necessary. A zero-ember first loss gets 20; earning 7 with an empty wallet gets 13; earning 30 gets no bonus. Existing wallet funds count toward affordability. Display the bonus separately from earned run embers.
- The bonus happens once. Skipping, reloading, dying again or duplicate settlement cannot repeat it. The choice can be deferred and reopened from the hub. Buying any permanent upgrade ends eligibility for this first-purchase offer.
- The other choice remains available at its regular shop price when its building unlocks. Remaining prices are unchanged: hearts 60/150/360, recovery 45/120, dash capacity 80/200/480, recharge 70/180. A starter heart purchase makes the next heart cost 150; a starter dash purchase makes the next dash cost 200.
- Purchases persist and apply to the next run. Existing saves with no permanent upgrades receive the offer after their next settled run. Already-upgraded saves retain their balances and tiers and receive no starter grant.

## Vent-created enemies

Defeating a demon tagged `source: 'vent'` awards zero embers. It still returns heat and affects Edge. Town, Keith and legacy untagged demons retain their existing ember reward and run cap. This removes the direct ember reward for creating and killing your own demons; it does not claim that all indirect rescue/heat/Edge incentives have been eliminated.

## Save and deployment

Version-1 saves remain compatible. `fwoosh.meta.flags` gains starterChecked, starterReady, starterBonus and starterChosen. The top-up and its flag save together during exactly-once settlement. No Invoice, lifetime-earned-ember or city accounting is introduced. Script URLs carry the release version so a fresh page cannot reuse older unversioned gameplay scripts.

67 automated gameplay/input checks pass, including 11 added economy regressions. Local browser checks at 320px cover separate earned/bonus lines, both choices, purchase, deferral and reopening. Human run pacing and physical-phone testing remain open. Deployment confirmation is recorded in issue #1.

## Next interview

Set the desired cadence of later purchases, then tune earning sources, prices and effects against actual runs. Do not present unchanged shop prices as newly balanced. Embers will never be sold for money. City rebuilding, favor, Invoice and RPG spending remain deferred and require explicit accounting decisions, including whether this starter bonus counts as collected embers for cross-game rewards.
