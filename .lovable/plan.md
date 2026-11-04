# Plan technique : sécurité et préparation production de Tonight FR

Statut : plan seulement. Rien n'a été modifié. Chaque lot ci-dessous attend votre accord avant d'être fait.

## Constats vérifiés en lecture (4 novembre 2026)

- `.gitignore` n'exclut ni `.env` ni `.env.*`.
- `.env` contient seulement 6 **noms** de variables : l'identifiant du projet, l'adresse de la base et la clé publique (côté navigateur et côté serveur). Aucune clé `service_role`, aucun `CRON_SECRET`. Ces valeurs sont déjà envoyées à chaque visiteur dans le code du site : le risque est réel mais **modéré**. Les vraies protections, ce sont les règles d'accès (RLS) et les secrets côté serveur.
- 4 fichiers utilisent `supabaseAdmin` : `api/public/backfill-images.ts` (GET, **aucune vérification de l'appelant**), `api/public/ingest.ts` (vérifie `CRON_SECRET`), `api/public/sync-cron-secret.ts` (vérifie `CRON_SECRET`, écrit dans le coffre Vault), `api/sitemap[.]xml.ts` (lecture publique avec accès élevé).
- `ingest.ts` et `sync-cron-secret.ts` comparent le secret avec `===`. Une comparaison à temps constant serait plus sûre.

## Ordre des lots

```text
L0 point de départ -> L1 .env -> L2 backfill-images -> L3 autres routes
-> L4 audit RLS/GRANT (lecture) -> L5 tests -> L6 rotation (séparée) -> L7 publication (séparée)
```

### L0. Protéger le code (pas d'écriture d'historique)
- Vous, sur GitHub : créer `backup/pre-security-2026-11-04` sur `5ee54bb…` et activer la protection de `main` (pas de force-push, pas de suppression). La branche `backup/pre-execution` reste un point plus ancien.
- Moi : noter le SHA de départ dans le journal.
- Validation : la branche est visible sur GitHub, et la protection est active.

### L1. Arrêter le suivi de `.env` (code)
- Ajouter `.env`, `.env.*` et `!.env.example` à `.gitignore`. Créer `.env.example` avec les **noms** seulement.
- Limite : Lovable génère et gère `.env` lui-même. Le retirer de Git demande une action « untrack » que je ne peux pas faire sans commande Git interdite. À trancher : (a) vous le retirez via GitHub (supprimer le fichier du dépôt, mais pas du projet Lovable) après avoir vérifié que l'aperçu fonctionne encore ; ou (b) on accepte qu'il reste, puisqu'il ne contient que des valeurs publiques. Je recommande (a), testé d'abord sur une branche.
- Historique : **pas de réécriture** maintenant. Le nettoyage (git filter-repo/BFG plus force-push) se fera plus tard, sur décision séparée, et ne sert à rien sans rotation. La clé publique n'a pas besoin d'être tournée en urgence. Le vrai sujet urgent, c'est `CRON_SECRET` (L6).
- Validation : `git ls-files .env` est vide côté GitHub, et l'aperçu et le site se connectent toujours.

### L2. Refaire `backfill-images` (code)
Fichiers : `src/routes/api/public/backfill-images.ts`, plus un nouveau module `src/lib/safe-fetch.ts` et ses tests `src/lib/safe-fetch.test.ts`.
- **Appelant :** passer en POST, avec un en-tête Bearer comparé à `CRON_SECRET` à temps constant. Sans secret valide ou sans secret configuré, la route répond 401 sans détail.
- **Domaines autorisés :** liste fixe de billetteries (à confirmer avec vous à partir des `ticket_url` existants, en lisant seulement les noms de domaine). HTTPS uniquement, port 443 uniquement, pas d'identifiants dans l'URL.
- **Adresses privées :** refus des IP littérales et des noms locaux (`localhost`, `.local`, `.internal`), des plages privées et réservées (IPv4 et IPv6, y compris 169.254/métadonnées, `::ffff:`, CGNAT). Le serveur (Cloudflare Workers) ne permet pas de choisir la résolution DNS : la liste de domaines autorisés est donc le rempart principal.
- **Redirections :** `redirect: "manual"`, 3 sauts au plus, chaque `Location` revalidé avec les mêmes règles.
- **Limites :** 5 s par requête, 512 Ko lus au plus (lecture en flux, puis coupure), `content-type` en `text/html` obligatoire, 20 événements par appel au plus, traitement un par un, et l'ensemble des appels limité (au plus une exécution par période, via un horodatage en base : à valider, car cela demande une colonne, donc une migration, donc un report possible).
- **Image extraite :** même validation (HTTPS, domaine non privé, longueur ≤ 2048, extension ou chemin plausible). L'écriture se fait seulement si `image_url` est encore vide (`.is("image_url", null)` dans l'UPDATE) et seulement sur la ligne lue.
- **Réponses :** compteurs seulement (`scanned`, `updated`, `skipped`). Pas de message d'erreur interne ni d'URL. Les détails vont dans les journaux serveur, sans secret.
- Tests : URL refusées (http, IP privée, IPv6 mappée, domaine hors liste, redirection vers 127.0.0.1, réponse trop grosse) et appel sans jeton refusé.

### L3. Autres routes à accès élevé (code)
- `ingest.ts`, `sync-cron-secret.ts` : comparaison à temps constant, erreurs génériques, validation Zod des entrées, et vérification que `ingest` n'appelle pas d'URL non contrôlées (réutiliser `safe-fetch` si c'est le cas).
- `sitemap[.]xml.ts` : remplacer l'accès élevé par le client public avec la lecture publique existante sur `events` et `venues` (sous réserve de L4).
- Validation : `rg supabaseAdmin src` ne liste plus que les routes protégées par un secret.

### L4. Audit RLS/GRANT (lecture seule, aucun changement)
- SELECT sur `pg_policies`, `information_schema.role_table_grants`, `pg_proc` (droits d'exécution, dont `has_role`), et lancer le linter et le scan de sécurité.
- Pour chacune des 7 tables : qui peut lire, écrire, modifier quelles colonnes. Rédiger le rapport dans `docs/architecture/security-audit.md`.
- Toute correction devient un plan de migration **séparé**, déclenché seulement après un snapshot vérifié et un export (runbook backup-plan). `has_role` n'est pas modifié sans test avec plusieurs comptes.

### L5. Tests et critères de publication
- Tests unitaires `bunx vitest run` (existants et nouveaux), contrôle du build automatique, lint `bunx eslint .`, `security--dependency_scan`.
- Tests HTTP en local : backfill sans jeton → 401, avec un faux jeton → 401, sitemap → 200.
- Tests d'accès : visiteur, compte simple et compte admin sur `/pro`, `/admin`, favoris et demandes de table (sessions de test, sans afficher d'identifiants).
- **Publication autorisée seulement si :** build OK, tests verts, aucune route publique à accès élevé sans contrôle, scan sans faille critique ou élevée non expliquée, et votre accord écrit.

### L6. Rotation des secrets (opération séparée)
- `CRON_SECRET` : nouvelle valeur générée via l'outil sécurisé (jamais dans le chat), puis synchronisation Vault par `sync-cron-secret`, et vérification que les tâches planifiées existantes lisent la valeur dans Vault. On vérifie ensuite que l'ancienne valeur est refusée. À coordonner avec la décision sur le retour de l'import automatique.
- La clé publique et `service_role` sont gérées par Lovable Cloud : pas de rotation manuelle possible ni nécessaire pour la clé publique.

### L7. Publication : demande explicite distincte.

## Qui fait quoi

| Action | Qui | Condition |
| --- | --- | --- |
| Branche de secours et protection de `main` | Propriétaire (GitHub) | Avant L1 |
| Retrait de `.env` du suivi Git, réécriture d'historique | Propriétaire | Décision séparée |
| L1 à L3, L5, docs | Lovable (consomme des crédits) | Votre accord sur ce plan |
| L4 audit | Lovable, lecture seule | Aucun |
| Correction RLS/GRANT, colonne de limitation | Migration | Snapshot et export vérifiés, plan séparé |
| Rotation `CRON_SECRET` | Lovable avec votre accord | Confirmation séparée |
| Publication | Vous | Critères L5 remplis |
| Projets Supabase externes inactifs | Personne | Ne jamais réactiver |

## Risques
- Retirer `.env` peut casser l'aperçu si Lovable s'appuie sur la version suivie : à tester sur une branche d'abord.
- Une liste de domaines trop stricte réduit le nombre d'images remplies, mais l'image locale de secours reste affichée.
- Passer backfill en POST avec secret casse tout appel planifié existant vers ce GET : vérifier `cron.job` (noms seulement) avant.
- La rotation de `CRON_SECRET` interrompt l'import si Vault n'est pas synchronisé.

## Décisions à prendre avant le build
1. Option (a) ou (b) pour `.env`.
2. La liste des domaines de billetterie autorisés (je la proposerai d'après les noms de domaine en base).
3. La limitation de fréquence dès maintenant (migration) ou plus tard (limite par appel seulement).
