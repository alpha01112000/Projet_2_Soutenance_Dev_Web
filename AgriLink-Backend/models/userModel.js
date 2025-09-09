const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    prenom: { type: String, required: true, trim: true }, // Champ pour les deux types
    nom: { type: String, required: true, trim: true },    // Champ pour les deux types
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 8 },
    role: { type: String, enum: ['producteur', 'acheteur', 'admin'], default: 'acheteur' },
    telephone: { type: String, trim: true },
    // Champs spécifiques aux acheteurs
    adresse: { type: String, trim: true }, // Champ pour les acheteurs
    ville: { type: String, trim: true },   // Champ pour les acheteurs
    etat: { type: String, trim: true },    // Champ pour les acheteurs
    // Champs spécifiques aux producteurs
    typeCulture: { type: String, enum: ['fruits', 'legumes', 'grains', 'autres'], trim: true }, // Champ pour les producteurs
    superficie: { type: Number, min: 0 }, // Champ pour les producteurs (en hectares)
    experience: { type: Number, min: 0 } // Champ pour les producteurs (années)
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = function (pwd) {
  return bcrypt.compare(pwd, this.password);
};

module.exports = mongoose.model('User', userSchema);
