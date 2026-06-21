## Le vrai problème

La base contient 64 events Fribourg / 9 Bulle / 18 Lausanne sur 7 jours, donc le filtre n'est pas en cause. Le souci : **la liste n'est pas crédible**.

1. **Doublons massifs** : la Fête de la Musique de Fri-Son apparaît 5x, le brunch du Nouveau Monde 3x. Le dédoublonnage actuel se fait sur `external_id` (`source:slug`) que l'IA recalcule différemment à chaque scrape.
2. **Matchs Coupe du Monde inventés** : « Égypte vs Curaçao », « Cap-Vert vs Haïti » — pas des vraies équipes qualifiées. Le seeding a généré des fixtures fictives.
3. **Bulle quasi vide** : 9 events tous = watch parties CDM inventées. Aucune vraie source Bulle dans `ingest.ts`.
4. **Sources Lausanne pas terribles** : Docks/MAD/Romandie scrapées mais peu de résultats remontent (probablement bloqués ou markdown vide).

## Plan d'action

### 1. Nettoyer la base (insert tool)
- Supprimer **toutes** les watch parties Coupe du Monde (events avec titre commençant par 🏆) — on les remettra plus tard avec les vraies fixtures FIFA publiées après le tirage de décembre 2025.
- Dédoublonner : pour chaque triplet `(lower(title), date(starts_at), venue)`, garder le plus ancien `id` et supprimer les autres.
- Supprimer les events passés > 1 jour.

### 2. Renforcer le dédoublonnage (`src/routes/api/public/ingest.ts`)
- Construire l'`external_id` de façon déterministe côté serveur : `slugify(title) + "-" + YYYY-MM-DD` (sans repasser par l'IA), pour qu'un re-scrape upsert au lieu d'insérer.
- Ajouter aussi une contrainte applicative : si un event existe déjà avec même `lower(title)` + même date civile + même venue, on skip.

### 3. Ajouter de vraies sources Bulle + élargir Fribourg
Ajouter dans `SOURCES` :
- **Ebullition** (Bulle) — `https://www.ebull.ch/programme/`
- **CO2** (Bulle) — `https://www.co2bulle.ch/agenda/`
- **Café du Cheval Blanc** (Bulle) — site officiel
- **La Spirale** (Fribourg) — `https://laspirale.ch/agenda/`
- **Café des Sports** (Fribourg) — pour les retransmissions sport
- **Bulle Tourisme** — `https://www.la-gruyere.ch/agenda/`

### 4. Lancer un ingest complet maintenant
Appel direct `POST /api/public/ingest` avec le `CRON_SECRET` pour repeupler la base avec les nouvelles sources et le dédoublonnage corrigé.

### 5. Coupe du Monde — désactiver tant qu'on n'a pas les vraies fixtures
- Masquer le bandeau CDM et l'onglet sur la home tant que `category = 'sport' AND title LIKE '🏆%'` est vide.
- Note pour plus tard : récupérer les vrais matchs via l'API FIFA officielle ou un scrape de `https://fr.wikipedia.org/wiki/Coupe_du_monde_de_football_2026` une fois le tirage public, puis re-seed proprement.

### 6. Vérification
- `SELECT area, COUNT(*)` avant/après pour confirmer qu'on a +10 events crédibles par ville sur 7 jours.
- Capture preview à 402×717 pour valider visuellement la liste.

## Détails techniques

```text
Étape         Outil                Action
─────────────────────────────────────────────────────────────
Nettoyage     supabase--insert     DELETE doublons + watch parties CDM
Ingest code   line_replace         external_id déterministe + skip-if-exists
Sources       line_replace         +6 entrées dans SOURCES[]
Run ingest    exec (curl)          POST /api/public/ingest avec Bearer
CDM UI        line_replace         conditionner l'affichage sur events.length>0
QA            supabase--read_query counts par area/category
```

Pas de migration schéma. Pas de changement de design. Focus 100% sur la fraîcheur et la crédibilité du contenu.