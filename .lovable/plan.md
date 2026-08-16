# Refonte premium — Tonight FR

Objectif : passer d'un rendu « app de soirée étudiante » à un produit lifestyle suisse haut de gamme. Aucune fonctionnalité, page ni donnée n'est supprimée — uniquement design, hiérarchie, espacements, typographie et parcours.

## Direction visuelle

- Fond : charbon profond quasi-noir, surfaces légèrement plus claires, plus de halos néon multicolores en fond de page.
- Texte : blanc cassé chaud, gris neutres pour les métadonnées.
- Accent unique : or champagne (déjà la couleur signature), utilisé avec parcimonie — badge sponsorisé, état actif, CTA principal, heure de l'événement. Suppression des dégradés aurora rose/violet/bleu et de `shadow-neon` sur les éléments courants.
- Glassmorphisme réservé à la barre du haut et à la navigation basse ; ailleurs, surfaces opaques avec bordure fine.
- Rayons : 16 px pour les cartes, 12 px pour les boutons, pilules uniquement pour les filtres.

## Typographie

Passage à un système sans-serif premium unique (Inter Tight en corps, une display sans-serif type Instrument/General Sans pour les titres — plus de serif Fraunces) avec une échelle stricte :

- Titre de page : 32/36, tracking serré
- Titre de section : 20, semibold
- Titre d'événement : 17, semibold
- Métadonnées / lieu : 13, gris
- Label catégorie : 11, uppercase, tracking large
- Boutons : 14, medium

## Écran d'accueil

1. **Barre haute** (sticky, discrète) : logo Tonight FR + sélecteur FR/DE/EN miniature + indicateur « Fribourg » + icône profil/favoris.
2. **Hero compact** (~40 % de hauteur au lieu de 86 vh) : image nocturne assombrie, « Ce soir à Fribourg », phrase de soutien, date du jour, compteur d'événements. Un seul CTA principal (« Autour de moi ») + lien carte secondaire.
3. **Barre de filtres** sticky simplifiée : recherche + géoloc sur une ligne, puis une seule rangée de pilules ville, une rangée date, une rangée catégorie, avec défilement horizontal fluide et masques de bord.
4. **Liste d'événements** chronologique, en pleine largeur mobile, max 720 px desktop centré.

## Carte d'événement (éditoriale)

Image 16/10 nette, dégradé bas léger, heure en pastille lisible, titre sur 2 lignes max, ligne méta « Lieu · Quartier · distance », prix aligné à droite, label catégorie en capitales fines, bouton favori discret en haut à droite, pression tactile subtile (scale 0.98). Badge « Sponsorisé » or épuré.

## Navigation basse

Nouvelle barre mobile fixe à 5 onglets : Tonight, Explorer, Carte, Favoris, Profil — icônes lucide simples, libellé 10 px, indicateur actif or, fond verre + safe-area iOS. Elle remplace le bloc flottant actuel et s'affiche sur toutes les pages principales.

Deux routes à créer pour compléter la navigation :
- `/explore` : parcours par catégorie et par ville (réutilise la logique de filtres existante, présentation en sections).
- `/profile` : compte, favoris, langue, accès espace pro/admin selon le rôle (redirige vers `/auth` si non connecté).

## Page événement

Hero plein écran assombri avec retour flottant, titre en gros, ligne date/heure, bloc lieu + carte, catégorie, description aérée, prix, CTA billetterie fixé en bas, favori. Rythme éditorial avec séparateurs fins or.

## États vides

Illustrations légères (icône dans un cercle) + copie humaine en FR/DE/EN :
- Aucun événement : « Rien de prévu pour ce créneau — essaie ce week-end. »
- Aucun favori : « Tes coups de cœur apparaîtront ici. »
- Aucun résultat : « Aucune correspondance. Essaie un autre mot ou une autre catégorie. »

## Animations

Apparition en cascade des cartes (fade + translation 12 px), transitions de page en fondu, retour tactile sur boutons, défilement horizontal par accrochage sur les pilules. Suppression du `animate-ping` et des halos pulsés.

## Détails techniques

- `src/styles.css` : nouvelle palette OKLCH (fond `~0.09`, surfaces `0.13/0.17`, accent or unique), suppression des tokens `gradient-aurora` / `shadow-neon` au profit de `shadow-soft`, `shadow-lift`, `ring-gold`; nouvelle famille display chargée via `<link>` dans `__root.tsx`.
- Composants refondus : `EventCard`, `EventCardSkeleton`, `CategoryChips`, `DateChips`, `SearchBar`, `LanguageSwitcher`.
- Nouveaux composants : `BottomNav`, `AppHeader`, `EmptyState`, `SectionTitle`.
- Pages retouchées : `index`, `event.$id`, `map`, `favorites`, `promouvoir`, `about`, `legal`, `contact` (mise en cohérence uniquement).
- Ajout des clés i18n manquantes dans `src/data/i18n.ts` (onglets nav, états vides, profil).
- Aucune modification de la base de données, des requêtes, ni de la logique de tri/ingestion.
- Architecture prête pour les comptes lieux : la page `/profile` expose déjà l'entrée « Espace pro » selon le rôle existant.
