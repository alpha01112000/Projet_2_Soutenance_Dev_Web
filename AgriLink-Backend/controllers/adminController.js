const User = require('../models/userModel');
const Annonce = require('../models/annonceModel');

exports.getStats = async (req, res) => {
  const [users, producteurs, acheteurs, annonces] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ role: 'producteur' }),
    User.countDocuments({ role: 'acheteur' }),
    Annonce.countDocuments()
  ]);
  res.json({ users, producteurs, acheteurs, annonces });
};

exports.listAllAnnonces = async (req, res) => {
  const list = await Annonce.find().populate('vendeur', 'nom email role');
  res.json(list);
};
