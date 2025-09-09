const jwt = require('jsonwebtoken');
const adminConfig = require('../config/adminConfig');

// Admin login sans création d'utilisateur
exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Vérification des credentials admin
    if (email !== adminConfig.admin.email || password !== adminConfig.admin.password) {
      return res.status(401).json({ message: 'Identifiants admin invalides' });
    }

    // Génération du token JWT avec rôle admin
    const token = jwt.sign(
      { 
        id: 'admin-system', 
        email: adminConfig.admin.email, 
        role: 'admin',
        type: 'system-admin' 
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      token,
      admin: {
        email: adminConfig.admin.email,
        role: 'admin'
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

// Middleware pour vérifier le token admin
exports.verifyAdminToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '') || process.env.DEV_TOKEN; // Ajout d'un token de développement
  
  if (!token) {
    return res.status(401).json({ message: 'Accès refusé - Token manquant' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
    // Vérifier que c'est bien un token admin système
    if (decoded.type !== 'system-admin' || decoded.role !== 'admin') {
      return res.status(403).json({ message: 'Accès refusé - Permissions insuffisantes' });
    }
    
    req.admin = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token invalide' });
  }
};
