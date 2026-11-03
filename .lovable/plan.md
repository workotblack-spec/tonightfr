# Analyse stratégique Tonight FR (lecture seule, aucune modification)

Légende des sources : [ÉCH] échanges · [CODE] vérifié dans le dépôt cette session · [EXT] benchmark (connaissance publique, non revérifiée en ligne cette session — à confirmer avant toute décision) · [REC] recommandation.

## 1. Vision et positionnement
« Tonight est le radar suisse de la sortie : où aller maintenant, près de moi, selon mon envie — et l'outil qui permet à chaque établissement de remplir ses soirées sans perdre la main sur ses règles et son argent. »
Positionnement [REC] : marketplace de découverte + SaaS établissement, nationale (26 cantons), multi-catégorie (bar, resto, rooftop, lounge, club), sans billetterie ni encaissement des consommations. Différenciateur : couverture locale y compris petites villes, et outils proportionnés aux petits lieux.

## 2. Mémoire : confirmé vs à confirmer
Confirmé [ÉCH] : 26 cantons + GPS ; humeur/compagnie (seul/accompagné) ; Pass membre ; validation à l'entrée en 2 modes (glissement visuel petits lieux, QR dynamique grands lieux) ; empêchement : transfert à un ami ET libération à la communauté (attente, notification, Karma) — les deux coexistent ; règles maison fixées par l'établissement ; Tonight encaisse uniquement les abonnements ; portail Pro géré par les établissements eux-mêmes ; démarche étape par étape et pédagogique ; gratuit au départ puis devis.
À confirmer [ÉCH] : prix, durée d'essai (14 j évoqué), Pass client payant ou non, commission « activité qualifiée » (assiette, taux, preuve), alertes email/SMS, acompte/carte en garantie (en tension avec la règle « pas d'encaissement » — à trancher : recommandé de l'exclure du MVP), périmètre promoteurs/ambassadeurs (mentionné, jamais spécifié). Chiffres Semrush et « aucun concurrent » cités plus tôt : non fiables, à refaire.

## 3. Existant réel [CODE]
- Opérationnel en code : découverte, explore, carte (Leaflet), fiche soirée, favoris, auth, radar cantons/rayons (tests unitaires), page /promouvoir (formulaire de demande + plans affichés, sans paiement), ingestion/sitemap (routes présentes, exécution planifiée non prouvée).
- Partiel : /pro (1 fiche par compte, UNIQUE owner_id), demandes VIP `table_requests` avec statuts ; zones codées en dur ; compteurs cumulés, pas un bilan daté ; HouseRules rattaché par nom (ilike) — fragile.
- Absent : Pass membre, validation QR/visuelle, transfert, liste d'attente, Karma, notifications, équipes/multi-sites, invitations, promoteurs, abonnements/facturation, consentements, vérification d'âge, journal d'audit.
- Gouvernance : migrations Supabase (17) et Drizzle (3) non réconciliées ; mapping environnements non clair ; secret historique à faire tourner.

## 4. Benchmark [EXT]
| Service | Mécanique clé | À reprendre |
|---|---|---|
| Discotech | Guestlist gratuite, demande de table, confirmation par le club | Guestlist = produit d'entrée simple ; table = demande à confirmer |
| SevenRooms | CRM invités, plan de salle, tags VIP, historique | Fiche client côté établissement, notes, no-show |
| Shotgun | Communauté, ambassadeurs à lien traçable, revente encadrée | Liens ambassadeurs mesurés ; transfert officiel anti-marché noir |
| DICE | Recommandations, waitlist officielle, billet lié au téléphone | Waitlist = notre « libérer sa place » ; pass non capturable |
| RA Guide | Agenda curaté, suivre artistes/lieux, amis | Suivre un lieu, voir où vont les amis (opt-in) |
| Fever | Curation d'expériences, expansion ville par ville | Lancer ville par ville avec densité avant d'élargir |
Suisse/Europe à étudier : Petzi, Starticket/Ticketcorner, Eventfrog, ra.co CH, Instagram des clubs (concurrent réel n°1). Enseignement : aucun ne gagne sans densité locale d'offre ; commencer par 1–2 villes pilotes malgré l'ambition nationale.

## 5. Architecture cible [REC]
```text
App client : radar · fiche · favoris · Pass/guestlist · demandes table · wallet · waitlist
Portail Pro : organisation → établissements → membres (owner/manager/door) → soirées, règles, zones, demandes, CRM léger, bilans
Promoteurs : mandat (lieu, soirée, période) → lien traçable → stats agrégées (pas d'accès aux contacts)
Admin Tonight : validation des lieux, modération, abonnements, support
Socle : auth, user_roles (global) + venue_members (local), RLS testée multi-comptes, audit log, consentements
```
Clés : `events.venue_id` (ajout nullable, backfill), relation compte↔lieu par appartenance, jamais par nom.

## 6. Priorisation
| Niveau | Fonction | Valeur | Complexité | Dépend de |
|---|---|---|---|---|
| Socle | Migrations réconciliées, rotation secret | critique | moyenne | — |
| MVP | venue_id + multi-sites + membres | haute | moyenne | socle |
| MVP | Zones configurables, bilan daté, notifications in-app | haute | faible | venue_id |
| MVP | Guestlist/Pass gratuit + validation visuelle | haute | moyenne | multi-sites |
| V2 | QR dynamique, transfert, waitlist + Karma | haute | élevée | Pass |
| V2 | Abonnements établissements (Stripe) | haute | moyenne | portail stable |
| V2 | Promoteurs avec mandats et liens | moyenne | moyenne | multi-sites |
| Plus tard | Pass client payant, amis, recommandations, CRM avancé, app native | variable | élevée | traction |

## 7. Modèle économique
Établi [ÉCH] : abonnement établissement encaissé par Tonight ; tables/consommations/entrées encaissées par le lieu.
Hypothèses : gratuit au lancement ; options de visibilité (is_promoted existe en base) ; Pass client ; commission sur activité qualifiée — nécessite une définition vérifiable (ex. arrivée validée) et un contrat ; ne pas lancer avant preuve de valeur.

## 8. Parcours
- Client : ouvre l'app → GPS/canton → humeur + date → fiche lieu (règles visibles) → guestlist ou demande de table → pass dans le wallet → validation à la porte → si empêché : transférer ou libérer (waitlist notifiée, Karma).
- Établissement : inscription → validation admin → création organisation/lieux → invite équipe → règles, zones, soirées → traite demandes → porte valide les pass → bilan du lendemain daté.
- Promoteur : invité par un lieu → mandat limité → lien personnel → stats d'arrivées agrégées → fin automatique du mandat.

## 9. Risques et gouvernance
Migrations divergentes (risque de rejeu) ; RLS non testée multi-comptes ; rattachement par nom ; unicité owner_id bloquante ; ingestion : droits des images et fraîcheur ; secret historique. Règle : changements additifs uniquement, colonnes dépréciées commentées, aucune suppression.

## 10. Conformité Suisse (références, sans conclusion juridique)
- LPD/nLPD (RS 235.1) et OPDo (RS 235.11) : fedlex.admin.ch ; guides PFPDT edoeb.admin.ch — information, finalité, consentement géoloc/marketing, durée de conservation, registre.
- Alcool : Loi sur l'alcool (RS 680) art. 41–42b (publicité spiritueux restreinte) ; ODAlOAl ; vente : bière/vin dès 16 ans, spiritueux dès 18 ans (LDAl RS 817.0, ODAIOUs) ; OFSP/OFDF.
- Règles cantonales : lois sur l'hôtellerie/restauration et heures d'ouverture (ex. GE LRDBHD, VD LADB, FR LEPu) à vérifier par canton.
- Publicité/consommateur : LCD (RS 241) prix et promotions trompeuses ; OIP indication des prix.
- QR/anti-fraude : jeton signé à durée courte, lié au compte, usage unique, journal des validations ; pas de donnée personnelle dans le QR.
- Consentements : opt-in séparés (géoloc, notifications, marketing), retrait facile.
Avis d'un juriste suisse requis avant lancement payant.

## 11. Plan séquencé (aucun code avant validation)
1. Lecture seule : mapping environnements + rapprochement migrations → décision 0001 finalisée.
2. Rotation contrôlée du secret ; sauvegarde vérifiable des données.
3. Conception multi-sites (venue_id, membres) + tests RLS à deux équipes.
4. Implémentation additive, puis tests navigateur avec vrais comptes client/patron/porte.
5. Pass gratuit + validation visuelle ; pilote 1 ville, 3–5 lieux.
6. QR, transfert, waitlist/Karma ; puis abonnements ; puis promoteurs.
Chaque étape : doc pédagogique (image simple), décision écrite, test réel, journal d'apprentissage.

Action fondateur immédiate : choisir la ville pilote et lister 5 établissements prêts à tester ; confirmer s'il faut exclure tout acompte du MVP.
