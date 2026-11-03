# Procédure de chaque changement

But : le fondateur doit pouvoir suivre, comprendre et refaire une étape sans confondre sauvegarde, test et publication.

## 1. Objectif et périmètre

Écrire le problème à résoudre, le résultat observable, les fichiers concernés, ce qui ne sera pas touché et le critère de réussite. Séparer un constat d’une hypothèse.

Pour cette session : créer le cadre documentaire uniquement. Les réparations de code et opérations de base restent hors périmètre.

## 2. Risque et autorisations

Classer le changement : document, affichage, logique, accès, données, secret ou publication. Indiquer l’environnement exact, les personnes affectées et les permissions nécessaires. Arrêter si l’environnement n’est pas identifié ou si les migrations divergent.

Les tâches techniques ordinaires ne nécessitent pas une nouvelle confirmation à chaque ligne. Les opérations sensibles ou hors périmètre ne sont jamais couvertes par une « carte blanche » générale.

## 3. Sauvegarde adaptée

- Noter le commit de départ et confirmer une référence de sauvegarde de code.
- Pour une opération de base future, prévoir une sauvegarde des données et sa procédure de restauration ; une branche GitHub ne suffit pas.
- Pour les secrets, préparer un plan de rotation et de retour contrôlé, sans copier leur valeur dans un document.

La branche de sauvegarde rapportée pour cette session est `backup/pre-execution-2026-11-03`, sur `a05116ed6e0471b0796a72577635ab01fd9fa78c`. Sa vérification distante reste à faire.

## 4. Lire, changer et examiner le diff

Lire les fichiers avant de les modifier. Faire un changement limité. Examiner la liste des fichiers et le diff (la comparaison avant/après). Vérifier qu’aucun fichier généré, secret, donnée personnelle ou modification annexe n’est inclus.

Pour une documentation nouvelle non encore suivie, `git diff` peut ne rien montrer : compléter par l’inventaire des nouveaux fichiers et leur lecture.

## 5. Contrôles et tests

| Nature du changement | Contrôle attendu |
| --- | --- |
| Documentation seule | Existence, liens locaux, cohérence, absence de secrets, périmètre du diff |
| Règle métier | Tests de valeurs et cas interdits, puis parcours concerné |
| Interface | Vérification réelle sur ordinateur et téléphone |
| Permissions | Au moins deux comptes indépendants et un compte non autorisé |
| Base | Schéma, données conservées, droits, migration et restauration en environnement adapté |

Ne jamais annoncer un test non exécuté. Noter les commandes, résultat, limites et état du compte utilisé, sans exposer les identifiants. Cette session ne lance ni tests applicatifs ni compilation.

## 6. Commit et synchronisation

Préférer un message lisible, par exemple : `docs: établir le cadre de référence Tonight FR`.

Dans Lovable, l’historique et les commits sont gérés par la plateforme. Ne pas exécuter de commandes Git modifiant l’historique, l’index ou les branches depuis l’agent. Si un outil autorisé permet un commit, noter le SHA retourné. Sinon, dire explicitement que le SHA nouveau n’est pas encore disponible.

Une sauvegarde locale, un commit, une synchronisation GitHub et une publication sont **quatre événements différents**. Confirmer chacun séparément. Pour GitHub, consulter l’état dans les réglages Git de Lovable et vérifier les documents dans le dépôt ; ne pas déduire la synchronisation du seul SHA local.

## 7. Vérification après changement

Contrôler que le résultat existe au bon endroit, que seules les modifications prévues apparaissent, et que l’état observé correspond au critère annoncé. Conserver les limites au journal. Une publication exige une demande explicite distincte.

## 8. Retour arrière (rollback)

Le retour arrière doit être prévu avant une opération sensible.

- **Documents** : revenir à une version connue via le mécanisme d’historique de Lovable ou une modification compensatrice relue ; ne pas supprimer arbitrairement des fichiers.
- **Code** : restauration contrôlée de la version connue, puis vérification de sa compatibilité avec les données actuelles.
- **Base** : procédure spécifique validée ; annuler du code ne remet pas automatiquement les données ni le schéma dans leur état précédent.
- **Secrets** : ne pas remettre en service une valeur connue comme exposée ; utiliser le plan sécurisé prévu.

Un retour arrière n’est jamais exécuté automatiquement sans vérifier l’effet sur les changements intervenus depuis le point de départ.

## Compte rendu minimal

Objectif réalisé ; fichiers ; références de départ et d’arrivée ; contrôles réellement faits ; tests non faits ; état de synchronisation ; risques restants ; prochaine étape. Mettre à jour le [suivi des phases](../learning-log/progress.md).