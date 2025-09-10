const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'defaultsecret', { expiresIn: '30d' });
};

exports.validateRegister = [
  body('nom').notEmpty().withMessage('nom requis'),
  body('prenom').optional(),
  body('email').isEmail().withMessage('email invalide'),
  body('password').isLength({ min: 8 }).withMessage('min 8 caractères'),
  body('role').optional().isIn(['producteur', 'acheteur', 'admin']).withMessage('rôle invalide')
];

exports.registerUser = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    let { prenom, nom, email, telephone, password, role, adresse, ville, etat, typeCulture, superficie, experience, certification, nomComplet } = req.body;

    // If nomComplet is provided, split into prenom and nom
    if (nomComplet && (!prenom || !nom)) {
      const nameParts = nomComplet.trim().split(' ');
      prenom = nameParts.shift() || '';
      nom = nameParts.join(' ') || '';
    }

    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ error: 'Email déjà utilisé' });

    // Préparer les données selon le rôle
    const userData = {
      prenom,
      nom,
      email,
      telephone,
      adresse,
      ville,
      password,
      role: role || 'acheteur'
    };

    // Ajouter les champs spécifiques aux producteurs
    if (role === 'producteur') {
      userData.typeCulture = typeCulture;
      userData.superficie = superficie;
      userData.experience = experience;
      userData.certification = certification;
    }

    const user = await User.create(userData);
    const token = generateToken(user._id);
    res.status(201).json({ token, user: { id: user._id, nom: user.nom, email: user.email, role: user.role } });
  } catch (e) {
    next(e);
  }
};

exports.validateLogin = [
  body('email').isEmail().withMessage('email invalide'),
  body('password').notEmpty().withMessage('mot de passe requis')
];

exports.loginUser = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) return res.status(401).json({ error: 'Identifiants invalides' });
    const token = generateToken(user._id);
    res.json({ token, user: { id: user._id, nom: user.nom, email: user.email, role: user.role } });
  } catch (e) {
    next(e);
  }
};

exports.me = async (req, res) => {
  res.json({ user: req.user });
};
