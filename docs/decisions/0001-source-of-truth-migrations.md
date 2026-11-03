# Décision 0001 — source de vérité des migrations

- Date : 3 novembre 2026 (mise à jour après rapprochement en lecture seule).
- Statut : **provisoire ; choix toujours suspendu, mais hypothèse privilégiée documentée**.
- Périmètre : changements de structure de la base Tonight FR (Lovable Cloud).

## Faits vérifiés (lecture seule)

Méthode : empreintes calculées sur les fichiers et sur le texte enregistré en base ; aucun contenu de migration affiché.

| Historique | Fichiers locaux | Lignes en base | Correspondance |
| --- | --- | --- | --- |
| `supabase/migrations` ↔ `supabase_migrations.schema_migrations` | 17 | 17 | 14 identiques ; 3 diffèrent de quelques octets |
| `drizzle/migrations` ↔ `drizzle.__drizzle_migrations` | 3 | 3 | 3 identiques (SHA-256 et dates égales) |

Matrice Supabase (préfixe fichier → version en base, statut) :

| Fichier | Version base | Statut |
| --- | --- | --- |
| 20260523121000 | 20260523120958 | identique |
| 20260523152315 | 20260523152314 | **différent** (fichier 2082 o / base 2071 o) |
| 20260523165623 | 20260523165621 | identique |
| 20260523165636 | 20260523165634 | identique |
| 20260523180458 | 20260523180456 | identique |
| 20260523192916 | 20260523192914 | identique |
| 20260525161359 | 20260525161358 | identique |
| 20260525175342 | 20260525175341 | **différent** (527 / 519) ; motif sensible signalé |
| 20260525180022 | 20260525180021 | **différent** (852 / 848) ; motif sensible signalé |
| 20260525180111 | 20260525180110 | identique |
| 20260525181620 | 20260525181619 | identique |
| 20260525185343 | 20260525185342 | identique |
| 20260602153114 | 20260602153112 | identique |
| 20260602153131 | 20260602153131 | identique |
| 20260622202001 | 20260622202000 | identique |
| 20260629181602 | 20260629181600 | identique |
| 20260705142611 | 20260705142613 | identique |

Matrice Drizzle : `0000_restrict_profiles_select`, `0001_table_requests` (crée `table_requests`), `0002_venue_portal` (crée `venues`) → lignes 1, 2, 3 du journal Drizzle, identiques.

Constats : aucun doublon, aucune migration locale non appliquée, aucune version en base sans fichier. `venues` et `table_requests` sont expliquées par le journal Drizzle. Les deux journaux se succèdent dans le temps sans chevauchement.

## Ce qui reste inconnu

- Les 3 écarts d’octets sont désormais caractérisés (empreintes normalisées, sans affichage) :
  - `20260523152315` et `20260525180022` : **commentaires/espacement uniquement**.
  - `20260525175342` : structure SQL identique ; la différence est **uniquement à l’intérieur de longues valeurs** (jeton ou adresse) — fichier à motif sensible, valeur non lue.
- Plusieurs tâches planifiées diffèrent des migrations (voir état actuel §5) : la base a été modifiée **hors migration** au moins pour les robots d’import et deux tâches de nettoyage.
- Comparaison détaillée du schéma réel (contraintes, index, fonctions, triggers, droits, politiques) avec la somme des migrations : non faite.
- Lien éventuel avec les deux projets Supabase externes inactifs : non démontré.

## Décision provisoire

**Aucune source de vérité n’est formellement retenue.** Hypothèse privilégiée, à confirmer : *le dossier `supabase/migrations` est un historique figé (archive) ; les nouveaux changements passent par `drizzle/migrations`, l’outil de migration Lovable qui alimente déjà le journal Drizzle.* Ne rien rejouer, ne pas fusionner ni corriger les journaux, ne pas remplir `drizzle/schema.ts`.

## Conditions pour clore

1. Expliquer les 3 écarts sans révéler de secret (comparaison masquée).
2. ✅ Schéma comparé ; restent à expliquer les tâches planifiées hors migration et le droit d’exécution de `has_role`.
3. Plan de sauvegarde vérifiable (étape c) et rotation du secret historique (étape d).
4. Remplacer cette décision par une décision finale signée par l’utilisateur.

## Conséquences

- Toute évolution de schéma ou de permissions reste bloquée sans autorisation explicite.
- GitHub conserve les fichiers, pas l’état réel des données.
