# Suivi des phases Tonight FR

Mis à jour le **3 novembre 2026**. « Validé » s’applique seulement au périmètre précisé, pas à l’ensemble de l’application.

| Phase | Statut | Résultat attendu / état exact | Condition de sortie |
| --- | --- | --- | --- |
| 0 — Cadre documentaire local | validé | Neuf documents créés ; liens, formats sensibles recherchés et périmètre Markdown contrôlés | Validation limitée aux documents locaux, pas à la production |
| 0.1 — Référence de code locale | validé | SHA de départ confirmé ; état local propre avant ajout | `a05116ed6e0471b0796a72577635ab01fd9fa78c` |
| 0.2 — Sauvegarde et livraison GitHub | validé | Vérification hors de Lovable : `main` contient `a912595c95fbb3b31a6b021feb8f04cdeaa32d89` (« Added 9 docs, 2 governance ») ; README, état actuel et suivi lus directement ; branche backup existante | Validation de ce commit documentaire, pas des modifications suivantes |
| 1 — Identification des environnements | bloqué | Mapping Lovable Cloud / configuration / compte externe incertain | Correspondance prouvée en lecture seule, sans réactivation |
| 2 — Rapprochement des migrations | bloqué | 17 historiques et 3 Drizzle ; source de vérité suspendue | Historique complet et schéma réel rapprochés, décision 0001 remplacée |
| 3 — Secret historique et sauvegarde de données | bloqué | Exposition rapportée ; aucune rotation ou restauration testée | Environnement identifié, plan autorisé, rotation contrôlée et sauvegarde vérifiable |
| 4 — Conception Pro multi-établissements | à faire | Vue cible proposée seulement | Modèle et permissions approuvés après levée des blocages |
| 5 — Construction Pro progressive | à faire | Portail mono-propriétaire existant, pas encore évolution multi-lieux | Changements autorisés, additifs et vérifiés avec des comptes distincts |
| 6 — Conception et construction Promoteurs | à faire | Aucun portail dédié existant ou créé dans cette étape | Mandats, périmètres de données et permissions décidés avant construction |
| 7 — Validation complète | à faire | Site publié ne veut pas dire production validée | Parcours réels, sécurité, accessibilité, conformité et exploitation vérifiés |
| 8 — Mise en ligne validée | à faire | Aucune publication dans cette session | Autorisation explicite après validation |

## Prochaine action

**Cadrage stratégique validé** : voir [vision produit](../product/vision.md) et [décision 0003](../decisions/0003-product-vision-and-roles.md).

**Phase 1 — sécurisation et compréhension : en cours.** Prochaines actions :

1. (a) Identifier précisément la base Lovable Cloud et les environnements liés au dépôt.
2. (b) Réconcilier l’historique des migrations Supabase et Drizzle, sans exécuter de migration.
3. (c) Préparer un plan de sauvegarde vérifiable.
4. (d) Examiner le secret historique sans le révéler et préparer une rotation contrôlée séparée.

Aucune action sensible n’est faite sans autorisation explicite.

La branche `backup/pre-execution-2026-11-03` a été créée avant la documentation depuis `a05116ed6e0471b0796a72577635ab01fd9fa78c`. Elle constitue un point de restauration du code initial, sans les nouveaux documents si elle n’a pas bougé ; elle ne sauvegarde pas les données.

## Ce qui ne bloque pas

Lire et améliorer la documentation pédagogique. Expliquer l’existant et les choix ouverts. Ne pas contourner les blocages en créant une autre base ou en connectant un service.

## Ce qui reste interdit maintenant

Migrations, modifications de données ou permissions, rotation de secrets, activation de projets, installations, construction Promoteurs, paiements, nouvelles connexions et publication.