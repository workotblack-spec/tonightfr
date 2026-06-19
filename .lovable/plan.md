… Plan de finalisation Tonight Fribourg

Objectif : un site qui se met à jour tout seul, qui contient déjà tous les matchs de la Coupe du Monde 2026, avec un rendu "luxe / classe" et une navigation impeccable — prêt à lancer.

---

## 1. Mises à jour automatiques (zéro intervention)

Le scraper `/api/public/ingest` (Firecrawl + IA, sources Fri‑Son, Bad Bonn, Nouveau Monde, Belluard, Équilibre, Les Docks, MAD, D! Club, Romandie, Lausanne/Fribourg Tourisme, etc.) existe déjà mais n'est lancé qu'à la main.

À faire :
- Activer un job **pg_cron toutes les 6 h** qui appelle `/api/public/ingest` avec le `CRON_SECRET` (déjà en place) → les nouveaux concerts/soirées apparaissent seuls.
- Ajouter un job **quotidien 04h** qui purge les events passés depuis +7 j (garde la base propre).
- Ajouter quelques sources manquantes utiles (Métro Boulot Dodo, Café des Arcades, Ebullition, Café du Tunnel…) au tableau `SOURCES`.
- Petit écran `/admin` : bouton "Synchroniser maintenant" + dernière exécution affichée (info uniquement, pas requis pour l'auto-sync).

## 2. Coupe du Monde 2026 — tous les matchs

La CDM 2026 (USA/Canada/Mexique, 11 juin → 19 juillet 2026) est en cours. On va l'intégrer comme **104 events "Watch Party"** catégorie `sport`.

- Récup du calendrier complet via Firecrawl sur le site officiel FIFA + fallback Wikipédia.
- Insertion en base (`events`) avec : titre = "🏆 [Équipe A] vs [Équipe B] — CDM 2026", heure suisse, `category=sport`, `image_key=sport`, description = phase + stade, `external_id=fifa-wc2026:<match-id>` (idempotent).
- Affiliation à un **lieu de diffusion par ville** (ex. Café du Belvédère / Fribourg, Le Tonneau / Bulle, Great Escape / Lausanne) — éditables ensuite.
- Filtre/onglet dédié **"🏆 Coupe du Monde"** sur la home + badge spécial sur la carte event.

## 3. Design luxueux & classe

Refonte du design system (tokens dans `src/styles.css`) pour sortir du look générique :

- Palette : **noir profond `oklch(12% 0.02 280)` + or champagne `oklch(78% 0.13 85)` + accent magenta nuit**. Gradients subtils, halos.
- Typographie : **Fraunces** (display, serif moderne) + **Inter Tight** (body) — chargées via `<link>` dans `__root.tsx`.
- Cartes : verre dépoli + bordure 1 px or à 20 %, ombre douce, ratio 4/5 sur mobile.
- Micro‑détails : séparateurs filets dorés, chiffres en tabular‑nums, majuscules tracking large pour les catégories.

## 4. Animations — Motion

Install `motion` (ex‑framer‑motion v12) et application ciblée :
- Transitions de page (fade + slide léger) via `AnimatePresence` sur `<Outlet />`.
- Hero : titre en `TextAnimate` lettre par lettre.
- Chips ville/date : ressort doux à la sélection.
- Heart favoris : pop + halo.
- Cartes : `whileTap` scale 0.98, `whileHover` lift sur desktop.

## 5. Navigation finalisée (mobile-first)

- **Header** condensé : logo Tonight + sélecteur ville persistant + avatar.
- **Bottom-nav** 5 onglets fixes : Ce soir · Carte · 🏆 CDM · Favoris · Compte.
- Sticky filter bar qui se rétracte au scroll down, réapparaît au scroll up.
- Page event : image plein écran, sticky CTA "Billet / Itinéraire" en bas.
- Skeletons partout + état vide travaillé ("Rien ce soir à Bulle — voir demain ?").

## 6. GitHub & connecteurs

- **GitHub** : l'intégration n'est pas un connecteur standard, elle se fait via le menu **+ → GitHub → Connecter** dans l'éditeur Lovable. Je ne peux pas la déclencher côté outil — tu cliques une fois, ensuite tout sync auto dans les deux sens.
- **Firecrawl** ✅ déjà connecté (utilisé par l'ingest).
- **Google Maps** est dispo si tu veux que je l'utilise pour la carte (sinon on reste sur la `MapView` actuelle).

## 7. Lancement

- Vérifs SEO : titre + meta description + OG image par route (`/`, `/promouvoir`, `/event/$id`, `/map`, `/favorites`).
- `sitemap.xml` (déjà en place) à régénérer dynamiquement à partir des events à venir.
- PWA : icône + manifest revus, "Ajouter à l'écran d'accueil".
- Publication finale après QA visuel mobile 402×717.

---

### Détails techniques

- pg_cron + pg_net déjà activables ; on stocke le token via `sync_cron_secret_to_vault` puis on appelle `net.http_post` avec `Authorization: Bearer <vault.CRON_SECRET>`.
- L'ingest CDM : nouvelle route `/api/public/ingest-worldcup` (POST, protégée même secret) → scrape fifa.com/fr + parse, upsert sur `external_id`. Lancée une fois manuellement puis 1×/jour par cron pour suivre tours à élimination directe.
- `motion` : `bun add motion` ; on importe `motion/react`.
- Pas de changement de schéma DB (on réutilise `events` + `category=sport`).
- Fontes : `<link rel="preconnect">` + `<link rel="stylesheet">` Fraunces & Inter Tight dans `__root.tsx` head (jamais en `@import` CSS).

Confirme-moi et je lance tout d'un coup.
