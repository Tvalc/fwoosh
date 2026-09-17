# Invoice earnings accounting

Tony confirmed September 16: debt relief uses lifetime earned embers. Spending on Fwoosh upgrades or rebuilding does not reduce that basis.

## Shipped accounting scope

`META.emberLedger` is a versioned record: `{v:1, earned, historyComplete}`. Fresh games start at zero with complete history. The existing guarded run settlement adds earned rewards and win bounty to both the wallet and lifetime record exactly once. The separately identified starter grant is not earned income and stays out of the ledger. Purchases affect only the wallet. As before, an interrupted run that never settles is not banked.

The Judgment screen displays the record only after the restoration hearing. It does not calculate debt or mint an export/reward.

## Authorized fresh start — September 17

Tony explicitly requested a one-time wipe of all old progress so development no longer has to recover historical accounts. Build `2026-09-17-reset-1` retires `fwoosh.meta` and `fwoosh.opp` and starts the stable `fwoosh.save2.*` generation. On each device/origin the cutover takes effect when the new build loads. Subsequent releases retain these new saves. Old tabs cannot overwrite the new keys.

Historical earnings are not estimated, migrated or owed a recovery path. Current-generation earnings start at zero and are recorded exactly from guarded settlement. Malformed current ledger data remains distinguishable from a complete record, but it is not repaired from wallet/recent-run guesses.

## Still to decide and implement

- Ember-to-debt conversion, caps and reward thresholds.
- Invoice items/upgrades and the separate System Shop's funding rules.
- Ratkin recruit identity, acquisition window and miss condition.
- Exact treatment of Cuong's 19-life balance plus Duy's transferred five, including the alternate survival route.
- Versioned cross-game payload, authenticity/trust model and exactly-once Ledger redemption.

Four Ratkin votes still release Duy. Unanimity grants the best future Invoice tier and recruit eligibility. Fwoosh remains playable and completable without Ledger.
