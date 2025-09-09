const express = require('express');
const router = express.Router();
const protect = require('../middlewares/authMiddleware');
const role = require('../middlewares/roleMiddleware');
const { searchProduits, createProduit, initSeeds } = require('../controllers/produitController');

// public: recherche/listing
router.get('/', searchProduits);

// admin: créer/seed
router.post('/', protect, role('admin'), createProduit);
router.post('/seed', protect, role('admin'), initSeeds);

module.exports = router;

