const mongoose = require('mongoose');

const contactSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Veuillez ajouter votre nom complet.']
  },
  email: {
    type: String,
    required: [true, 'Veuillez ajouter votre email.'],
    match: [/^\S+@\S+\.\S+$/, 'Veuillez entrer un email valide.']
  },
  subject: {
    type: String,
    required: [true, 'Veuillez ajouter un sujet.']
  },
  message: {
    type: String,
    required: [true, 'Veuillez ajouter un message.']
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Contact', contactSchema);
