const mongoose = require('mongoose');

const produitSchema = new mongoose.Schema(
  {
    nom: { type: String, required: true, trim: true },
    categorie: { type: String, trim: true },
    unite: { type: String, trim: true }, // kg, tonne, sac...
    prixMoyen: { type: Number, default: 0 }
  },
  { timestamps: true }
);

produitSchema.index({ nom: 'text', categorie: 'text' });

module.exports = mongoose.model('Produit', produitSchema);
