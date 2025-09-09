const request = require('supertest');
const app = require('../server'); // Assurez-vous que le serveur est exporté
const Annonce = require('../models/annonceModel');

describe('Annonce API', () => {
  beforeAll(async () => {
    await Annonce.deleteMany(); // Nettoyer la base de données avant les tests
  });

  it('devrait créer une annonce', async () => {
    const res = await request(app)
      .post('/api/annonces')
      .send({
        titre: 'Test Annonce',
        description: 'Description de test',
        prix: 100,
        quantite: 10,
        images: ['image1.jpg'],
        localisation: { region: 'Test Region', ville: 'Test Ville' },
        contact: { nom: 'Test User', email: 'test@example.com' }
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('titre', 'Test Annonce');
  });

  it('devrait récupérer toutes les annonces', async () => {
    const res = await request(app).get('/api/annonces');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toBeInstanceOf(Array);
  });
});
