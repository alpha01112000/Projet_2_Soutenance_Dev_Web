const User = require('../models/userModel');
const { validationResult } = require('express-validator');

exports.registerUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { prenom, nom, email, telephone, password, adresse, ville, etat, type } = req.body;

    try {
        const newUser = new User({
            prenom,
            nom,
            email,
            telephone,
            password,
            adresse,
            ville,
            etat,
            type
        });

        await newUser.save();
        res.status(201).json({ message: 'Utilisateur créé avec succès' });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la création de l\'utilisateur' });
    }
};

exports.getMyProfile = async (req, res) => {
  res.json(req.user);
};

exports.getAllUsers = async (req, res) => {
  const users = await User.find().select('-password');
  res.json(users);
};
