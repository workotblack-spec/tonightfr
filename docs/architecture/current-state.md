# État actuel de Tonight FR

Date : **3 novembre 2026**. Référence locale : `a05116ed6e0471b0796a72577635ab01fd9fa78c`.

## 1. Faits vérifiés pendant cette session

### Technologie

`package.json` déclare React et React DOM `^19.2.0`, TanStack Start `1.168.60`, TanStack Router `1.170.41`, TypeScript `^5.8.3`, Tailwind CSS `^4.2.1`, Vite `^7.3.1`, TanStack Query `^5.83.0` et le client JavaScript de base `@supabase/supabase-js` `^2.106.1`.

Ce sont les versions **déclarées**, pas une certification de toutes les versions exécutées en ligne. Le projet existant utilise Lovable Cloud pour PostgreSQL et l’authentification. Leaflet et React Leaflet sont déclarés pour la carte ; Drizzle est présent pour des migrations locales. Le plugin Cloudflare est déclaré, sans que cela prouve l’existence d’un déploiement indépendant relié à GitHub.

### Pages présentes

| Chemin | Rôle actuel dans le code |
| --- | --- |
| `/` | Découverte et radar de sorties |
| `/explore` | Recherche et exploration |
| `/map` | Vue carte |
| `/event/$id` | Détail d’une soirée, règles maison et demande VIP selon la catégorie |
| `/favorites` | Favoris du membre connecté |
| `/auth` | Inscription et connexion ; bouton Google présent |
| `/profile` | Profil et accès aux espaces de gestion |
| `/pro` | Fiche d’un établissement, demandes de tables et compteurs |
| `/admin` | Gestion des événements et fonctions de gestion suivant le rôle |
| `/promouvoir` | Demande de promotion ; ce n’est pas un portail Promoteurs autonome |
| `/about`, `/contact`, `/legal` | Informations générales, contact et mentions légales |

Routes techniques présentes : `/api/sitemap.xml`, `/api/public/ingest`, `/api/public/backfill-images`, `/api/public/sync-cron-secret`. Leur présence ne certifie ni leur exécution automatique, ni leur sécurité, ni leur disponibilité publiée. Aucun appel de ces opérations n’a été effectué ici.

### Fonctionnalités et limites immédiates

- Radar : données des 26 cantons, géolocalisation, distance et filtres. La couverture géographique prévue n’est pas la preuve d’une couverture exhaustive des soirées. La détection cantonale par proximité du chef-lieu reste approximative.
- Favoris et authentification : code présent ; aucun compte n’a été utilisé pour vérifier un parcours pendant cette session.
- `/pro` charge `venues` avec `owner_id = utilisateur connecté` puis `maybeSingle()`. La base impose effectivement `UNIQUE (owner_id)` : un compte propriétaire ne peut actuellement avoir qu’une fiche établissement.
- Les événements sont rattachés au compte par `events.owner_id`. Il n’existe pas de colonne `venue_id` dans les colonnes observées de `events`.
- Le portail retrouve les demandes à partir des événements de ce propriétaire, pas d’un établissement sélectionné dans un groupe.
- `VipTableRequest` écrit dans `table_requests` : événement, demandeur, zone, nombre d’invités, contact, téléphone et note. C’est une **demande à confirmer**, pas une table numérotée avec disponibilité garantie. Les zones proposées sont actuellement fixes dans le code.
- Le portail propose accepter/refuser puis arrivé/absent. Ses compteurs portent sur l’ensemble des demandes chargées : le « bilan du lendemain » n’est pas un rapport limité automatiquement à la veille.
- Aucun encaissement n’est intégré au formulaire VIP lu. Tonight ne doit pas encaisser les tables, bouteilles ou consommations ; le client règle l’établissement directement. Les abonnements restent un chantier distinct.
- `HouseRules` recherche la fiche par nom avec `ilike`, puis limite le résultat à une fiche. Il ne recherche pas par propriétaire ou identifiant d’établissement : des noms proches ou dupliqués peuvent créer une ambiguïté. Ce rattachement est insuffisant pour un modèle multi-établissements fiable.
- Des fichiers PWA, d’images, de robots et de sitemap existent ; aucune validation d’installation, d’indexation réelle ou de droits d’utilisation des photos n’est effectuée ici.

### Base accessible : sept tables publiques

Lecture de `pg_tables` effectuée pendant cette session : **RLS activée sur les sept tables**.

| Table | Usage observé |
| --- | --- |
| `events` | Soirées, lieu textuel, horaires, localisation, images et propriétaire |
| `favorites` | Événements enregistrés par utilisateur |
| `profiles` | Profil du compte |
| `promo_requests` | Demandes de promotion |
| `table_requests` | Demandes de réservation VIP et statut |
| `user_roles` | Attribution des rôles |
| `venues` | Fiche et règles maison d’un établissement |

L’énumération des rôles confirme `admin`, `venue`, `user`. Aucune table d’adhésion à plusieurs établissements (« memberships ») ni de promoteurs n’apparaît dans l’inventaire public. Les fonctions ne constituent pas un modèle d’équipe caché démontré.

RLS signifie « chaque lecture ou écriture passe par des règles d’accès ». Son activation ne valide pas leur efficacité. Les définitions contextuelles décrivent des accès par utilisateur/propriétaire et administrateur ; elles n’ont pas été entièrement relues ni testées avec plusieurs comptes ici. Un audit devra aussi vérifier les privilèges explicites (`GRANT`).

### Historiques de migration

Rapprochement en lecture seule du 3 novembre 2026 (empreintes MD5/SHA-256 comparées, aucun contenu affiché) :

- `supabase/migrations/` : **17 fichiers** ↔ **17 lignes** dans `supabase_migrations.schema_migrations`, appariées une à une dans l’ordre (écart d’horodatage de 0 à 2 secondes, typique d’un enregistrement après exécution).
  - **14 fichiers identiques** octet pour octet au texte enregistré en base.
  - **3 fichiers différents** de quelques octets : `20260523152315_…`, `20260525175342_…`, `20260525180022_…`. Deux d’entre eux sont signalés comme contenant un motif sensible ; le contenu n’a pas été ouvert. Cause non établie (édition après coup ou masquage probable).
- `drizzle/migrations/` : **3 fichiers** ↔ **3 lignes** dans un **second journal**, `drizzle.__drizzle_migrations`, avec empreintes SHA-256 **identiques** et dates égales à celles du journal local `_journal.json`.
- L’énigme précédente (« `venues` et `table_requests` existent sans version ») est résolue : elles ont été créées par les migrations Drizzle `0001` et `0002`, tracées dans le journal Drizzle.
- `drizzle/schema.ts` reste vide par conception : Drizzle sert ici d’exécuteur de SQL écrit à la main, pas de modèle.
- Aucune migration locale non appliquée, aucun doublon de version, aucune ligne en base sans fichier.

**État :** deux journaux successifs et cohérents (Supabase jusqu’au 5 juillet 2026, puis Drizzle). Reste à expliquer les 3 écarts et à comparer le schéma réel en détail ; voir [décision 0001](../decisions/0001-source-of-truth-migrations.md).

### Connexions : écart avec le cadrage

Le cadrage disait « aucun connecteur personnalisé connecté ». La lecture de l’inventaire des connexions standard pendant cette session affiche au contraire des connexions existantes ElevenLabs et Firecrawl déjà liées au projet, ainsi que d’autres connexions disponibles non liées, dont Google Maps Platform. Cela ne prouve pas leur utilisation par l’application ni l’état des connecteurs personnalisés de discussion, qui constituent un autre inventaire.

Ne pas conclure « aucune connexion dans le workspace ». Clarifier les catégories lors du prochain inventaire ; **aucune connexion n’a été ajoutée, utilisée pour appeler un fournisseur ou modifiée ici**.

## 2. Faits rapportés dans le cadrage, non revérifiés à distance

- Le dépôt GitHub `workotblack-spec/tonightfr` contient le commit de référence ; la branche `backup/pre-execution-2026-11-03` a déjà été créée dessus. Le commit local est confirmé, mais l’état distant et la synchronisation ne sont pas vérifiés par cette session.
- Le projet est publié à `https://tonightfr.lovable.app`. **Publié ne signifie pas production validée.** Aucun parcours publié n’a été visité ici.
- **Vérifié (étape a)** : l’app, l’aperçu et le site publié utilisent la base Lovable Cloud (PostgreSQL 17.6) ; `.env` (`VITE_SUPABASE_URL`, `SUPABASE_PROJECT_ID`…) et `supabase/config.toml` désignent la même référence (comparaison interne, valeurs non affichées). Les deux projets du compte Supabase externe (`Tonight Fribourg`, `workotblack-spec's Project`) sont INACTIVE, absents du dépôt, historique illisible (timeout) : **relation non démontrée**, aucune action à faire sur eux.
- Une ancienne migration contiendrait une authentification Bearer en clair dans l’historique. Le contenu sensible n’a pas été rouvert ou recopié ici. Une rotation contrôlée de `CRON_SECRET` est urgente avant la prochaine étape de sécurité ; aucune rotation n’est effectuée maintenant.

## 3. Risques et décisions à prendre

| Sujet | Risque / limite | Décision ou contrôle requis |
| --- | --- | --- |
| Identification des environnements | Agir sur la mauvaise base | Confirmer le mapping Lovable Cloud, dépôt et compte externe, sans réactivation |
| Migrations | Rejouer ou diverger des changements | Inventaire complet en lecture seule et décision documentée |
| Secret historique | Usage non autorisé d’un ancien secret | Plan puis rotation contrôlée dans une étape distincte |
| Multi-établissements | Propriétaire unique et événements sans lien direct au lieu | Étudier le modèle d’appartenance, sans modifier l’existant |
| Accès Pro | Connexion seule côté page ; isolation à démontrer côté données | Audit de permissions et tests multi-comptes ultérieurs |
| Demandes VIP | Statuts, gestion d’erreurs et champs modifiables à auditer | Tester le parcours et les permissions avant lancement |
| Sources d’événements | Fraîcheur, exhaustivité et droits des images non démontrés | Confirmer sources autorisées, cadence et provenance |
| Référencement | Métadonnées de pages incomplètes | Audit SEO ultérieur ; aucune correction de page ici |

Le contrôle textuel des pages indique que chacune déclare `head()`, mais plusieurs n’explicitent pas toutes les balises sociales. Cela n’est pas une vérification du HTML rendu ni de l’indexation Google.

## 4. Ce qui n’est pas validé

Aucun test fonctionnel, navigateur, charge, sécurité offensive, paiement, installation PWA, notification, configuration OAuth ou conformité juridique n’a été exécuté pendant cette étape. Aucun inventaire de données personnelles n’a été exporté. Les constats servent à préparer des contrôles, pas à déclarer le système prêt.

## 5. Comparaison structure réelle ↔ migrations (3 novembre 2026, lecture seule)

Méthode : SELECT sur les catalogues PostgreSQL uniquement (tables, contraintes, index, RLS, droits, fonctions, extensions, noms et indicateurs des tâches planifiées). Aucune donnée client lue, aucun secret affiché.

**Concordant :** les 7 tables, leurs clés, contraintes de contrôle, index, triggers et fonctions applicatives sont tous expliqués par une migration ; RLS activée partout.

**En base sans migration explicative :**
- Tâches planifiées `cleanup-old-events` et `tonight-purge-daily` (suppression quotidienne, sans appel réseau).
- Extension `unaccent` (et ses 4 fonctions dans `public`) ; `pgcrypto`, `uuid-ossp`, `pg_stat_statements`, `supabase_vault` sont probablement fournies par la plateforme (non prouvé).

**Prévu par migration mais absent en base :**
- Les robots d’import d’événements `tonight-nightly-ingest`, `tonight-ingest-morning`, `tonight-ingest-evening` : aucune tâche actuelle n’appelle le réseau ni l’import. L’import automatique semble donc **non planifié** aujourd’hui ; la cause (retrait manuel, échec) est inconnue.

**Sécurité / droits :**
- `has_role` n’est pas exécutable par `anon` ni `authenticated` (retrait volontaire en `20260523165636`), alors que plusieurs politiques l’appellent. Risque d’erreurs « permission denied » sur les parcours admin et certaines lectures : **à tester avec de vrais comptes**, pas conclu.
- `anon` et `authenticated` ont les droits SELECT/INSERT/UPDATE/DELETE sur les 7 tables : seule la RLS protège les données.
- `sync_cron_secret_to_vault` n’est exécutable par aucun rôle client (attendu).
