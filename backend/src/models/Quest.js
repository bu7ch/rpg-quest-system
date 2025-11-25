const mongoose = require('mongoose');

const questSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true,
    trim: true 
  },
  description: { 
    type: String, 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['available', 'in_progress', 'completed'],
    default: 'available'
  },
  requirements: {
    minLevel: { type: Number, default: 1 },
    requiredItems: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Item' }]
  },
  rewards: {
    experience: { type: Number, default: 100 },
    items: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Item' }],
    gold: { type: Number, default: 0 }
  },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Quest', questSchema);