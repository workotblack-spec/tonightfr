# Décision 0001 — source de vérité des migrations

- Date : 3 novembre 2026.
- Statut : **provisoire ; choix suspendu**.
- Périmètre : changements de structure de la base Tonight FR.

## Contexte vérifié

Le dépôt contient 17 migrations SQL historiques dans `supabase/migrations/` et trois migrations SQL supplémentaires dans `drizzle/migrations/`. Le journal Drizzle local référence ces trois fichiers ; `drizzle/schema.ts` ne décrit aucune table.

La base accessible par Lovable contient `venues` et `table_requests`. Le journal `supabase_migrations.schema_migrations` interrogé ne comporte que 17 versions historiques, sans correspondance visible avec les trois migrations Drizzle. Des préfixes locaux et versions distantes diffèrent aussi de quelques secondes.

Le mécanisme ayant appliqué les changements supplémentaires **n’est pas établi**. Un autre journal peut exister ; son existence et son contenu restent à vérifier. Ne pas conclure qu’une migration manque, qu’il faut la rejouer ou que les changements auraient été manuels.

## Décision provisoire

**Aucune source de vérité de migration n’est choisie tant que l’écart entre les fichiers SQL historiques, Drizzle et l’historique réel n’est pas résolu.**

Ne pas générer de nouvelles migrations, rejouer un dossier, remplir le schéma vide, fusionner des journaux ou corriger leurs versions pendant cette étape.

Cette suspension est une mesure de sécurité, pas une décision d’abandonner l’un des outils.

## Conditions de résolution

1. Confirmer la correspondance entre Lovable Cloud, dépôt et environnements externes.
2. Inventorier en lecture seule l’historique complet, y compris tout journal Drizzle distant accessible.
3. Comparer le schéma réel, les contraintes, index, fonctions, triggers, permissions et politiques aux changements attendus, sans diffuser les secrets historiques.
4. Établir ce qui a été appliqué et ce qui ne l’a pas été avec des preuves ; marquer explicitement ce qui reste inconnu.
5. Préparer une sauvegarde dont la restauration pourra être vérifiée dans un environnement isolé autorisé.
6. Documenter une nouvelle décision : mécanisme retenu, registre de référence, règles de suivi, responsabilités et retour arrière.

## Conséquences

- La documentation et les investigations de lecture peuvent avancer.
- Toute évolution de schéma ou de permissions est bloquée.
- GitHub conserve du code et des fichiers SQL, **pas automatiquement l’état réel des données**.
- L’identification de l’environnement et le traitement du secret historique restent des prérequis distincts ; aucun de ces sujets ne justifie une opération d’écriture improvisée.