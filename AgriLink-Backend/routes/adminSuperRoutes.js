const express = require('express');
const router = express.Router();
const { verifyAdminToken } = require('../controllers/adminAuthController');
const {
  manageUsers,
  manageAnnonces,
  manageProduits,
  getGlobalStats,
  quickActions,
  advancedFeatures
} = require('../controllers/adminSuperController');

// Routes de gestion des utilisateurs
router.post('/users/:action', verifyAdminToken, manageUsers);
router.get('/users', verifyAdminToken, (req, res) => manageUsers(req, res, 'list'));

// Routes de gestion des annonces
router.post('/annonces/:action', verifyAdminToken, manageAnnonces);
router.get('/annonces', verifyAdminToken, (req, res) => manageAnnonces(req, res, 'list'));

// Routes de gestion des produits
router.post('/produits/:action', verifyAdminToken, manageProduits);
router.get('/produits', verifyAdminToken, (req, res) => manageProduits(req, res, 'list'));

// Statistiques globales
router.get('/stats/global', verifyAdminToken, getGlobalStats);

// Actions rapides
router.post('/actions/quick', verifyAdminToken, quickActions);

// Fonctionnalités avancées
router.get('/features/:feature', verifyAdminToken, advancedFeatures);

module.exports = router;
