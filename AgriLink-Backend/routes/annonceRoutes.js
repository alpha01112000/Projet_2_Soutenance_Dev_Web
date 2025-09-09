const express = require('express');
const router = express.Router();
const protect = require('../middlewares/authMiddleware');
const role = require('../middlewares/roleMiddleware');
const upload = require('../utils/uploader');
const {
  createAnnonce, getAnnonces, getMyAnnonces, getMyAnnoncesCount, getAnnonceById, updateAnnonce, deleteAnnonce, validateAnnonce
} = require('../controllers/annonceController');

// publiques
router.get('/', getAnnonces);
router.get('/:id', getAnnonceById);

// producteur
router.post('/', protect, role('producteur', 'admin'), upload.array('images', 5), validateAnnonce, createAnnonce);
router.get('/me/mine', protect, role('producteur', 'admin'), getMyAnnonces);
router.get('/me/count', protect, role('producteur', 'admin'), getMyAnnoncesCount);
router.put('/:id', protect, role('producteur', 'admin'), validateAnnonce, updateAnnonce);
router.delete('/:id', protect, role('producteur', 'admin'), deleteAnnonce);

module.exports = router;
