const User = require('../models/userModel');
const Annonce = require('../models/annonceModel');
const Produit = require('../models/produitModel');
const Message = require('../models/messageModel');

// Contrôleur complet pour l'admin avec tous les accès

// Gestion des utilisateurs
exports.manageUsers = async (req, res) => {
  try {
    const { action } = req.params;
    
    switch (action) {
      case 'list':
        const users = await User.find().select('-password');
        res.json({ success: true, users });
        break;
        
      case 'delete':
        const { userId } = req.body;
        await User.findByIdAndDelete(userId);
        res.json({ success: true, message: 'Utilisateur supprimé avec succès' });
        break;
        
      case 'ban':
        const { userId: banUserId } = req.body;
        await User.findByIdAndUpdate(banUserId, { isActive: false });
        res.json({ success: true, message: 'Utilisateur banni avec succès' });
        break;
        
      case 'unban':
        const { userId: unbanUserId } = req.body;
        await User.findByIdAndUpdate(unbanUserId, { isActive: true });
        res.json({ success: true, message: 'Utilisateur réactivé avec succès' });
        break;
        
      default:
        res.status(400).json({ message: 'Action non valide' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Gestion des annonces
exports.manageAnnonces = async (req, res) => {
  try {
    const { action } = req.params;
    
    switch (action) {
      case 'list':
        const annonces = await Annonce.find()
          .populate('vendeur', 'nom email')
          .sort({ createdAt: -1 });
        res.json({ success: true, annonces });
        break;
        
      case 'delete':
        const { annonceId } = req.body;
        await Annonce.findByIdAndDelete(annonceId);
        res.json({ success: true, message: 'Annonce supprimée avec succès' });
        break;
        
      case 'approve':
        const { annonceId: approveId } = req.body;
        await Annonce.findByIdAndUpdate(approveId, { statut: 'approuvée' });
        res.json({ success: true, message: 'Annonce approuvée avec succès' });
        break;
        
      case 'reject':
        const { annonceId: rejectId } = req.body;
        await Annonce.findByIdAndUpdate(rejectId, { statut: 'rejetée' });
        res.json({ success: true, message: 'Annonce rejetée avec succès' });
        break;
        
      default:
        res.status(400).json({ message: 'Action non valide' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Gestion des produits
exports.manageProduits = async (req, res) => {
  try {
    const { action } = req.params;
    
    switch (action) {
      case 'list':
        const produits = await Produit.find()
          .populate('vendeur', 'nom email')
          .sort({ createdAt: -1 });
        res.json({ success: true, produits });
        break;
        
      case 'delete':
        const { produitId } = req.body;
        await Produit.findByIdAndDelete(produitId);
        res.json({ success: true, message: 'Produit supprimé avec succès' });
        break;
        
      case 'feature':
        const { produitId: featureId } = req.body;
        await Produit.findByIdAndUpdate(featureId, { featured: true });
        res.json({ success: true, message: 'Produit mis en avant avec succès' });
        break;
        
      default:
        res.status(400).json({ message: 'Action non valide' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Statistiques globales
exports.getGlobalStats = async (req, res) => {
  try {
    const [
      totalUsers,
      totalAnnonces,
      totalProduits,
      totalMessages,
      activeUsers,
      pendingAnnonces,
      featuredProduits,
      recentActivity
    ] = await Promise.all([
      User.countDocuments(),
      Annonce.countDocuments(),
      Produit.countDocuments(),
      Message.countDocuments(),
      User.countDocuments({ isActive: true }),
      Annonce.countDocuments({ statut: 'en_attente' }),
      Produit.countDocuments({ featured: true }),
      User.find().sort({ lastLogin: -1 }).limit(5).select('nom email lastLogin')
    ]);

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalAnnonces,
        totalProduits,
        totalMessages,
        activeUsers,
        pendingAnnonces,
        featuredProduits,
        recentActivity
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Actions rapides
exports.quickActions = async (req, res) => {
  try {
    const { action } = req.body;
    
    switch (action) {
      case 'bulk-delete-users':
        const { userIds } = req.body;
        await User.deleteMany({ _id: { $in: userIds } });
        res.json({ success: true, message: 'Utilisateurs supprimés en masse' });
        break;
        
      case 'bulk-delete-annonces':
        const { annonceIds } = req.body;
        await Annonce.deleteMany({ _id: { $in: annonceIds } });
        res.json({ success: true, message: 'Annonces supprimées en masse' });
        break;
        
      case 'export-data':
        const { type } = req.body;
        let data;
        
        switch (type) {
          case 'users':
            data = await User.find().select('-password');
            break;
          case 'annonces':
            data = await Annonce.find().populate('vendeur', 'nom email');
            break;
          case 'produits':
            data = await Produit.find().populate('vendeur', 'nom email');
            break;
          default:
            return res.status(400).json({ message: 'Type d\'export non valide' });
        }
        
        res.json({ success: true, data });
        break;
        
      default:
        res.status(400).json({ message: 'Action rapide non valide' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Fonctionnalités avancées
exports.advancedFeatures = async (req, res) => {
  try {
    const { feature } = req.params;
    
    switch (feature) {
      case 'search':
        const { query, type } = req.query;
        let searchResults;
        
        switch (type) {
          case 'users':
            searchResults = await User.find({
              $or: [
                { nom: { $regex: query, $options: 'i' } },
                { email: { $regex: query, $options: 'i' } }
              ]
            }).select('-password');
            break;
          case 'annonces':
            searchResults = await Annonce.find({
              $or: [
                { titre: { $regex: query, $options: 'i' } },
                { description: { $regex: query, $options: 'i' } }
              ]
            }).populate('vendeur', 'nom email');
            break;
          case 'produits':
            searchResults = await Produit.find({
              $or: [
                { nom: { $regex: query, $options: 'i' } },
                { description: { $regex: query, $options: 'i' } }
              ]
            }).populate('vendeur', 'nom email');
            break;
        }
        
        res.json({ success: true, results: searchResults });
        break;
        
      case 'analytics':
        const analytics = await User.aggregate([
          {
            $group: {
              _id: {
                month: { $month: '$createdAt' },
                year: { $year: '$createdAt' }
              },
              count: { $sum: 1 }
            }
          }
        ]);
        res.json({ success: true, analytics });
        break;
        
      case 'notifications':
        const notifications = {
          pendingReviews: await Annonce.countDocuments({ statut: 'en_attente' }),
          newMessages: await Message.countDocuments({ lu: false }),
          newUsers: await User.countDocuments({ createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } })
        };
        res.json({ success: true, notifications });
        break;
        
      default:
        res.status(400).json({ message: 'Fonctionnalité avancée non valide' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
