---
name: tonight-manager
description: Pilotage global de TONIGHT FR (agenda nocturne Fribourg/Bulle/Lausanne). À utiliser pour toute évolution produit, publication de soirées, Espace Pro des clubs, agenda, facturation ou vérification avant mise en ligne.
---

# Tonight FR — Pilotage produit

## Règles métier
- Tonight encaisse uniquement les abonnements B2B des établissements. Tables, bouteilles et consommations se paient directement au club.
- Chaque club gère lui-même sa fiche, ses soirées et ses demandes de tables VIP depuis l'Espace Pro (/pro).
- Jamais de dates, horaires ou programmes inventés : une soirée n'existe que si le club la publie ou fournit une source vérifiable (lien/capture du programme).
- Dress code et âge minimum viennent de la fiche établissement, pas de la soirée.
- Fuseau horaire de référence : Europe/Zurich. Monnaie : CHF.

## Pages publiques clés
Accueil, Explorer, Carte (OpenStreetMap, sans clé), Soirées (liste), Agenda (calendrier mensuel), fiche soirée, fiche établissement.

## Garde-fous
- Aucune migration, écriture en base, changement de secret ou publication sans accord explicite de l'utilisateur.
- Ne jamais lire ni afficher .env ou secrets ; rappeler à l'utilisateur de ne jamais coller de secret dans le chat.
- Les projets Supabase externes inactifs restent hors périmètre.
- Combiner avec tonight-security-audit, tonight-supabase-architect, tonight-code-review et tonight-testing-qa selon la tâche.

## Méthode
1. Lire l'état réel (code + base en lecture seule) avant de proposer.
2. Petites modifications ciblées, testées (Vitest) et vérifiées dans l'aperçu (téléphone + ordinateur).
3. Séparer : code / base de données / secrets / publication.
4. Répondre en français simple, avec des images du quotidien, et séparer faits vérifiés et hypothèses.
