const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true, 
    unique: true,
    trim: true 
  },
  description: { 
    type: String, 
    default: 'Un objet mystérieux...' 
  },
  type: { 
    type: String, 
    enum: ['potion', 'weapon', 'armor', 'quest', 'misc'],
    required: true 
  },
  effect: {
    health: { type: Number, default: 0 },
    experience: { type: Number, default: 0 },
    strength: { type: Number, default: 0 }
  }
}, { timestamps: true });

module.exports = mongoose.model('Item', itemSchema);