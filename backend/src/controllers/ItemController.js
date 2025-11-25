const Item = require('../models/Item');

exports.getAllItems = async (req, res) => {
  try {
    const items = await Item.find({})
      .sort({ type: 1, name: 1 })
      .select('-__v');
    
    res.status(200).json({
      success: true,
      count: items.length,
      data: items
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '❌ Erreur lors de la récupération des objets',
      error: error.message
    });
  }
};

exports.createItem = async (req, res) => {
  try {
    const item = await Item.create(req.body);
    
    res.status(201).json({
      success: true,
      message: '✅ Objet créé avec succès',
      data: item
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: '❌ Erreur lors de la création de l\'objet',
      error: error.message
    });
  }
};