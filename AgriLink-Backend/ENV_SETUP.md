# Configuration des Variables d'Environnement AgriLink-Backend

## Modifications Apportées

### 1. Fichier `.env`
Le fichier `.env` a été configuré avec les variables suivantes :
- `PORT=3000` - Port du serveur
- `JWT_SECRET=votre_secret_jwt_tres_securise_ici` - Clé secrète pour JWT
- `JWT_EXPIRES=7d` - Durée d'expiration des tokens JWT
- `MONGO_URI=mongodb://localhost:27017/agriLink` - URI de connexion MongoDB
- Configuration email (optionnelle)

### 2. Fichier `server.js`
- Ajout de `require('dotenv').config()` pour charger les variables d'environnement
- Utilisation de `process.env.PORT` pour le port du serveur
- Utilisation de `connectDB()` depuis `config/db.js` pour la connexion à MongoDB

### 3. Fichier `config/db.js`
- Ajout d'une valeur par défaut pour `MONGO_URI`
- Gestion améliorée des erreurs de connexion

### 4. Fichier `utils/generateToken.js`
- Utilisation de `process.env.JWT_SECRET` et `process.env.JWT_EXPIRES`

## Utilisation

### Démarrage du serveur
```bash
npm start
# ou
node server.js
```

### Variables d'Environnement Requises
Assurez-vous que les variables suivantes sont définies dans votre fichier `.env` :

```env
PORT=3000
JWT_SECRET=votre_secret_jwt_tres_securise_ici
JWT_EXPIRES=7d
MONGO_URI=mongodb://localhost:27017/agriLink
```

### Configuration de la Base de Données
Le serveur utilisera automatiquement la valeur de `MONGO_URI` si elle est définie, sinon il utilisera la valeur par défaut `mongodb://localhost:27017/agriLink`.

### Sécurité
- Changez la valeur de `JWT_SECRET` pour une clé sécurisée en production
- Ne commitez jamais le fichier `.env` dans le contrôle de version
- Utilisez `.env.example` pour documenter les variables nécessaires

## Développement
Pour le développement, vous pouvez créer un fichier `.env.development` avec des valeurs spécifiques à l'environnement de développement.
