# Modifications apportées au tableau de bord

## Backend - Nouveaux points de terminaison ajoutés
- [x] Ajout de `getMyAnnoncesCount` dans `annonceController.js` pour compter les annonces de l'utilisateur connecté
- [x] Ajout de `getMyContactsCount` dans `contactController.js` pour compter les contacts reçus par l'utilisateur
- [x] Ajout de la route `/api/annonces/me/count` dans `annonceRoutes.js`
- [x] Ajout de la route `/api/contact/me/count` dans `contactRoutes.js`

## Frontend - Modifications apportées
- [x] Mise à jour de `fetchStats` pour utiliser les nouveaux points de terminaison spécifiques à l'utilisateur
- [x] Mise à jour de `fetchDernieresAnnonces` pour utiliser le point de terminaison `/api/annonces/me/mine` avec authentification
- [x] Ajout des headers d'autorisation pour toutes les requêtes nécessitant une authentification

## Résultat
Le tableau de bord affiche maintenant uniquement :
- Les statistiques personnelles de l'utilisateur connecté (nombre d'annonces publiées, nombre de contacts reçus)
- Les dernières annonces publiées par l'utilisateur connecté
- Les messages reçus par l'utilisateur connecté

Chaque producteur voit désormais uniquement ses propres données dans le tableau de bord.
