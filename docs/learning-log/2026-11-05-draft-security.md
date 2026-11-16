# Corrections isolées — 5 novembre 2026

## Périmètre et version

Base locale observée : `b43d6dab990e34ae9001938ae7efcafddb7a50c8`. Brouillon non accepté ; aucune commande Git mutatrice, publication, connexion, installation, opération SQL, écriture de données, sauvegarde ou changement de secret/variable. `.env` et son patch n’ont jamais été lus. Les captures utilisent les exemples déjà présents dans le brouillon, sans création de compte.

Skills utilisés : `tonight-security-audit`, `tonight-code-review`, `tonight-testing-qa`, `tonight-supabase-architect` et PWA. Le contrôle de base reste documentaire : aucune interrogation des politiques effectives pendant cette intervention.

## PR distantes vérifiées en lecture publique

Trois PR ouvertes, sans doublon créé :
- #1 `fix/pwa-cache-safety`, `6ca9e3fa8396a9372cb34e2b0806d3cf7829d211`, non draft.
- #2 `seo/robots-crawl-rules`, `4910facde8d1ab5c4c4ec1925ea655feb007d9de`, draft.
- #3 `security/remove-tracked-env`, `6984d80f0da56405e6b5d7bea04eac8fce3b34e2`, draft.

La liste de fichiers de #2 a été lue ; `robots.txt` et le handler API ont été téléchargés seulement. Le fichier racine annoncé par cette liste retourne 404 sur raw au SHA : son contenu distant n’est donc pas vérifié. Aucun accès d’écriture GitHub établi ; aucun statut ou branche distante n’a été modifié. La version locale ne prouve pas une livraison distante.

## A1 — retrait sûr du cache

**P1 confirmé :** local `public/sw.js` cache les navigations et toutes les requêtes GET ; la PR #1 supprime encore tous les caches étrangers et ne filtre pas explicitement `navigate`.

Correction : worker de retrait au même chemin, sans interception réseau ni liste de cache statique ; suppression exclusivement des deux noms historiques connus et du préfixe contrôlé `tonight-fr-`. Aucun cache Firebase/OneSignal/étranger effacé. Désinscription dans `finally`, même si le nettoyage échoue. `PWARegister` ne crée plus de worker dans aucun contexte (incluant preview/dev/iframe), ne désinscrit que `/sw.js` sur la même origine. Manifeste et icônes conservés.

Compromis explicite : ancien mode hors connexion retiré, installation écran d’accueil conservée. Garder le worker de retrait au moins un cycle de livraison ; son effet sur un navigateur déjà installé attend une future publication autorisée. Pas d’ajout de dépendance, ni nouveau mode offline.

## A2 — robots, sitemap et pages

**P2 confirmé :** sitemap limité à 1000, pas de pagination ; URL API bloquée par les robots de la PR ; `/pro` comme préfixe risquait également de bloquer `/promouvoir`.

Correction : `/sitemap.xml` racine et alias API partagent l’implémentation existante extraite ; lecture anonyme publique, client typé sans session, compatibilité clés publiques opaques, uniquement IDs événements. Pagination 500 avec tri `starts_at,id`, erreur explicite 503/no-store si source/configuration indisponible, XML échappé et IDs encodés. Aucun `lastmod` inventé. Pagination par offset : pas un instantané transactionnel ; changements simultanés restent une limite documentée.

Aucun champ de publication n’existe dans les types observés ; `is_promoted` n’est pas un indicateur de publication. La politique de lecture publique est un constat antérieur rapporté, pas une politique revérifiée ici. Ne pas utiliser un client admin pour contourner un refus.

Pages indexables : `/`, `/explore`, `/map`, `/promouvoir`, `/about`, événements à venir avec grâce existante de six heures. `/contact` et `/legal` restent `noindex` comme avant, retirés du sitemap mais accessibles au crawler pour lire ce signal. `/profile`, `/favorites`, `/auth`, `/admin`, `/pro` exclus ; `/api/` reste bloqué. `/pro$`, `/pro?`, `/pro/` ciblent le portail sans bloquer `/promouvoir`.

Chaque page de contenu a titre, description, OG et Twitter, canonical absolu propre, sans hreflang identiques. Racine en fr-CH, aucun visuel OG racine ou URL relative/placeholder. Aucun nouveau visuel public inventé. **Limite :** la fiche événement conserve un titre fondé sur l’ID, sans loader serveur événementiel ; image et titre issus des données à traiter dans un lot dédié, avec validation crawler. Il ne faut pas présenter cela comme SEO événementiel complet.

## A3 — environnement, métadonnées seulement

Arbre GitHub #3 complet (`truncated=false`) : `.env` absent à ce SHA, `.env.example` présent. Local : `.env` toujours suivi, constat par `git ls-files -- .env` seulement. `.gitignore` exclut `.env`, `.env.*` et garde `.env.example` ; exemple analysé sans afficher de valeurs : six noms, toutes valeurs vides.

Aucune suppression locale de `.env` pour ne pas générer un patch sensible. Suppression en tête de branche ne purge pas l’historique ; aucune rotation effectuée. Réécriture d’historique, rotation et synchronisation sont des opérations distinctes avec autorisation.

## B/C/D — autres corrections et limites

- Imports privilégiés `ingest` et `sync-cron-secret` déplacés après contrôle d’autorisation ; client passé explicitement au traitement ingest. Backfill déjà conforme.
- Hôtes de téléchargement limités au domaine exact ou `www`, plus aux sous-domaines arbitraires ; corps surdimensionnés rejetés au lieu de parser du HTML tronqué.
- **P1 ouvert :** validation DNS/adresse effective non prouvée. Allowlist et redirections ne suffisent pas à éliminer DNS rebinding. Préparer une solution compatible runtime, sans installation ou connexion ici.
- Deux erreurs lint fonctionnelles corrigées : hook du composant d’erreur nommé et branche explicite de favoris. Aucune modification du flux métier favoris.
- Labels de connexion/contact, langue et erreurs génériques améliorés ; styles et identité préservés. Audit contrastes complet non réalisé.
- Aucun fichier supprimé : inutilité non prouvée ; `remotion-tiktok` conservé.
- **P1 rapporté, non retesté :** `table_requests` UPDATE potentiellement trop large ; `has_role` et GRANT restent à tester multi-comptes avec autorisation. Aucun changement RLS/permissions.
- **P2 observé :** légal indique aucune autre donnée collectée malgré formulaires de contact/VIP ; promotion affiche statistiques/prix non vérifiés. Aucun tarif ou texte contractuel inventé/corrigé ici : validation propriétaire requise.
- CI non ajoutée : lint global échoue largement sur formatage ; éviter une CI prétendue verte ou un reformatage massif. Commandes documentées sans déploiement.

## Vérifications réellement exécutées

- `bunx vitest run src/lib/pwa-cache.test.ts src/lib/sitemap.test.ts src/lib/maintenance-auth.test.ts src/lib/safe-fetch.test.ts src/lib/radar.test.ts` : **35 tests réussis**, cinq fichiers ; caches isolés, désinscription malgré échec, aucune interception, pagination >1000, échec de page non masqué, escaping, refus 401 avant import privilégié, réseau/radar.
- `bunx eslint src public/sw.js` : échec ; dette de formatage et deux erreurs fonctionnelles identifiées, ces deux dernières corrigées ; lint complet encore non validé. Aucun correctif global automatique.
- Playwright local signé-out : dix pages HTTP 200, langue fr-CH, canonicals attendus, pas de débordement desktop 1280×1800 ; mobile 390×844 accueil/connexion sans débordement, labels présents ; navigation Explorer réellement cliquée. Captures inspectées.
- `/robots.txt`, `/sitemap.xml`, `/api/sitemap.xml` : HTTP 200, XML sur les deux sitemaps. Trois routes maintenance × jeton absent/faux : six réponses 401. Aucun appel autorisé pouvant écrire.
- Aucun compte créé, session injectée, réservation/contact/favori cloud soumis. Les parcours authentifiés et inter-comptes **non exécutés**, pas « validés » par les pages publiques.
- Dernier signal compilation automatique observé après corrections : `build OK` ; pas de build/typecheck manuel.

## Descriptions de mise à jour proposées

### PR #1 — maintenir/repasser draft (action propriétaire)
Remplacer le cache général par retrait ciblé de l’ancien worker ; préserver caches étrangers et installation via manifeste. Tests ciblés passants, mais validation d’un navigateur précédemment installé encore nécessaire dans un environnement autorisé. Ne pas fusionner tant que cette validation et les blocages sécurité restent ouverts.

### PR #2 — garder draft
Sitemap racine accessible hors `/api/`, legacy partagé, pagination et erreurs sources explicites ; robots privés sans bloquer la page promotion ; métadonnées propres et fr-CH. Pas de lastmod arbitraire, pas d’accès admin. Contrôler le fichier racine distant annoncé mais non lisible au SHA avant mise à jour. SEO événementiel complet reste ouvert.

### PR #3 — garder draft
Absence `.env` à la tête de branche vérifiée uniquement par arbre ; exemple conservé. Ne jamais inclure le patch supprimant son contenu dans les livrables publics. Mentionner explicitement historique non purgé et rotation non faite.

### Lot sécurité serveur séparé
Imports privilégiés après autorisation, refus testés sans données, téléchargement plus restrictif et erreurs génériques. Ne pas présenter le risque DNS, l’autorisation RLS ou les parcours connectés comme résolus.

## Retour arrière et gate

Corrections séparables par sujet, patchs limités à chemins explicites sans `.env` ; retour arrière à préparer sur les branches de PR via les outils du propriétaire, jamais par commande Git mutatrice ici. Ne pas restaurer le worker dangereux pour résoudre un problème d’installation : garder le retrait ciblé. Aucune donnée à restaurer car aucune donnée modifiée.

**Décision : Request changes avant production.** Blocages : livraison distante non faite, lint global, tests connectés/RLS, DNS réel, secret historique, vérification navigateur installé et informations légales/commerciales. Aucune dépense de service/dépendance engagée ; les appels d’assistant peuvent consommer les crédits usuels, non chiffrés ici. Sauvegarde vérifiée requise avant toute future évolution des données/permissions ; rotation et publication demandent des accords séparés.