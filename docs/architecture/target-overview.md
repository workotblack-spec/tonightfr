# Architecture cible proposée — Pro et Promoteurs

**Statut : proposition, non implémentée.** Date : 3 novembre 2026.

## Objectif pour le fondateur

Un patron doit gérer ses établissements et son équipe, sans vous demander de saisir ses soirées. Un promoteur doit préparer et suivre ses opérations depuis Tonight, sans recevoir automatiquement les droits du patron sur tous les contacts et réservations.

Image simple : un compte est une personne ; un établissement est un lieu ; une appartenance est la clé qui autorise cette personne à entrer dans certaines pièces. Aujourd’hui, le code confond en partie personne et lieu par `owner_id`.

## Vue d’ensemble envisagée

```text
Membre → radar suisse → soirée → demande de table → décision de l’établissement
                              ↑
Équipe Pro → établissement sélectionné → fiche, règles, soirées, réservations
                              ↑
Promoteur → opération autorisée → événements et résultats limités à son mandat

Authentification → droits par établissement / mandat → accès contrôlé aux données
```

Il s’agit de deux espaces intégrés à la même application existante, pas d’un nouveau site WordPress ou d’un déploiement parallèle choisi d’avance.

## Briques à étudier

| Brique proposée | Résultat attendu | Écart avec l’existant |
| --- | --- | --- |
| Plusieurs établissements par compte | Sélectionner et gérer chaque lieu séparément | `venues.owner_id` est actuellement unique |
| Appartenances et invitations | Patron, responsable, accueil avec droits limités au lieu | Aucune table de memberships observée |
| Lien explicite soirée → établissement | Utiliser les bonnes règles maison et réservations | `events.owner_id` rattache aujourd’hui au compte |
| Tables et disponibilités du lieu | Zones et conditions réellement configurées | Zones fixes ; pas d’inventaire de tables démontré |
| Mandats Promoteurs | Campagne ou soirée autorisée, durée et droits délimités | `promo_requests` est seulement une demande de promotion |
| Bilans datés | Résultats par soirée et établissement | Compteurs actuels cumulés |
| Traçabilité | Comprendre qui a modifié une règle ou un statut | Historique métier complet non démontré |

Les noms de futures tables, leurs colonnes, contraintes et droits restent **à décider**. Aucune migration ne découle automatiquement de cette proposition.

## Principes proposés pour les permissions

- Garder les rôles dans une structure protégée séparée du profil.
- Distinguer un rôle général du compte et un droit local à un établissement.
- Vérifier les autorisations côté données/serveur, pas par une valeur modifiable dans le navigateur.
- Limiter l’accueil aux informations nécessaires au contrôle des arrivées ; limiter le promoteur aux opérations expressément autorisées.
- Refuser par défaut les accès non attribués ; tester que deux équipes indépendantes ne voient pas leurs réservations respectives.
- Prévoir retrait d’accès, départ d’un collaborateur et expiration d’un mandat.

## Autonomie et argent

Chaque établissement choisit ses règles commerciales dans les limites légales : tenue, vestiaire, arrivée, conditions VIP, zones et offres. Tonight apporte les outils, la sécurité et les permissions ; il n’impose pas les montants ou avantages. Voir [décision 0002](../decisions/0002-venue-rules-autonomy.md).

Tonight encaisse ses abonnements selon le modèle à confirmer. **Il n’encaisse pas les tables, bouteilles, consommations, vestiaires ou entrées de l’établissement.** La réservation reste une mise en relation. Cette distinction ne dispense pas d’une analyse juridique suisse : information du client, données personnelles, règles cantonales, contrats et responsabilités restent à vérifier avec des sources officielles et un professionnel compétent.

## Questions ouvertes

1. Un groupe de lieux nécessite-t-il une organisation distincte, ou des appartenances par lieu suffisent-elles ?
2. Qui peut inviter, transférer la responsabilité d’un lieu et révoquer une équipe ?
3. Quels contacts et chiffres un promoteur doit-il réellement consulter ?
4. Comment conserver les conditions vues au moment d’une demande si le patron les modifie ensuite ?
5. Comment présenter disponibilité, confirmation, annulation et absence sans promettre une table garantie ?
6. Quelles durées de conservation et quelles obligations suisses appliquer aux données et aux offres ?

## Ordre envisagé, après levée des blocages

1. Identifier les environnements et rapprocher l’historique des migrations, en lecture seule.
2. Préparer une sauvegarde de données vérifiable et traiter le secret historique dans une étape contrôlée.
3. Décider la source de vérité des migrations et valider le modèle multi-établissements ainsi que ses permissions.
4. Concevoir puis tester l’évolution Pro avec une stratégie additive compatible avec les données existantes.
5. Définir les mandats Promoteurs, puis seulement autoriser leur construction.
6. Vérifier les parcours réels, l’accessibilité, la conformité, l’exploitation et le référencement avant une mise en ligne validée.

**Interdiction actuelle :** commencer la construction Promoteurs, choisir une migration par défaut ou connecter un paiement pour contourner les blocages.