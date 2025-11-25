const express = require('express');
require('dotenv').config();
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

// Middleware globaux
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: 'http://localhost:5173', 
    credentials: true, 
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'], 
  }));
connectDB();

//routes
app.use('/api/auth', require('./routes/authRoutes'));     // Inscription / Connexion
app.use('/api/items', require('./routes/itemRoutes'));    // Objets du jeu
app.use('/api/quests', require('./routes/questRoutes'));  // Quêtes disponibles

// Routes protégées (nécessitent JWT)
app.use('/api/player', require('./routes/playerRoutes')); // Actions du joueur
// Route racine
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: '🏰 Bienvenue dans le Royaume d\'Algorithmia !',
    endpoints: {
      auth: '/api/auth (register, login)',
      items: '/api/items (GET, POST)',
      quests: '/api/quests/available (GET)',
      player: '/api/player/* (profil, quêtes, inventaire)'
    }
  });
});


// Lancement serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur le port ${PORT}`);
});

module.exports= app