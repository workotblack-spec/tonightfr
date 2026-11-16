# TONIGHT FR — rapprochement du brouillon, 16 novembre 2026

## Périmètre et preuves

Rapprochement avec `03e8c2ca991d54ffdc2a6088af23f114e1b48fd2`, ancienne base `8be4aa3ff0661b1242f2af28f87d4d290ba50715`. La référence préservée du brouillon est `origin/_pre-refresh/drft_01m6ny0k1dedfasx3c76pv42kb`.

Commandes officielles exécutées dans l'ordre : `lovable drafts plan`, `lovable drafts restore --all`, rapprochement manuel, puis `lovable drafts verify`, avec ces trois références. Le plan identifie 26 chemins propres au brouillon et 22 chemins concurrents. Les 26 chemins ont été restaurés par l'outil, sans recopie manuelle de leurs contenus.

Les fichiers de migration Pass `0003_member_passes.sql`, `0004_pass_clock_tolerance.sql`, leurs deux snapshots et le journal ont été restaurés à l'identique : aucune concurrence du journal, aucun renumérotage, aucune application de migration ni accès aux données dans cette intervention. Ce constat sur les fichiers ne prouve pas leur présence dans une base.

## Arbitrages explicites, aucune perte silencieuse

- `public/sw.js`, `src/components/PWARegister.tsx` : le remplacement plus récent de l'app est conservé. Il actualise seulement les enregistrements `/sw.js` existants, supprime exactement `tonight-v1`, ne recharge pas les visiteurs et ne touche pas les autres workers. Le nettoyage plus large du brouillon et son rechargement automatique sont volontairement remplacés.
- `src/lib/pwa-cache.test.ts` : l'attente de suppression des caches voisins est volontairement remplacée par la suppression exacte de `tonight-v1`. Les trois tests restent présents ; six autres tests du remplacement récent sont conservés. Le vérificateur signale cette adaptation comme `dropped` car il exige une identité d'octets pour les chemins propres au brouillon, pas parce que le test manque.
- `src/lib/sitemap.ts` : le générateur XML du brouillon (pagination, dédoublonnage, échappement, erreurs explicites) reste présent. Sa réponse serveur est déplacée dans `src/lib/sitemap.server.ts` pour préserver la frontière serveur de l'app ; aucun comportement n'est supprimé. Le vérificateur signale également cette adaptation d'octets comme `dropped`.
- `src/routes/api/sitemap[.]xml.ts`, `src/routes/sitemap[.]xml.ts` : les deux chemins utilisent ce même handler serveur. Aucun usage admin pour ces lectures publiques.
- Métadonnées des pages : textes concrets du brouillon conservés avec URLs absolues et métadonnées complètes. L'image sociale absolue ajoutée sur l'accueil dans l'app est préservée ; les liens de langues identiques retirés restent retirés. Aucun remplacement des photos visibles.
- `src/routes/event.$id.tsx` : préchargement public et titre dynamique de l'app conservés ; bouton Pass et erreur non sensible du brouillon réintégrés. Le titre générique du brouillon est volontairement remplacé par le titre réel fourni par le préchargement.
- `src/routes/pro.tsx`, `src/routes/profile.tsx` : validation à l'entrée et accès au Pass préservés ; garde d'utilisateur et contrôle d'erreur conservés.
- `src/routes/__root.tsx`, `AGENTS.md`, `roadmap.md` : français suisse, erreurs expurgées et documentation des deux versions conservés.
- `src/routeTree.gen.ts` : régénération automatique, sans édition manuelle ; routes Pass et sitemap présentes.

Le dernier contrôle exige une revue humaine pour `AGENTS.md`, `public/sw.js`, `roadmap.md`, `src/components/PWARegister.tsx`, `src/routes/__root.tsx`, les deux routes sitemap, `src/routes/contact.tsx`, `src/routes/event.$id.tsx`, `src/routes/index.tsx`, `src/routes/pro.tsx`. Leurs contenus ont été rapprochés avec les deux différences ; le contrôle n'est **pas certifié** en raison des deux adaptations intentionnelles citées ci-dessus.

## Contrôles réellement exécutés

- `bun test` : **44 réussites, zéro échec**, 7 fichiers.
- `bunx vitest run` : **44 réussites, zéro échec**, 7 fichiers.
- `bun run lint` : **échec**, 815 erreurs et 7 avertissements ; ne pas déclarer la qualité globale validée.
- Journal de compilation automatique Lovable : **build OK** observé après rapprochement ; aucune construction manuelle.
- Playwright, visiteurs sans session : accueil, profil, Pass, Pro HTTP 200 ; titres spécifiques, aucun `pageerror`. Desktop 1280 × 1800 et mobile 390 × 844. Bouton de connexion du Pass mène à `/auth` ; la capture immédiatement après le clic montre encore l'écran Pass, elle ne prouve donc pas l'affichage du formulaire de connexion.
- `/sitemap.xml` et `/api/sitemap.xml` : HTTP 200, contenu XML.

## Limites, risques et prochaines actions

**P1 confirmé :** lint en échec, preuves ci-dessus ; corriger progressivement dans un sujet dédié. Aucun crédit payant ni nouvelle dépendance requis pour les contrôles réalisés.

**P1 non vérifié :** création/transfert/validation Pass entre comptes et scan caméra à une porte réelle. Aucun test de ces parcours ni de permissions réelles n'a été exécuté ici ; les tests unitaires ne les remplacent pas. Ne pas qualifier le Pass de validé en exploitation.

Conserver les autres tâches ouvertes de la feuille de route : permissions/RLS, sauvegarde, rotation et livraison distante nécessitent leurs étapes et autorisations distinctes. Aucun contenu `.env`, aucun patch `.env`, aucun secret consulté ; aucune écriture base, installation, connexion, publication ou acceptation. Aucun commit distant ni protection GitHub vérifié dans cette session. Les révisions locales sont enregistrées par Lovable ; aucune commande Git mutatrice exécutée.

Retour arrière : référence préservée disponible ; ne pas restaurer de données pour annuler ce rapprochement de fichiers. Toute acceptation du brouillon reste une action distincte et n'est pas faite ici.