# Sécurité des changements de base

## Règle immédiate

**Aucune écriture de base pendant l’étape documentaire.** Pas de migration, nouvelle table, correction de données, changement de RLS, de droits, de secret, de Vault, d’environnement ou de configuration externe.

Même une modification dite « sans risque » reste interdite dans ce périmètre. Voir [décision 0001](../decisions/0001-source-of-truth-migrations.md).

## Identifier avant d’agir

La base interrogée par Lovable est accessible. Le cadrage signale néanmoins une divergence entre la configuration du dépôt et le compte externe connecté. Ne pas assimiler automatiquement les projets de ce compte à l’environnement Lovable Cloud.

Tant que la correspondance n’est pas prouvée : ne réactiver, restaurer, créer, migrer ou remplacer aucun projet. Ne pas afficher les identifiants d’environnement ou les URL privées dans des documents pédagogiques.

## Lectures autorisées

Privilégier les métadonnées : noms des tables, activation RLS, contraintes, versions des journaux, noms des fichiers. Ne pas exporter les clients, téléphones, emails ou réservations pour effectuer un inventaire technique.

Ne pas lire aveuglément les corps de migrations ou fonctions historiques : ils peuvent contenir des secrets. Une analyse ultérieure devra utiliser une méthode qui masque les valeurs sensibles avant toute sortie.

## Avant toute future migration

1. Identifier l’environnement et résoudre l’historique divergent.
2. Disposer d’une sauvegarde datée adaptée aux données, au schéma et aux permissions concernés.
3. Vérifier la restauration dans un environnement isolé explicitement autorisé ; noter le résultat, pas seulement « sauvegarde créée ».
4. Expliquer la modification, le risque, les données affectées et la compatibilité avec le code encore publié.
5. Préférer les changements additifs et progressifs : ajouter, vérifier, adapter le code, puis seulement envisager un retrait ultérieur.
6. Définir les critères de contrôle et le retour arrière avant application.
7. Utiliser le mécanisme de migration finalement retenu et tracer sa version réellement appliquée.

Ne pas rejouer les trois fichiers Drizzle pour « remplir » le journal historique. Ne pas bricoler un registre pour qu’il ressemble au dépôt.

### Deux journaux en base (vérifié le 3 novembre 2026)

- `supabase_migrations.schema_migrations` : 17 lignes, historique jusqu’au 5 juillet 2026.
- `drizzle.__drizzle_migrations` : 3 lignes, identiques aux 3 fichiers Drizzle.
- Ne jamais modifier, supprimer ou renuméroter une ligne de ces journaux, ni éditer un fichier de migration déjà appliqué (3 fichiers Supabase diffèrent déjà de la base : le texte en base fait foi).
- Comparer les fichiers par **empreinte** (MD5/SHA-256) plutôt qu’en affichant leur contenu, pour ne pas exposer de secret.
- Avant toute nouvelle migration : relire les deux journaux en SELECT et vérifier qu’aucun fichier local n’est en attente.

## RLS et droits

Les sept tables publiques observées ont RLS activée. Cela n’est pas une preuve complète d’isolation.

Lors d’une future évolution autorisée :

- Accorder seulement les opérations nécessaires avec des `GRANT` explicites ; toute nouvelle table publique devra avoir ses droits dans la même migration, puis RLS et politiques adaptées.
- Refuser par défaut l’accès aux tables privées ; limiter les lectures publiques aux informations réellement publiques.
- Vérifier l’identité et l’appartenance au lieu, pas une valeur de rôle fournie par le navigateur ou le profil modifiable.
- Tester lecture et écriture avec utilisateur autorisé, utilisateur d’un autre lieu et visiteur non connecté.
- Vérifier aussi les colonnes modifiables : autoriser un changement de statut ne doit pas permettre de modifier arbitrairement l’identité du demandeur ou son événement.
- Ne pas utiliser un accès privilégié pour contourner les règles du parcours normal.

## Changements destructifs

Suppression de table ou colonne, effacement, renommage incompatible, changement de type ou contrainte cassant l’existant : **interdits sans vérification et autorisation explicite adaptées**.

La vérification doit couvrir sauvegarde, restauration, dépendances applicatives, données concernées, effet sur les comptes et retour arrière. Aucune de ces opérations n’est autorisée ici.

## Secret historique signalé

Le cadrage signale qu’une ancienne migration aurait exposé une authentification. Ne jamais recopier la valeur, même tronquée, dans le journal, les captures, le chat ou un nouveau commit.

La rotation contrôlée de `CRON_SECRET` est **urgente avant la prochaine étape de sécurité**. Elle nécessitera une procédure distincte : identifier les consommateurs autorisés, coordonner la mise à jour du stockage sécurisé et des tâches concernées, vérifier les appels légitimes et le refus de l’ancienne valeur. Aucun de ces changements n’est réalisé maintenant.

Supprimer une valeur de la version courante ne l’efface pas de l’historique et ne remplace pas une rotation. Ne pas réécrire l’historique de manière improvisée.

Ne partagez jamais un secret en clair : utilisez les réglages ou le formulaire sécurisé.

### Constats de structure (3 novembre 2026)

- Des tâches planifiées existent ou ont disparu **hors migration** : toujours relire `cron.job` (noms et indicateurs seulement, jamais la commande en clair) avant de planifier quoi que ce soit.
- Ne pas « corriger » le droit d’exécution de `has_role` sans test multi-comptes et autorisation : le retrait était volontaire.
- Comparer des fichiers sensibles par empreinte normalisée (commentaires et longues valeurs masqués), jamais par lecture.
