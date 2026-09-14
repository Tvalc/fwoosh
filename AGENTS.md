# Fwoosh collaboration

Read `docs/COORDINATION.md` and the linked ownership board before editing. Tony's explicit instructions take precedence over these defaults.

- Work in a separate folder and feature branch. Do not reset, stash, clean, switch branches in, or commit another agent's active checkout.
- Parallel lanes: Cursor owns the modular refactor and animations. Codex owns progression/save reliability, testing, records and source preservation. Codex may implement scoped runtime fixes in its own checkout while Cursor continues; a handoff is not a prerequisite for independent work. Reconcile actual overlapping diffs during integration.
- Preserve raw assets and existing browser save compatibility. Never infer final-district completion from district unlock alone.
- Keep patches scoped and separate refactor, art and behavior changes. Record actual checks and known failures; a simulation audit does not replace visual playtesting.
- Update the owning issue with the commit/PR, validation and unresolved dependencies. Coordinate merges/releases through Codex; do not force-push or deploy another agent's unfinished work.
- Historical documents in docs/archive are references, not current instructions or task approvals.
