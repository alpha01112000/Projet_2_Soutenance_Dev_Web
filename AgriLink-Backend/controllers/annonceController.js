const { body, validationResult } = require('express-validator');
const Annonce = require('../models/annonceModel');

exports.validateAnnonce = [
  body('annonceId').isEmpty().withMessage('annonceId ne doit pas être présent'),
  body('titre').notEmpty().withMessage('titre requis'),
  body('description').notEmpty().withMessage('description requise'),
  body('prix').isFloat({ min: 0 }).withMessage('prix >= 0'),
  body('quantite').isInt({ min: 1 }).withMessage('quantite requise et >= 1'),
  body('localisation.region').notEmpty().withMessage('région requise'),
  body('localisation.ville').notEmpty().withMessage('ville requise'),
  body('contact.nom').notEmpty().withMessage('nom de contact requis'),
  body('contact.email').isEmail().withMessage('email valide requis')
];

exports.createAnnonce = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    // Vérifier que l'utilisateur est un producteur
    if (req.user.role !== 'producteur') {
      return res.status(403).json({ error: 'Seuls les producteurs peuvent créer des annonces.' });
    }

    // Vérifier qu'au moins une image a été uploadée
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ errors: [{ msg: 'Au moins une image est requise' }] });
    }

    // Traiter les fichiers uploadés
    let images = [];
    if (req.files && req.files.length > 0) {
      images = req.files.map(file => `/uploads/${file.filename}`);
    }

    const data = {
      ...req.body,
      vendeur: req.user._id,
      images: images // Remplacer les images par les chemins des fichiers uploadés
    };

    const annonce = await Annonce.create(data);
    res.status(201).json(annonce);
  } catch (e) { next(e); }
};

exports.getAnnonces = async (req, res, next) => {
  try {
    const { q, vendeur, dispo } = req.query;
    const filter = {};
    if (q) filter.$text = { $search: q };
    if (vendeur) filter.vendeur = vendeur;
    if (dispo !== undefined) filter.disponibilite = dispo === 'true';

    // Fix for count query: if q === 'count', return count instead of find
    if (q === 'count') {
      const count = await Annonce.countDocuments(filter);
      return res.json({ count });
    }

    const annonces = await Annonce.find(filter).populate('vendeur', 'nom role email');
    res.json(annonces);
  } catch (e) { next(e); }
};

exports.getMyAnnonces = async (req, res) => {
  try {
    console.log('Récupération des annonces pour l\'utilisateur:', req.user._id);
    const annonces = await Annonce.find({ vendeur: req.user._id });
    console.log('Nombre d\'annonces trouvées:', annonces.length);
    res.json(annonces);
  } catch (error) {
    console.error('Erreur lors de la récupération des annonces:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

exports.getAnnonceById = async (req, res) => {
  // Prevent 'count' string from being used as an ObjectId
  if (req.params.id === 'count') {
    return res.status(400).json({ error: 'Invalid ID parameter' });
  }
  const a = await Annonce.findById(req.params.id).populate('vendeur', 'nom email role');
  if (!a) return res.status(404).json({ error: 'Annonce non trouvée' });
  res.json(a);
};

exports.updateAnnonce = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const a = await Annonce.findById(req.params.id);
  if (!a) return res.status(404).json({ error: 'Annonce non trouvée' });
  if (a.vendeur.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Non autorisé' });
  }
  Object.assign(a, req.body);
  await a.save();
  res.json(a);
};

exports.deleteAnnonce = async (req, res) => {
  const a = await Annonce.findById(req.params.id);
  if (!a) return res.status(404).json({ error: 'Annonce non trouvée' });
  if (a.vendeur.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Non autorisé' });
  }
  await a.deleteOne();
  res.json({ message: 'Annonce supprimée' });
};

exports.getMyAnnoncesCount = async (req, res) => {
  try {
    const count = await Annonce.countDocuments({ vendeur: req.user._id });
    res.json({ count });
  } catch (error) {
    console.error('Erreur lors de la récupération du nombre d\'annonces:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};
