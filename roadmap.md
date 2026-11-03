# Tonight FR — feuille de route active

- [x] Vérifier en lecture seule la référence locale, les tables, RLS, rôles et contrainte propriétaire.
- [x] Créer les neuf documents de référence français et les règles documentaires de gouvernance.
- [x] Contrôler les liens, le périmètre des fichiers créés et l’absence de formats sensibles recherchés.
- [x] Observer un commit documentaire local créé automatiquement par Lovable.
- [x] Confirmer la livraison GitHub — vérification hors de Lovable : `main` contient `a912595c95fbb3b31a6b021feb8f04cdeaa32d89` (« Added 9 docs, 2 governance ») ; README, état actuel et suivi lus directement.
- [x] Confirmer la branche distante `backup/pre-execution-2026-11-03` — créée avant la documentation depuis `a05116ed6e0471b0796a72577635ab01fd9fa78c` ; point de restauration du code initial, sans les nouveaux documents si elle n’a pas bougé, ni sauvegarde des données.
- [x] Cadrage stratégique validé — vision produit et décision 0003 documentées.

## Phase 1 — sécurisation et compréhension (en cours)

- [x] (a) Runtime identifié : base Lovable Cloud. Ouvert : deux projets Supabase externes inactifs non rapprochés (aucune action).
- [ ] (b) Réconcilier les migrations — en cours : 17/17 + 3/3 appariées ; restent 3 écarts d’octets à expliquer et schéma réel à comparer.
- [ ] (c) Préparer un plan de sauvegarde vérifiable.
- [ ] (d) Examiner le secret historique sans le révéler et préparer une rotation contrôlée séparée.

Aucune action sensible (migration, données, permissions, secret, connexion, paiement, publication) sans autorisation explicite.