# TONIGHT FR

Application de découverte de sorties en Suisse et portail établissements. Le modèle actuellement implémenté est propriétaire unique ; le multi-sites, les équipes et le Pass restent des propositions, pas des fonctions livrées.

## Démarrage

Dans un environnement de développement autorisé, les dépendances existantes sont décrites par `package.json` et `bun.lock`. Le serveur local se lance avec `bun run dev`. Dans Lovable, il est déjà géré : ne pas lancer un second serveur. Aucun service ou paiement ne doit être connecté pour une correction de code.

Configuration : utiliser les formulaires sécurisés, jamais le chat. `.env.example` contient uniquement des noms ; ne jamais lire, partager ou inclure `.env` dans un patch.

Noms utilisés : `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY` (navigateur) ; `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `CRON_SECRET`, `FIRECRAWL_API_KEY`, `LOVABLE_API_KEY` (serveur). Aucune valeur n’est documentée. Les variables privées ne doivent jamais être préfixées `VITE_`.

## Architecture

- `src/routes` : pages TanStack et routes serveur ; `src/components/tonight` : interfaces métier.
- `src/hooks` : comptes, favoris et localisation ; `src/lib` : événements, radar, protections réseau et sitemap.
- `src/integrations/supabase` : clients générés ; accès privilégié uniquement dans le gestionnaire après autorisation.
- `public` : icônes, manifeste, robots et ancien worker de retrait ciblé. Installation par manifeste, sans nouveau mode hors connexion.
- `supabase/migrations` et `drizzle/migrations` : historiques à réconcilier, jamais à rejouer automatiquement ici.
- `remotion-tiktok` : projet conservé ; aucune inutilité formellement prouvée.

## Vérifications

```sh
bunx vitest run src/lib/pwa-cache.test.ts src/lib/sitemap.test.ts src/lib/maintenance-auth.test.ts src/lib/safe-fetch.test.ts src/lib/radar.test.ts
bun run lint
```

Le contrôle automatique Lovable prend en charge compilation et types ; ne pas les relancer manuellement dans le brouillon. Le lint global possède une dette de formatage : son échec n’est pas masqué. Une CI bloquante propre exige un sujet séparé, sans étape de déploiement. Ne pas exécuter `format` globalement pour une petite correction.

## Changement et incident

Petites corrections par sujet de PR ; aucune modification directe de `main`, fusion, acceptation du brouillon ou publication. Voir [processus](docs/runbooks/change-process.md), [sécurité base](docs/runbooks/database-safety.md) et [plan de sauvegarde non exécuté](docs/runbooks/backup-plan.md).

En cas d’incident : consigner symptômes et version sans données personnelles, suspendre l’opération risquée, vérifier le périmètre, préparer correctif et retour arrière. Ne pas afficher erreurs détaillées, cookies ou clés. Rotation, restauration et changement de permissions demandent chacun un plan et une autorisation distincte.