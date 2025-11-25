const jwt = require('jsonwebtoken');
const Player = require('../models/Player');


const authGuard = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: '❌ Token manquant - Accès refusé au royaume !'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const player = await Player.findById(decoded.id)
      .select('-password')
      .lean(); // .lean() pour meilleures performances

    if (!player) {
      return res.status(401).json({
        success: false,
        message: '❌ Token invalide - Héros introuvable'
      });
    }

    req.player = player;
    next(); 

  } catch (error) {
    console.error('Erreur middleware auth:', error.message);
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: '❌ Token corrompu ou invalide'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: '❌ Token expiré - Reconnectez-vous'
      });
    }

    res.status(500).json({
      success: false,
      message: '❌ Erreur serveur lors de l\'authentification'
    });
  }
};

module.exports = authGuard;