# Vision produit Tonight FR

Date : 3 novembre 2026. Statut : **direction approuvée** ([décision 0003](../decisions/0003-product-vision-and-roles.md)). Ce document décrit une cible ; il ne certifie aucune fonction existante. Pour l’existant, voir [l’état actuel](../architecture/current-state.md).

## Positionnement

Plateforme suisse de découverte de sorties et de services nightlife, associée à un SaaS (logiciel par abonnement) pour les établissements.

## Les espaces

| Espace | Rôle visé | État |
| --- | --- | --- |
| App client | Radar et recherche locale à l’échelle suisse ; découverte par localisation, date et ambiance ; clubs, bars, restaurants, rooftops, lounges et autres expériences ; favoris ; Pass Membre ; avantages ; demandes de réservation | Radar, recherche, carte, favoris et demande de table existent partiellement ; Pass et avantages absents |
| Portail établissements | Chaque lieu gère sa fiche, ses événements, ses règles, ses disponibilités, ses demandes et ses clients ; il fixe prix et conditions, accepte ou refuse, et **encaisse directement** tables et consommations | Portail mono-propriétaire partiel (`/pro`) |
| Promoteurs / ambassadeurs | Évoqué dans l’historique | **Périmètre à définir avant toute réalisation** |
| Administration Tonight | Validation, modération, assistance, gestion de la plateforme | Page `/admin` partielle |

Tonight n’encaisse pas les tables, bouteilles, consommations ou entrées à la place des établissements.

## Pass Membre — vision discutée

Les échanges évoquent : un Pass dans l’espace membre, un contrôle à l’entrée (glissement visuel pour petits lieux, QR dynamique pour grands lieux), et en cas d’empêchement deux options coexistantes : transfert à un ami ou libération à la communauté avec liste d’attente, notification et points de réputation (Karma).

**Ce n’est ni une fonction existante ni une spécification finale.**

## Revenus — pistes, rien n’est figé

- Abonnements des établissements : piste confirmée dans les échanges ; prix et formules à définir.
- Abonnement client : évoqué ; avantages et prix à préciser.
- Commission sur activité qualifiée : évoquée ; taux, assiette et preuve contractuelle **non confirmés** (aucun taux, y compris 1 %, n’est retenu).
- Mise en avant payante : à évaluer.

## Inspiration internationale

Discotech, SevenRooms, Shotgun, DICE, RA Guide, Fever. On s’inspire de **mécanismes** (guestlist, CRM établissement, ambassadeurs, liste d’attente officielle, suivi de lieux, expansion ville par ville), jamais des marques, contenus ou code. La densité et la fiabilité de l’offre locale sont le facteur critique : une app de sortie vide ne retient personne.

## Principes

- Suisse entière comme ambition ; lancement par zones pilotes.
- Outils adaptés aux petits comme aux grands établissements.
- Confidentialité, sécurité, conformité suisse et autonomie des lieux.
- Chaque fonction ou recommandation doit apporter une valeur mesurable.

## Comprendre en images

- **SaaS multi-tenant** : un immeuble, plusieurs locataires. Tous les établissements utilisent le même logiciel, mais chacun n’a la clé que de son appartement : ses réservations et clients restent invisibles aux autres.
- **App client vs portail Pro** : la vitrine et l’arrière-boutique. Le client voit et demande ; l’établissement décide et gère.
- **Prix et encaissement chez l’établissement** : c’est son comptoir et sa caisse. Tonight fournit l’agenda et la porte d’entrée ; il ne tient pas la caisse, ce qui laisse au lieu sa liberté commerciale et évite à Tonight de manipuler l’argent des autres.
- **Sécuriser les migrations d’abord** : avant d’agrandir une maison, on vérifie le plan réel des fondations. Changer la base sans savoir quels changements ont déjà été appliqués risque de casser ou dupliquer des données.
