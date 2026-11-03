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
- Les règles maison sont affichées à partir de la fiche du propriétaire. Ce rattachement est insuffisant pour plusieurs établissements d’un même compte.
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

- `supabase/migrations/` contient **17 fichiers SQL**, jusqu’au préfixe local `20260705142611`.
- `drizzle/migrations/` contient **3 fichiers SQL supplémentaires** : `0000_restrict_profiles_select.sql`, `0001_table_requests.sql`, `0002_venue_portal.sql`, ainsi qu’un journal local et des snapshots.
- `drizzle/schema.ts` est intentionnellement vide, à l’exception d’un commentaire généré ; il ne décrit pas les sept tables.
- La lecture de `supabase_migrations.schema_migrations` renvoie **17 versions**, jusqu’à `20260705142613`. Certains horodatages ne sont pas identiques aux préfixes locaux.
- Ce journal distant ne montre pas d’entrée correspondant aux trois migrations Drizzle. La présence effective de `venues` et `table_requests` ne permet pas de conclure comment elles ont été appliquées. Un journal Drizzle distinct est possible, mais non vérifié ici.

**Blocage :** rapprocher fichiers, journaux et schéma réel avant toute nouvelle migration ; voir [décision 0001](../decisions/0001-source-of-truth-migrations.md).

### Connexions : écart avec le cadrage

Le cadrage disait « aucun connecteur personnalisé connecté ». La lecture de l’inventaire des connexions standard pendant cette session affiche au contraire des connexions existantes ElevenLabs et Firecrawl déjà liées au projet, ainsi que d’autres connexions disponibles non liées, dont Google Maps Platform. Cela ne prouve pas leur utilisation par l’application ni l’état des connecteurs personnalisés de discussion, qui constituent un autre inventaire.

Ne pas conclure « aucune connexion dans le workspace ». Clarifier les catégories lors du prochain inventaire ; **aucune connexion n’a été ajoutée, utilisée pour appeler un fournisseur ou modifiée ici**.

## 2. Faits rapportés dans le cadrage, non revérifiés à distance

- Le dépôt GitHub `workotblack-spec/tonightfr` contient le commit de référence ; la branche `backup/pre-execution-2026-11-03` a déjà été créée dessus. Le commit local est confirmé, mais l’état distant et la synchronisation ne sont pas vérifiés par cette session.
- Le projet est publié à `https://tonightfr.lovable.app`. **Publié ne signifie pas production validée.** Aucun parcours publié n’a été visité ici.
- L’identifiant de `supabase/config.toml` ne correspondrait pas aux deux projets inactifs du compte externe connecté, dont Tonight Fribourg. La base accessible par Lovable répond effectivement. L’identité des environnements reste à rapprocher, sans afficher leurs identifiants dans ces documents.
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