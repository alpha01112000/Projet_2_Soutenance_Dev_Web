const { body, validationResult } = require('express-validator');
const Message = require('../models/messageModel');
const Annonce = require('../models/annonceModel');
const sendEmail = require('../utils/sendEmail');

exports.validateContact = [
  body('annonce').notEmpty().withMessage('annonce requis'),
  body('contenu').notEmpty().withMessage('message requis')
];

exports.contactVendeur = async (req, res, next) => {
  try {
    const errors = validationResult(req); if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { annonceId, contenu } = req.body;
    const annonce = await Annonce.findById(annonceId).populate('vendeur', 'email nom');
    if (!annonce) return res.status(404).json({ error: 'Annonce introuvable' });

    // Vérifier que l'acheteur n'essaie pas de s'envoyer un message à lui-même
    if (annonce.vendeur._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ error: 'Vous ne pouvez pas vous envoyer de message à vous-même' });
    }

    const msg = await Message.create({
      annonce: annonce._id,
      sender: req.user._id,
      recipient: annonce.vendeur._id,
      content: contenu
    });

    // "Envoi" d’email (console)
    await sendEmail({
      to: annonce.vendeur.email,
      subject: `Nouveau message pour votre annonce: ${annonce.titre}`,
      text: `De: ${req.user.nom}\nMessage: ${contenu}`
    });

    res.status(201).json({ message: 'Message envoyé au vendeur', data: msg });
  } catch (e) { next(e); }
};

exports.getMyContactsCount = async (req, res) => {
  try {
    const count = await Message.countDocuments({ recipient: req.user._id });
    res.json({ count });
  } catch (error) {
    console.error('Erreur lors de la récupération du nombre de contacts:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

exports.getMyMessages = async (req, res) => {
  try {
    console.log('Récupération des messages pour l\'utilisateur:', req.user._id);
    const messages = await Message.find({ recipient: req.user._id })
      .populate('annonce', 'titre')
      .populate('sender', 'nom prenom email')
      .sort({ createdAt: -1 });
    console.log('Nombre de messages trouvés:', messages.length);
    res.json(messages);
  } catch (error) {
    console.error('Erreur lors de la récupération des messages:', error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
};
