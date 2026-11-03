# Tonight FR — documentation de référence

État documentaire au **3 novembre 2026**. Cette première étape ajoute uniquement des documents : aucun code applicatif, aucune donnée et aucune configuration ne sont modifiés.

## Par où commencer ?

| Document | À quoi il sert |
| --- | --- |
| [État actuel](architecture/current-state.md) | Comprendre ce qui existe réellement, avec ses limites |
| [Vue cible proposée](architecture/target-overview.md) | Examiner le futur portail Pro et l’espace Promoteurs, sans les confondre avec l’existant |
| [Décision 0001 : migrations](decisions/0001-source-of-truth-migrations.md) | Comprendre pourquoi toute nouvelle migration attend |
| [Décision 0002 : autonomie](decisions/0002-venue-rules-autonomy.md) | Préserver le contrôle commercial des établissements |
| [Procédure de changement](runbooks/change-process.md) | Suivre et pouvoir refaire chaque changement |
| [Sécurité de la base](runbooks/database-safety.md) | Éviter de perdre des données ou d’ouvrir des accès indus |
| [Journal du 3 novembre](learning-log/2026-11-03.md) | Distinguer les actions effectuées des actions encore à faire |
| [Suivi des phases](learning-log/progress.md) | Voir les blocages et la prochaine étape |

## Méthode de travail

Chaque étape annonce un objectif et un périmètre. Elle explique les risques, montre les fichiers concernés, indique les contrôles réellement effectués et termine par une prochaine action précise. Le fondateur doit pouvoir comprendre le résultat et retrouver la procédure, pas seulement recevoir « c’est fait ».

Les documents utilisent cinq catégories :

- **Vérifié pendant cette session** : confirmé par une lecture locale ou une requête de lecture de métadonnées.
- **Rapporté dans le cadrage** : information donnée au démarrage, non revérifiée ici auprès du service concerné.
- **Proposition / hypothèse** : idée à examiner, pas une fonctionnalité livrée.
- **Décision à prendre** : choix encore ouvert, avec ses conditions de validation.
- **Risque / blocage** : raison explicite de ne pas avancer sur une opération sensible.

Un fichier présent ne prouve pas que sa fonction marche en ligne. Une protection RLS activée ne prouve pas que toutes ses règles sont correctes. Un site publié ne signifie pas une production validée.

## Où sont les éléments ?

- **Code et documentation** : projet Lovable et dépôt GitHub `workotblack-spec/tonightfr`. La vérification GitHub effectuée hors de Lovable confirme le commit documentaire `a912595c95fbb3b31a6b021feb8f04cdeaa32d89` sur `main` (« Added 9 docs, 2 governance »). Cette confirmation porte sur ce commit, pas sur les modifications ultérieures.
- **Données** : PostgreSQL accessible par Lovable Cloud. GitHub n’est pas une sauvegarde des données.
- **Secrets** : réglages sécurisés ; jamais dans les documents, les captures, les commits ou le chat.
- **Historique des modifications de base** : deux ensembles locaux et un journal distant à rapprocher ; aucune source de vérité n’est choisie à ce stade.

## Point de départ

Commit local confirmé : `a05116ed6e0471b0796a72577635ab01fd9fa78c` (« Ajouté bloc règles maison »).

La vérification GitHub effectuée hors de Lovable confirme l’existence de `backup/pre-execution-2026-11-03`, créée avant la documentation à partir du commit initial ci-dessus. C’est un point de restauration du code initial : si elle n’a pas bougé, elle ne contient pas les nouveaux documents. Une branche de code n’est ni un export de base ni une sauvegarde des secrets.

Les fichiers `docs/README.md`, `docs/architecture/current-state.md` et `docs/learning-log/progress.md` ont été lus directement sur `main` lors de cette vérification externe et leur contenu est présent. Cette vérification n’a pas été effectuée par l’agent Lovable.

## Limite de cette étape

Pas de migration, écriture de données, changement de permissions, rotation de secret, installation, paiement, connexion de service, publication ni construction de l’espace Promoteurs. Les anomalies sont consignées, pas corrigées ici.