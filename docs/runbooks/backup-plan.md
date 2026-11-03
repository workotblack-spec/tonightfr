# Plan de sauvegarde vérifiable

- Date : 3 novembre 2026.
- Statut : **procédure préparée ; aucune exécution**.
- Périmètre : base Lovable Cloud (PostgreSQL 17.6) de Tonight FR, et Storage traité à part.

> Image simple : GitHub garde les **plans de la maison** (le code). La sauvegarde garde **les meubles et les papiers** (les données). Il faut les deux pour reconstruire la maison.

## Statut du projet aujourd'hui

- **Aucune sauvegarde manuelle ni aucun export** n'a été fait ou vérifié pendant cette session.
- Les **snapshots automatiques n'ont pas été inspectés** : ni leur date, ni leur nombre, ni leur durée de conservation ne sont confirmés.
- **Interdit de démarrer une migration** tant que le point de restauration (snapshot récent) et l'export ne sont pas confirmés et notés ici.
- Rappel : **une restauration remplace l'état de la base**, structure comprise. Tout ce qui a été écrit après le snapshot est perdu, et le code publié peut ne plus correspondre à la base.

## Procédure avant toute modification importante

### 1. Identifier

Noter : base visée (Lovable Cloud du projet Tonight FR), environnement (une seule base sert l'aperçu et le site publié), région (à lire dans l'interface ; non vérifiée), date et heure **UTC** du début de l'opération, commit Git en cours.

### 2. Vérifier le point de restauration

Dans **Cloud → Database → Backups** (libellé possible : More → Database → Manage → Backups) :
- lire et noter l'horodatage UTC du snapshot le plus récent ;
- vérifier que le bouton de restauration est présent ;
- ne rien cliquer. La documentation Lovable annonce une sauvegarde quotidienne ; ne rien promettre d'autre tant que ce n'est pas vu dans le compte.
- Pas de retour à une minute précise : seulement au snapshot quotidien le plus proche **avant**.

### 3. Export logique hors plateforme (si autorisé)

- Uniquement via **Cloud → Database → Settings → Export data**, sur décision écrite du responsable.
- L'export contient toute la base, y compris les **comptes et empreintes de mots de passe** : c'est une donnée personnelle sensible (LPD).
- Il ne contient pas : fichiers Storage, secrets, réglages de connexion, clés d'API.
- Limites annoncées par la documentation : une fois par 24 h ; le backend doit être actif.
- Pas de copie partielle improvisée, pas de script de dump.

### 4. Storage, séparément

- Inventorier les buckets et fichiers (aujourd'hui : **aucun bucket observé**, à revérifier le jour J).
- Si des fichiers existent : les télécharger depuis **Cloud → Storage** et les ranger avec l'export.

### 5. Emplacement, chiffrement, accès, rétention, intégrité

- Emplacement : espace de stockage maîtrisé par le responsable, **jamais** le dépôt GitHub ni un chat.
- Chiffrement : archive chiffrée (mot de passe fort conservé séparément, dans un gestionnaire de mots de passe).
- Accès : nominatif, au minimum de personnes.
- Rétention : à décider (proposition à valider : garder les 3 derniers exports avant changement important, puis supprimer).
- Intégrité : noter la taille et l'empreinte SHA-256 de l'archive au moment du dépôt, puis la recontrôler avant usage.

### 6. Valider la restauration en environnement isolé

- **Jamais sur le site publié.**
- Restaurer l'export dans un projet séparé, appartenant au responsable et explicitement autorisé.
- Reconfigurer les modes de connexion et les clés (non inclus dans l'export).
- Contrôles : nombre de tables, nombre de lignes par table, connexion d'un compte de test, ouverture d'une fiche soirée.
- Noter le résultat : « restauration testée le … , OK/KO », pas seulement « sauvegarde faite ».

### 7. Retour arrière et responsable

- Responsable qui autorise une restauration : **le propriétaire du projet (à nommer)**. Aucune restauration sans son accord écrit.
- Avant de restaurer : exporter l'état actuel, prévenir que les données postérieures au snapshot seront perdues, prévoir quelques minutes d'indisponibilité.
- Après : tester l'app ; tout écart de structure se corrige par une nouvelle migration, jamais à la main.
- Consigner l'opération dans le journal d'apprentissage.

## Fiche à remplir le jour J

| Élément | Valeur |
| --- | --- |
| Date/heure UTC | |
| Commit Git | |
| Région | |
| Dernier snapshot (UTC) | |
| Export fait (oui/non, date) | |
| Empreinte SHA-256 de l'archive | |
| Fichiers Storage copiés | |
| Restauration testée (où, résultat) | |
| Autorisé par | |
