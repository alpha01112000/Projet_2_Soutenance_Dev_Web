const User = require('../models/userModel');
const Annonce = require('../models/annonceModel');
const Produit = require('../models/produitModel');
const Message = require('../models/messageModel');

// Tableau de bord complet pour l'admin
exports.getDashboardData = async (req, res) => {
  try {
    const [
      totalUsers,
      totalAnnonces,
      totalProduits,
      totalMessages,
      recentUsers,
      recentAnnonces,
      recentMessages,
      statsByRole,
      annoncesByStatus,
      produitsByCategory
    ] = await Promise.all([
      // Statistiques globales
      User.countDocuments(),
      Annonce.countDocuments(),
      Produit.countDocuments(),
      Message.countDocuments(),

      // Utilisateurs récents (5 derniers)
      User.find().sort({ createdAt: -1 }).limit(5).select('-password'),

      // Annonces récentes (5 dernières)
      Annonce.find().sort({ createdAt: -1 }).limit(5).populate('vendeur', 'nom email'),

      // Messages récents (5 derniers)
      Message.find().sort({ createdAt: -1 }).limit(5).populate('expediteur destinataire', 'nom email'),

      // Statistiques par rôle
      User.aggregate([
        { $group: { _id: '$role', count: { $sum: 1 } } }
      ]),

      // Annonces par statut
      Annonce.aggregate([
        { $group: { _id: '$statut', count: { $sum: 1 } } }
      ]),

      // Produits par catégorie
      Produit.aggregate([
        { $group: { _id: '$categorie', count: { $sum: 1 } } }
      ])
    ]);

    const dashboardData = {
      overview: {
        totalUsers,
        totalAnnonces,
        totalProduits,
        totalMessages
      },
      recentActivity: {
        users: recentUsers,
        annonces: recentAnnonces,
        messages: recentMessages
      },
      analytics: {
        usersByRole: statsByRole,
        annoncesByStatus: annoncesByStatus,
        produitsByCategory: produitsByCategory
      },
      quickActions: {
        pendingUsers: await User.countDocuments({ isVerified: false }),
        pendingAnnonces: await Annonce.countDocuments({ statut: 'en_attente' }),
        unreadMessages: await Message.countDocuments({ lu: false })
      }
    };

    res.json({
      success: true,
      data: dashboardData,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des données du tableau de bord',
      error: error.message
    });
  }
};

// Widgets spécifiques pour le tableau de bord
exports.getWidgetData = async (req, res) => {
  try {
    const { widget } = req.params;

    let data;
    switch (widget) {
      case 'user-growth':
        data = await User.aggregate([
          {
            $group: {
              _id: {
                year: { $year: '$createdAt' },
                month: { $month: '$createdAt' }
              },
              count: { $sum: 1 }
            }
          },
          { $sort: { '_id.year': 1, '_id.month': 1 } }
        ]);
        break;

      case 'annonce-activity':
        data = await Annonce.aggregate([
          {
            $group: {
              _id: {
                year: { $year: '$createdAt' },
                month: { $month: '$createdAt' }
              },
              count: { $sum: 1 }
            }
          },
          { $sort: { '_id.year': 1, '_id.month': 1 } }
        ]);
        break;

      case 'top-categories':
        data = await Produit.aggregate([
          { $group: { _id: '$categorie', count: { $sum: 1 } } },
          { $sort: { count: -1 } },
          { $limit: 5 }
        ]);
        break;

      case 'recent-activity':
        const [users, annonces, messages] = await Promise.all([
          User.find().sort({ createdAt: -1 }).limit(3).select('nom email createdAt'),
          Annonce.find().sort({ createdAt: -1 }).limit(3).populate('vendeur', 'nom'),
          Message.find().sort({ createdAt: -1 }).limit(3).populate('expediteur', 'nom')
        ]);
        data = { users, annonces, messages };
        break;

      default:
        return res.status(400).json({ message: 'Widget non valide' });
    }

    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des données du widget',
      error: error.message
    });
  }
};

// Statistiques détaillées pour graphiques
exports.getChartData = async (req, res) => {
  try {
    const { period = '7d' } = req.query;
    
    let dateFilter = {};
    const now = new Date();
    
    switch (period) {
      case '7d':
        dateFilter = { createdAt: { $gte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000) } };
        break;
      case '30d':
        dateFilter = { createdAt: { $gte: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000) } };
        break;
      case '1y':
        dateFilter = { createdAt: { $gte: new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000) } };
        break;
    }

    const [userGrowth, annonceGrowth, messageGrowth] = await Promise.all([
      User.aggregate([
        { $match: dateFilter },
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' },
              day: { $dayOfMonth: '$createdAt' }
            },
            count: { $sum: 1 }
          }
        },
        { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
      ]),
      Annonce.aggregate([
        { $match: dateFilter },
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' },
              day: { $dayOfMonth: '$createdAt' }
            },
            count: { $sum: 1 }
          }
        },
        { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
      ]),
      Message.aggregate([
        { $match: dateFilter },
        {
          $group: {
            _id: {
              year: { $year: '$createdAt' },
              month: { $month: '$createdAt' },
              day: { $dayOfMonth: '$createdAt' }
            },
            count: { $sum: 1 }
          }
        },
        { $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 } }
      ])
    ]);

    res.json({
      success: true,
      data: {
        userGrowth,
        annonceGrowth,
        messageGrowth
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des données des graphiques',
      error: error.message
    });
  }
};
