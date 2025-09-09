const request = require('supertest');
const app = require('../server'); // Assurez-vous que le serveur est exporté
const User = require('../models/userModel');

describe('Auth API', () => {
  beforeAll(async () => {
    await User.deleteMany(); // Nettoyer la base de données avant les tests
  });

  it('devrait s\'inscrire un nouvel agriculteur', async () => {
    const res = await request(app)
      .post('/api/register/farmer')
      .send({
        prenom: 'Jean',
        nom: 'Dupont',
        email: 'jean.dupont@example.com',
        telephone: '0123456789',
        motDePasse: 'votreMotDePasse'
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('message', 'Agriculteur créé avec succès');
  });

  it('devrait échouer l\'inscription avec un email déjà utilisé', async () => {
    await request(app)
      .post('/api/register/farmer')
      .send({
        prenom: 'Jean',
        nom: 'Dupont',
        email: 'jean.dupont@example.com',
        telephone: '0123456789',
        motDePasse: 'votreMotDePasse'
      });

    const res = await request(app)
      .post('/api/register/farmer')
      .send({
        prenom: 'Jean',
        nom: 'Dupont',
        email: 'jean.dupont@example.com',
        telephone: '0123456789',
        motDePasse: 'votreMotDePasse'
      });
    expect(res.statusCode).toEqual(400);
  });

  it('devrait se connecter avec des identifiants valides', async () => {
    await request(app)
      .post('/api/register/farmer')
      .send({
        prenom: 'Jean',
        nom: 'Dupont',
        email: 'jean.dupont@example.com',
        telephone: '0123456789',
        motDePasse: 'votreMotDePasse'
      });

    const res = await request(app)
      .post('/api/login')
      .send({
        email: 'jean.dupont@example.com',
        password: 'votreMotDePasse'
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
  });

  it('devrait échouer la connexion avec des identifiants invalides', async () => {
    const res = await request(app)
      .post('/api/login')
      .send({
        email: 'invalid@example.com',
        password: 'wrongPassword'
      });
    expect(res.statusCode).toEqual(401);
  });
});
