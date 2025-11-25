const mongoose = require('mongoose');

/**
 * @returns {Promise} - Promesse de connexion
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    
    console.log(`✅ MongoDB connecté: ${conn.connection.host}`);
    console.log(`📦 Base de données: ${conn.connection.name}`);
    
    return conn;
  } catch (error) {
    console.error('❌ Erreur de connexion MongoDB:', error.message);
    process.exit(1);
  }
};

mongoose.connection.on('connected', () => {
  console.log('🔗 Connexion à MongoDB établie');
});

mongoose.connection.on('error', (err) => {
  console.error('💥 Erreur MongoDB:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('🔌 Déconnecté de MongoDB');
});

process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('🛑 Connexion MongoDB fermée par l\'application');
  process.exit(0);
});

module.exports = connectDB;