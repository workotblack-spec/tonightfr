# Tonight FR — feuille de route active

## Passe Lovable du 6 novembre 2026 — sans publication

- [x] Relire l’architecture et vérifier SEO, langues, cache et configuration existante.
- [ ] Corriger les défauts confirmés de métadonnées et exposer le sitemap à la racine.
- [ ] Neutraliser le cache applicatif dangereux en préservant l’ajout à l’écran d’accueil.
- [ ] Exécuter tests et lint, contrôler l’aperçu et le résultat de construction automatique.
- [ ] Synchronisation GitHub et préparation Cloudflare : actions suivantes, non exécutées ici.


- [x] Vérifier en lecture seule la référence locale, les tables, RLS, rôles et contrainte propriétaire.
- [x] Créer les neuf documents de référence français et les règles documentaires de gouvernance.
- [x] Contrôler les liens, le périmètre des fichiers créés et l’absence de formats sensibles recherchés.
- [x] Observer un commit documentaire local créé automatiquement par Lovable.
- [x] Confirmer la livraison GitHub — vérification hors de Lovable : `main` contient `a912595c95fbb3b31a6b021feb8f04cdeaa32d89` (« Added 9 docs, 2 governance ») ; README, état actuel et suivi lus directement.
- [x] Confirmer la branche distante `backup/pre-execution-2026-11-03` — créée avant la documentation depuis `a05116ed6e0471b0796a72577635ab01fd9fa78c` ; point de restauration du code initial, sans les nouveaux documents si elle n’a pas bougé, ni sauvegarde des données.
- [x] Cadrage stratégique validé — vision produit et décision 0003 documentées.

## Phase 1 — sécurisation et compréhension (en cours)

- [x] (a) Runtime identifié : base Lovable Cloud. Ouvert : deux projets Supabase externes inactifs non rapprochés (aucune action).
- [ ] (b) Réconcilier les migrations — en cours : 17/17 + 3/3 appariées ; écarts caractérisés et schéma comparé ; restent tâches planifiées hors migration (import non planifié) et test de `has_role` avec comptes réels.
- [ ] (c) Plan de sauvegarde — **procédure préparée, exécution non faite** ([backup-plan](docs/runbooks/backup-plan.md)).

Risques issus de (b) : robots d’import absents en base (import automatique non planifié) ; tâches planifiées créées ou retirées hors migration ; droit d’exécution de `has_role` à tester avec de vrais comptes.
- [ ] (d) Examiner le secret historique sans le révéler et préparer une rotation contrôlée séparée.

Aucune action sensible (migration, données, permissions, secret, connexion, paiement, publication) sans autorisation explicite.
## Sécurité production (4 nov. 2026)
- [x] backfill-images protégé + garde-fou de téléchargement (tests 25/25)
- [x] ingest / sync-cron-secret : jeton à temps constant, erreurs masquées ; sitemap sans accès élevé
- [x] `.gitignore` exclut `.env` ; `.env.example` (noms seulement)
- [x] Audit RLS lecture seule : docs/architecture/security-audit.md
- [ ] Propriétaire : branche de secours + protection de main ; retirer `.env` du dépôt GitHub
- [ ] Rotation CRON_SECRET (accord séparé)
- [ ] Restreindre la mise à jour de table_requests à `status` (migration, après snapshot + export)
- [ ] Revérifier les GRANT
