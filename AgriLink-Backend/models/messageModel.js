const mongoose = require('mongoose');

const messageSchema = mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  annonce: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Annonce'
  },
  content: {
    type: String,
    required: [true, 'Veuillez ajouter un contenu au message.']
  },
  isRead: {
    type: Boolean,
    required: true,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Message', messageSchema);
