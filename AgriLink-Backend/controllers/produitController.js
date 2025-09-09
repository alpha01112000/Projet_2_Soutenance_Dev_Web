const Produit = require('../models/produitModel');

exports.searchProduits = async (req, res, next) => {
  try {
    const { q, categorie } = req.query;
    const filter = {};
    if (q) filter.$text = { $search: q };
    if (categorie) filter.categorie = categorie;
    const produits = await Produit.find(filter);
    res.json(produits);
  } catch (e) { next(e); }
};

exports.createProduit = async (req, res) => {
  const p = await Produit.create(req.body);
  res.status(201).json(p);
};

exports.initSeeds = async (req, res) => {
  const count = await Produit.countDocuments();
  if (count > 0) return res.json({ message: 'Déjà rempli' });
  const seeds = [
    { nom: 'Maïs', categorie: 'Céréales', unite: 'kg', prixMoyen: 5 },
    { nom: 'Riz', categorie: 'Céréales', unite: 'kg', prixMoyen: 8 },
    { nom: 'Manioc', categorie: 'Tubercules', unite: 'kg', prixMoyen: 4 }
  ];
  await Produit.insertMany(seeds);
  res.json({ message: 'Seeds produits OK', inserted: seeds.length });
};
