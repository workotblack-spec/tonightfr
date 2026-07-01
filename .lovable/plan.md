## Problème

Toutes les fiches événements ont bien une `image_url` en base (83/83), mais plusieurs domaines sources bloquent le "hotlinking" (chargement depuis un autre site) ou renvoient une image cassée : `fri-son.ch`, `nouveaumonde.ch`, `dclub.ch`, `ebull.ch`, etc. Résultat : sur mobile, beaucoup de cartes affichent un carré vide ou un logo tronqué.

En plus, aucun composant n'a de **fallback `onError`** : quand l'image casse, on ne bascule pas sur l'illustration de catégorie.

## Ce que je propose

### 1. Proxy d'images gratuit (images.weserv.nl)
Router toutes les images distantes via `https://images.weserv.nl/?url=...&w=1024&output=webp` :
- Contourne les blocages de hotlink (le proxy fait la requête serveur).
- Convertit en WebP et redimensionne → chargement 3–5× plus rapide sur mobile.
- Gratuit, pas de clé API, CDN mondial.
- Les images locales (`/src/assets/...`) et Unsplash restent inchangées.

Ajout d'un helper `src/lib/image.ts` : `proxied(url, width)`.

### 2. Fallback automatique sur erreur
Dans `EventCard.tsx` et `event.$id.tsx` : ajouter `onError` sur les `<img>` pour basculer vers `imageFor(image_key)` (illustration de catégorie déjà bundlée) si le proxy échoue aussi.

### 3. Skeleton pendant le chargement
Ajouter `loading="lazy"` + un fond `bg-surface` pendant le chargement pour éviter l'effet "flash blanc".

### 4. Nettoyage des URL cassées côté base
Ajouter un endpoint `/api/public/verify-images` (admin, sur demande) qui HEAD chaque `image_url`, et vide celles qui renvoient 404/403 → l'ingest les re-remplira au prochain scan.

## Fichiers touchés

- **Nouveau** `src/lib/image.ts` — helper `proxied()`.
- **Modif** `src/components/tonight/EventCard.tsx` — proxy + `onError`.
- **Modif** `src/routes/event.$id.tsx` — proxy + `onError` sur le hero.
- **Nouveau** `src/routes/api/public/verify-images.ts` — nettoyage (facultatif, à lancer une fois).

Aucun changement de design, aucun impact sur le back-office ni sur l'ingestion automatique.
