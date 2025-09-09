const { body, validationResult } = require('express-validator');
const Contact = require('../models/contactModel');
const sendEmail = require('../utils/sendEmail');

exports.validateContactForm = [
  body('name').notEmpty().withMessage('Le nom est requis'),
  body('email').isEmail().withMessage('Email invalide'),
  body('subject').notEmpty().withMessage('Le sujet est requis'),
  body('message').notEmpty().withMessage('Le message est requis')
];

exports.submitContactForm = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, subject, message } = req.body;

    const contact = await Contact.create({
      name,
      email,
      subject,
      message
    });

    // Envoyer un email de notification (optionnel)
    await sendEmail({
      to: 'contact@agrilink.com', // ou l'email de l'admin
      subject: `Nouveau message de contact: ${subject}`,
      text: `De: ${name} (${email})\nSujet: ${subject}\nMessage: ${message}`
    });

    res.status(201).json({ message: 'Message envoyé avec succès', data: contact });
  } catch (e) {
    next(e);
  }
};
