const express = require('express');
const router = express.Router();
const { adminLogin, verifyAdminToken } = require('../controllers/adminAuthController');
const { getStats, listAllAnnonces } = require('../controllers/adminController');
const { getDashboardData, getWidgetData, getChartData } = require('../controllers/adminDashboardController');

// Route de connexion admin
router.post('/login', adminLogin);

// Routes du tableau de bord admin (protégées par token admin)
router.get('/dashboard/stats', verifyAdminToken, getStats);
router.get('/dashboard/annonces', verifyAdminToken, listAllAnnonces);
router.get('/dashboard', verifyAdminToken, getDashboardData);
router.get('/dashboard/widget/:widget', verifyAdminToken, getWidgetData);
router.get('/dashboard/chart/:period', verifyAdminToken, getChartData);

// Route pour vérifier si l'admin est connecté
router.get('/verify', verifyAdminToken, (req, res) => {
  res.json({ 
    success: true, 
    admin: req.admin,
    message: 'Admin authentifié avec succès' 
  });
});

module.exports = router;
