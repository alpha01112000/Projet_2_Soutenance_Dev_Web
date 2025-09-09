# Guide Rapide Postman - AgriLink API

## Configuration de Base
- **URL Base**: `http://localhost:3000`
- **Content-Type**: `application/json`

## 🔐 Authentification

### 1. Inscription Acheteur
```http
POST /api/auth/register
```
**Body**:
```json
{
  "nom": "Dupont",
  "prenom": "Jean",
  "email": "acheteur@test.com",
  "password": "password123",
  "role": "acheteur",
  "telephone": "0123456789",
  "adresse": "123 Rue du Commerce, Paris"
}
```

### 2. Inscription Producteur
```http
POST /api/auth/register
```
**Body**:
```json
{
  "nom": "Martin",
  "prenom": "Pierre",
  "email": "producteur@test.com",
  "password": "password123",
  "role": "producteur",
  "telephone": "0987654321",
  "adresse": "456 Ferme Agricole, Normandie",
  "description": "Producteur bio depuis 10 ans"
}
```

### 3. Connexion
```http
POST /api/auth/login
```
**Body**:
```json
{
  "email": "acheteur@test.com",
  "password": "password123"
}
```

**Réponse**: Récupérez le token JWT pour les requêtes suivantes

## 📢 Annonces

### 1. Voir toutes les annonces (Public)
```http
GET /api/annonces
```

### 2. Créer une annonce (Producteur)
```http
POST /api/annonces
```
**Headers**: `Authorization: Bearer VOTRE_TOKEN_PRODUCTEUR`
**Body**:
```json
{
  "titre": "Tomates bio fraîches",
  "description": "Tomates biologiques cultivées sans pesticides",
  "prix": 2.5,
  "quantite": 100,
  "unite": "kg",
  "categorie": "légumes",
  "disponibilite": true
}
```

### 3. Voir mes annonces (Producteur)
```http
GET /api/annonces/me/mine
```
**Headers**: `Authorization: Bearer VOTRE_TOKEN_PRODUCTEUR`

### 4. Contacter un vendeur
```http
POST /api/contact
```
**Headers**: `Authorization: Bearer VOTRE_TOKEN_ACHETEUR`
**Body**:
```json
{
  "annonceId": "ID_DE_L_ANNONCE",
  "message": "Bonjour, je suis intéressé par vos produits",
  "quantiteDemandee": 5
}
```

## 🌱 Produits

### 1. Rechercher produits (Public)
```http
GET /api/produits?categorie=légumes
```

## Variables à Noter
- **Token utilisateur**: Récupéré après login
- **ID annonce**: Récupéré depuis GET /api/annonces

## Conseils
1. Commencez par vous inscrire et vous connecter
2. Notez le token JWT retourné
3. Utilisez le token dans le header Authorization
4. Testez les différentes fonctionnalités dans l'ordre
