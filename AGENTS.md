# Project working rules

- Keep this execution stage documentation-only; application code, data, permissions, secrets, dependencies, external connections and publication are out of scope because the baseline must be understood first.
- Treat the migration source of truth as unresolved until local SQL histories and the actual database journals are reconciled; this prevents accidental replay or divergence.
- Treat the Pro multi-venue and Promoter architecture in `docs/architecture/target-overview.md` as a proposal, not an implemented model; the current owner-based data model cannot establish team permissions.
- Record verified facts separately from supplied observations and hypotheses in the French reference documentation; this makes the work reproducible without overstating evidence.
- Let Lovable manage Git mutations and verify remote synchronization separately from local changes; a local revision is not proof of a GitHub delivery or a database backup.
- Public event SEO reads use an anonymous server function with an explicit public-column projection; both sitemap paths share a server-only handler to avoid privileged reads and divergent XML.