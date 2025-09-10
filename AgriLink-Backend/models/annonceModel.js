const mongoose = require('mongoose');

const annonceSchema = new mongoose.Schema(
  {
    titre: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    prix: { type: Number, required: true, min: 0 },
    quantite: {
        type: Number,
        required: true,
    },
    categorie: { type: String, required: true, enum: ['Fruits', 'Légumes', 'Grains', 'Autres'] },
    images: {
        type: [String], // Pour stocker plusieurs images
        required: true,
    },
    localisation: {
        region: {
            type: String,
            required: true,
        },
        ville: {
            type: String,
            required: true,
        },
    },
    contact: {
        nom: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            match: /.+\@.+\..+/ // Validation de l'email
        },
    },
    vendeur: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Ajout de la référence au vendeur
  },
  { timestamps: true }
);

annonceSchema.index({ titre: 'text', description: 'text' });

module.exports = mongoose.model('Annonce', annonceSchema);
