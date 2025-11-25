const Quest = require('../models/Quest');

exports.getAvailableQuests = async (req, res) => {
  try {
    const quests = await Quest.find({ 
      isActive: true,
      status: 'available'
    })
    .populate('rewards.items', 'name description type')
    .populate('requirements.requiredItems', 'name type')
    .select('-__v')
    .sort({ 'requirements.minLevel': 1 });

    res.status(200).json({
      success: true,
      count: quests.length,
      data: quests
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '❌ Erreur lors de la récupération des quêtes',
      error: error.message
    });
  }
};

exports.createQuest = async (req, res) => {
  try {
    const quest = await Quest.create(req.body);
    
    res.status(201).json({
      success: true,
      message: '✅ Quête créée avec succès',
      data: quest
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: '❌ Erreur lors de la création de la quête',
      error: error.message
    });
  }
};