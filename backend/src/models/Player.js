const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const playerSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 20
  },
  email: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Email invalide']
  },
  password: { 
    type: String, 
    required: true,
    minlength: 6
  },
  level: { type: Number, default: 1 },
  experience: { type: Number, default: 0 },
  experienceToNextLevel: { type: Number, default: 100 },
  stats: {
    health: { type: Number, default: 100 },
    maxHealth: { type: Number, default: 100 },
    strength: { type: Number, default: 10 },
    mana: { type: Number, default: 50 },
    maxMana: { type: Number, default: 50 }
  },
  inventory: [{
    item: { type: mongoose.Schema.Types.ObjectId, ref: 'Item' },
    quantity: { type: Number, default: 1 }
  }],
  activeQuests: [{
    quest: { type: mongoose.Schema.Types.ObjectId, ref: 'Quest' },
    startedAt: { type: Date, default: Date.now },
    progress: { type: Number, default: 0 }
  }],
  completedQuests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Quest' }],
  gold: { type: Number, default: 0 }
}, { timestamps: true });


playerSchema.pre('save', async function() {
  if (!this.isModified('password')) return; // Sortir si pas modifié
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Méthode pour comparer les mots de passe
playerSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('Player', playerSchema);