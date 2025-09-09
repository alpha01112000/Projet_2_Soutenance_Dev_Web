const request = require('supertest');
const app = require('../server');
const Produit = require('../models/produitModel');

describe('Produits API', () => {
  beforeAll(async () => {
    await Produit.deleteMany(); // Nettoyer la base de données avant les tests
  });

  it('devrait créer un produit', async () => {
    const res = await request(app)
      .post('/api/produits')
      .send({
        nom: 'Maïs',
        categorie: 'Céréales',
        unite: 'kg',
        prixMoyen: 5
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('nom', 'Maïs');
  });

  it('devrait récupérer tous les produits', async () => {
    const res = await request(app).get('/api/produits');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Array);
  });

  it('devrait rechercher des produits par nom', async () => {
    const res = await request(app).get('/api/produits?q=Maïs');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Array);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('devrait rechercher des produits par catégorie', async () => {
    const res = await request(app).get('/api/produits?categorie=Céréales');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Array);
    expect(res.body.length).toBeGreaterThan(0);
  });
});
