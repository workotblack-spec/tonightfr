# Suivi des phases Tonight FR

Mis à jour le **3 novembre 2026**. « Validé » s’applique seulement au périmètre précisé, pas à l’ensemble de l’application.

| Phase | Statut | Résultat attendu / état exact | Condition de sortie |
| --- | --- | --- | --- |
| 0 — Cadre documentaire | en cours | Documents créés ; contrôles locaux à consigner dans le compte rendu | Liens et périmètre vérifiés ; réception GitHub confirmée séparément |
| 0.1 — Référence de code locale | validé | SHA de départ confirmé ; état local propre avant ajout | `a05116ed6e0471b0796a72577635ab01fd9fa78c` |
| 0.2 — Sauvegarde et livraison GitHub | bloqué | Branche distante rapportée, non vérifiée ici ; nouveau SHA non observé | Vérifier référence et documents sur `workotblack-spec/tonightfr` |
| 1 — Identification des environnements | bloqué | Mapping Lovable Cloud / configuration / compte externe incertain | Correspondance prouvée en lecture seule, sans réactivation |
| 2 — Rapprochement des migrations | bloqué | 17 historiques et 3 Drizzle ; source de vérité suspendue | Historique complet et schéma réel rapprochés, décision 0001 remplacée |
| 3 — Secret historique et sauvegarde de données | bloqué | Exposition rapportée ; aucune rotation ou restauration testée | Environnement identifié, plan autorisé, rotation contrôlée et sauvegarde vérifiable |
| 4 — Conception Pro multi-établissements | à faire | Vue cible proposée seulement | Modèle et permissions approuvés après levée des blocages |
| 5 — Construction Pro progressive | à faire | Portail mono-propriétaire existant, pas encore évolution multi-lieux | Changements autorisés, additifs et vérifiés avec des comptes distincts |
| 6 — Conception et construction Promoteurs | à faire | Aucun portail dédié existant ou créé dans cette étape | Mandats, périmètres de données et permissions décidés avant construction |
| 7 — Validation complète | à faire | Site publié ne veut pas dire production validée | Parcours réels, sécurité, accessibilité, conformité et exploitation vérifiés |
| 8 — Mise en ligne validée | à faire | Aucune publication dans cette session | Autorisation explicite après validation |

## Prochaine action

Vérifier d’abord la réception documentaire sur GitHub, puis effectuer un inventaire **de lecture uniquement** du mapping des environnements et des journaux de migrations complets. Préparer ensuite le traitement urgent du secret dans une étape distincte et autorisée.

## Ce qui ne bloque pas

Lire et améliorer la documentation pédagogique. Expliquer l’existant et les choix ouverts. Ne pas contourner les blocages en créant une autre base ou en connectant un service.

## Ce qui reste interdit maintenant

Migrations, modifications de données ou permissions, rotation de secrets, activation de projets, installations, construction Promoteurs, paiements, nouvelles connexions et publication.