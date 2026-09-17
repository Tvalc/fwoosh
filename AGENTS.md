# Fwoosh collaboration

Read `docs/COORDINATION.md` and the linked ownership board before editing. Tony's explicit instructions take precedence over these defaults.

- **Standing art rule for every agent: use Makko art for all Fwoosh artwork.** This covers characters, animations, environments, UI art, effects and diary illustrations. Reuse or process Makko sources; do not substitute another generator, stock art or newly drawn replacement artwork unless Tony explicitly changes this rule. If Makko access or a needed source is missing, report it and continue other work rather than inventing a substitute. Preserve source provenance; never label an unverified asset as Makko.

- Work in a separate folder and feature branch. Do not reset, stash, clean, switch branches in, or commit another agent's active checkout.
- Parallel lanes: Cursor owns Makko animation and illustration production under issue #31. Codex owns gameplay/system implementation, progression/save reliability, testing, records, integration and releases. Codex may implement scoped runtime work in its own checkout while Cursor continues; a handoff is not a prerequisite for independent work. Reconcile actual overlapping diffs during integration.
- Preserve raw assets and saves in the current `fwoosh.save2.*` generation. Tony explicitly retired all pre-cutover progress in `2026-09-17-reset-1`; do not restore it or maintain its migration/accounting paths. Never infer final-district completion from district unlock alone.
- Keep patches scoped and separate refactor, art and behavior changes. Record actual checks and known failures; a simulation audit does not replace visual playtesting.
- Update the owning issue with the commit/PR, validation and unresolved dependencies. Coordinate merges/releases through Codex; do not force-push or deploy another agent's unfinished work.
- Historical documents in docs/archive are references, not current instructions or task approvals.
