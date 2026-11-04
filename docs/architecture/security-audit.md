# Audit de sécurité (lecture seule) — 4 novembre 2026

Aucune modification de base. Lecture de `pg_policies`, des droits d'exécution des fonctions et des routes serveur.

## Routes à accès élevé (après correction de code du 4/11)

| Route | Protection | Remarque |
| --- | --- | --- |
| `POST /api/public/backfill-images` | Jeton `CRON_SECRET` (temps constant) | Ancien GET public supprimé. Domaines autorisés, HTTPS, pas d'IP, 3 redirections revalidées, 5 s, 512 Ko, 20 événements, écriture seulement si l'image est vide. Aucune tâche planifiée ne l'appelait. |
| `POST /api/public/ingest` | Jeton `CRON_SECRET` (temps constant) | Les pages de billetterie passent maintenant par le même garde-fou ; erreurs internes masquées. |
| `POST /api/public/sync-cron-secret` | Jeton `CRON_SECRET` (temps constant) | Écrit dans Vault. |
| `GET /api/sitemap.xml` | Publique | N'utilise plus l'accès élevé : client public et lecture publique des événements. |

Vérifié en local : backfill sans jeton → 401, faux jeton → 401, ingest sans jeton → 401, sitemap → 200. Tests unitaires : 25/25.

## Politiques RLS observées

- `events`, `venues` : lecture publique ; écriture par le propriétaire (et admin pour events).
- `favorites`, `profiles` : propriétaire seulement (profils lisibles aussi par admin).
- `promo_requests` : dépôt ouvert avec contrôles de longueur ; lecture par admin ou par l'auteur.
- `user_roles` : écriture admin seulement ; lecture de ses propres rôles.
- `table_requests` : création par l'utilisateur (statut `pending`, 1 à 30 invités) ; lecture par l'auteur, l'admin ou le propriétaire de la soirée.

## Points à traiter (chacun = plan séparé, après snapshot et export)

1. **`table_requests`, mise à jour par l'organisateur** : la règle vérifie seulement le statut final. L'organisateur pourrait aussi modifier d'autres colonnes (contact, nombre d'invités, `user_id`, `event_id`). Correction proposée : n'autoriser que la colonne `status`, via une fonction dédiée ou un déclencheur.
2. **Droits de table (GRANT)** : ma requête ne renvoie aucun droit explicite pour `anon` et `authenticated`. Ce résultat contredit le bon fonctionnement de l'app, donc il faut le revérifier avec une autre méthode (`has_table_privilege`) avant de conclure.
3. `has_role`, `handle_new_user`, `sync_cron_secret_to_vault` : pas exécutables par `anon` (conforme). Aucun changement sans test multi-comptes.
4. `ingest.ts` et `sync-cron-secret.ts` importent encore l'accès élevé au niveau du module. Il faut le charger à l'intérieur du gestionnaire (petit refactor de code).

## Encore ouvert (hors code)
- Retirer `.env` du suivi Git (propriétaire, sur GitHub). `.gitignore` l'exclut désormais, et `.env.example` liste les noms seulement.
- Rotation contrôlée de `CRON_SECRET` : opération séparée.
- Branche `backup/pre-security-2026-11-04` et protection de `main` : propriétaire.
