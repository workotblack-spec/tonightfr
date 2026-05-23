## Pack Admin / Auth — Tonight.fr

Ajout de l'authentification, des favoris synchronisés cross-device, et d'un mini back-office pour que les lieux gèrent leurs propres events.

### 1. Backend (migration Supabase)
- Table `profiles` (user_id, display_name, venue_name, role)
- Table `user_roles` (enum `app_role`: `admin`, `venue`, `user`) + fonction `has_role()` SECURITY DEFINER
- Table `favorites` (user_id, event_id) — sync cross-device
- Ajout `owner_id uuid` sur `events` (nullable, FK vers auth.users)
- RLS:
  - `events`: lecture publique; insert/update/delete par owner OU admin
  - `favorites`: lecture/écriture par owner uniquement
  - `profiles`: lecture publique, update par owner
  - `user_roles`: lecture par owner et admin
- Trigger `handle_new_user()` → crée profile + role `user` par défaut
- Activer Google OAuth (`configure_social_auth`)

### 2. Auth UI
- `/auth` — login + signup (email/password + Google), traduit FR/DE/EN
- Hook `useAuth()` — session listener (`onAuthStateChange` AVANT `getSession`, gardé en mémoire avec `localStorage`)
- Bouton compte dans le header (avatar + menu: Mon compte / Admin / Logout)

### 3. Favoris cross-device
- Refactor `useFavorites` :
  - Si connecté → lit/écrit dans `favorites` (Supabase) avec optimistic update via TanStack Query
  - Si déconnecté → fallback `localStorage` (comportement actuel)
  - À la connexion, merge des favoris locaux vers le cloud
- Page `/favorites` listant les events sauvegardés

### 4. Mini back-office venue
- `/admin` — protégé par rôle `venue` ou `admin`
- Liste des events possédés par l'utilisateur
- Formulaire create/edit event (titre, lieu, catégorie, date/heure, image, description, prix, lat/lng via clic sur mini-map, ticket URL)
- Bouton suppression avec confirm

### 5. i18n
- Ajout des clés: signIn, signUp, signOut, email, password, myAccount, myEvents, addEvent, editEvent, deleteEvent, favorites, loginRequired, etc.

### Détails techniques
- Garde-fou TanStack: serverFn protégés appelés uniquement depuis composants (pas loaders publics) — ici on utilise directement le client Supabase browser pour les writes utilisateur (RLS s'occupe de l'isolation).
- Route layout `_authenticated.tsx` avec `beforeLoad` qui redirige vers `/auth` si pas de session.
- Le rôle est vérifié côté client pour l'UI ET côté serveur via RLS (les RLS sur events bloquent les writes non-autorisés).
