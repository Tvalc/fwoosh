# Invoice earnings accounting

Tony confirmed September 16: debt relief uses lifetime earned embers. Spending on Fwoosh upgrades or rebuilding does not reduce that basis.

## Shipped accounting scope

`META.emberLedger` is a versioned record: `{v:1, earned, historyComplete}`. Fresh games start at zero with complete history. The existing guarded run settlement adds earned rewards and win bounty to both the wallet and lifetime record exactly once. The separately identified starter grant is not earned income and stays out of the ledger. Purchases affect only the wallet. As before, an interrupted run that never settles is not banked.

The Judgment screen displays the record only after the restoration hearing. It does not calculate debt or mint an export/reward.

## Existing saves

The previous save format retains only 20 run records and no complete spending ledger. Recover a conservative floor as the maximum of recent-run earnings and the wallet less the known starter grant. Do not add these overlapping sources, estimate old earnings from saves/districts, or reconstruct purchases using current prices that may differ from historical prices. Mark migrated history incomplete. Preserve that flag after new earnings and reload.

A remedy for unrecorded legacy earnings must be agreed before enabling final debt redemption. Do not present this floor as an exact total or silently discard the missing-history distinction.

## Still to decide and implement

- Ember-to-debt conversion, caps and reward thresholds.
- Invoice items/upgrades and the separate System Shop's funding rules.
- Ratkin recruit identity, acquisition window and miss condition.
- Exact treatment of Cuong's 19-life balance plus Duy's transferred five, including the alternate survival route.
- Versioned cross-game payload, authenticity/trust model and exactly-once Ledger redemption.

Four Ratkin votes still release Duy. Unanimity grants the best future Invoice tier and recruit eligibility. Fwoosh remains playable and completable without Ledger.
