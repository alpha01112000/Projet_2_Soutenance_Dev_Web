# Guide d'utilisation de Postman pour l'inscription

## Inscription des Agriculteurs
### Endpoint
```
POST /api/register/farmer
```
### Corps de la requête (JSON)
```json
{
    "prenom": "Jean",
    "nom": "Dupont",
    "email": "jean.dupont@example.com",
    "telephone": "0123456789",
    "motDePasse": "votreMotDePasse"
}
```

## Inscription des Acheteurs
### Endpoint
```
POST /api/register/buyer
```
### Corps de la requête (JSON)
```json
{
    "prenom": "Marie",
    "nom": "Curie",
    "email": "marie.curie@example.com",
    "telephone": "0987654321",
    "adresse": "123 Rue de la Paix",
    "ville": "Paris",
    "etat": "Île-de-France",
    "motDePasse": "votreMotDePasse"
}
