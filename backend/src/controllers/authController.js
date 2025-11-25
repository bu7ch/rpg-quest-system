const jwt = require('jsonwebtoken');
const Player = require('../models/Player');

const generateToken = (playerId) => {
  return jwt.sign(
    { id: playerId },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: '❌ Tous les champs sont requis'
      });
    }

    const existingPlayer = await Player.findOne({ email });
    if (existingPlayer) {
      return res.status(409).json({
        success: false,
        message: '❌ Un héros avec cet email existe déjà'
      });
    }

    const player = await Player.create({ name, email, password });

    const token = generateToken(player._id);

    res.status(201).json({
      success: true,
      message: `✅ Bienvenue ${name}, jeune aventurier !`,
      token,
      player: {
        id: player._id,
        name: player.name,
        email: player.email,
        level: player.level
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '❌ Erreur lors de la création du héros',
      error: error.message
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: '❌ Email et mot de passe requis'
      });
    }

    const player = await Player.findOne({ email });
    if (!player) {
      return res.status(401).json({
        success: false,
        message: '❌ Héros introuvable - Vérifiez vos identifiants'
      });
    }

    const isMatch = await player.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: '❌ Mot de passe incorrect'
      });
    }

    const token = generateToken(player._id);

    res.json({
      success: true,
      message: `✅ Bienvenue ${player.name} !`,
      token,
      player: {
        id: player._id,
        name: player.name,
        email: player.email,
        level: player.level
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '❌ Erreur lors de la connexion',
      error: error.message
    });
  }
};