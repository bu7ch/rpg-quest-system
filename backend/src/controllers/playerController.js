const Player = require('../models/Player');
const Quest = require('../models/Quest');
const Item = require('../models/Item');
const mongoose = require('mongoose'); // 🔥 IMPORTANT: Ajouter mongoose

/**
 * @desc    Récupérer le profil complet du joueur
 * @route   GET /api/player/profile
 * @access  Private (nécessite authGuard)
 */
exports.getProfile = async (req, res) => {
    try {
      const player = await Player.findById(req.player._id)
        .populate('inventory.item', 'name description type effect')
        .populate('activeQuests.quest', 'title description rewards requirements')
        .populate('completedQuests', 'title description rewards')
        .select('-password -__v');
  
      res.status(200).json({
        success: true,
        message: `📊 Profil de ${player.username} chargé`,
        data: player
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: '❌ Erreur lors du chargement du profil',
        error: error.message
      });
    }
  };

/**
 * @desc    Accepter une quête disponible
 * @route   POST /api/player/accept-quest/:questId
 * @access  Private
 */
exports.acceptQuest = async (req, res) => {
    console.log('🔍 DEBUG req.player:', {
        type: typeof req.player,
        constructor: req.player?.constructor?.name,
        hasSave: typeof req.player?.save,
        keys: req.player ? Object.keys(req.player) : 'undefined'
      });
    try {
      const { questId } = req.params;
      
      const player = await Player.findById(req.player._id);
      
      if (!player) {
        return res.status(401).json({
          success: false,
          message: '❌ Joueur non authentifié'
        });
      }

      if (!questId || !mongoose.Types.ObjectId.isValid(questId)) {
        return res.status(400).json({
          success: false,
          message: '❌ ID de quête invalide'
        });
      }

      const quest = await Quest.findById(questId);
      if (!quest) {
        return res.status(404).json({
          success: false,
          message: '❌ Quête introuvable'
        });
      }

      if (!quest.isActive) {
        return res.status(400).json({
          success: false,
          message: '❌ Cette quête n\'est plus disponible'
        });
      }

      if (!quest.requirements || typeof quest.requirements.minLevel !== 'number') {
        return res.status(500).json({
          success: false,
          message: '❌ Configuration de la quête invalide'
        });
      }

      if (player.level < quest.requirements.minLevel) {
        return res.status(403).json({
          success: false,
          message: `❌ Niveau insuffisant (requis: ${quest.requirements.minLevel})`
        });
      }

      const isActive = player.activeQuests.some(q => 
        q.quest && q.quest.toString() === questId
      );
      
      const isCompleted = player.completedQuests.some(completedId => 
        completedId && completedId.toString() === questId
      );

      if (isActive) {
        return res.status(400).json({
          success: false,
          message: '❌ Quête déjà en cours'
        });
      }
      
      if (isCompleted) {
        return res.status(400).json({
          success: false,
          message: '❌ Quête déjà accomplie'
        });
      }

      player.activeQuests.push({ 
        quest: questId, 
        startedAt: new Date() 
      });

      await player.save();

      let populatedQuest;
      try {
        populatedQuest = await Quest.findById(questId)
          .populate('rewards.items', 'name type');
      } catch (populateError) {
        console.warn('⚠️ Erreur lors du populate:', populateError.message);
        populatedQuest = quest;
      }

      res.status(200).json({
        success: true,
        message: `✅ Quête "${quest.title}" acceptée !`,
        data: populatedQuest
      });

    } catch (error) {
      console.error('💥 Erreur critique acceptQuest:', error);
      
      if (error.name === 'CastError') {
        return res.status(400).json({
          success: false,
          message: '❌ Format d\'ID invalide'
        });
      }
      
      res.status(500).json({
        success: false,
        message: '❌ Erreur serveur lors de l\'acceptation de la quête',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  };

/**
 * @desc    Utiliser un objet de l'inventaire
 * @route   POST /api/player/use-item/:itemId
 * @access  Private
 */
exports.useItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    
    const player = await Player.findById(req.player._id);
    
    if (!player) {
      return res.status(401).json({
        success: false,
        message: '❌ Joueur non authentifié'
      });
    }

    const inventoryItem = player.inventory.find(
      inv => inv.item && inv.item.toString() === itemId
    );

    if (!inventoryItem || inventoryItem.quantity <= 0) {
      return res.status(400).json({
        success: false,
        message: '❌ Objet non possédé ou épuisé'
      });
    }

    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: '❌ Objet introuvable'
      });
    }

    let effectMessage = '';
    
    switch(item.type) {
      case 'potion':
        const oldHealth = player.stats.health;
        player.stats.health = Math.min(
          player.stats.health + (item.effect?.health || 0),
          player.stats.maxHealth
        );
        effectMessage = `💚 Santé +${player.stats.health - oldHealth} PV`;
        break;
      
      case 'weapon':
        effectMessage = `⚔️ Effet de ${item.name} activé`;
        break;
      
      default:
        effectMessage = '📦 Objet utilisé';
    }

    if (inventoryItem.quantity > 1) {
      inventoryItem.quantity -= 1;
    } else {
      player.inventory = player.inventory.filter(
        inv => inv.item.toString() !== itemId
      );
    }

    await player.save();

    const updatedPlayer = await Player.findById(player._id)
      .populate('inventory.item', 'name description type');

    res.status(200).json({
      success: true,
      message: `✅ ${item.name} utilisé(e)`,
      effect: effectMessage,
      inventory: updatedPlayer.inventory
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: '❌ Erreur lors de l\'utilisation de l\'objet',
      error: error.message
    });
  }
};


/**
 * @desc    Accomplir une quête en cours
 * @route   POST /api/player/complete-quest/:questId
 * @access  Private
 */
exports.completeQuest = async (req, res) => {
    try {
      const { questId } = req.params;
      
      // Récupérer le document Mongoose complet
      const player = await Player.findById(req.player._id);
      if (!player) {
        return res.status(401).json({
          success: false,
          message: '❌ Joueur non authentifié'
        });
      }
  
      // Validation de l'ID
      if (!questId || !mongoose.Types.ObjectId.isValid(questId)) {
        return res.status(400).json({
          success: false,
          message: '❌ ID de quête invalide'
        });
      }
  
      // Vérifier que la quête existe
      const quest = await Quest.findById(questId);
      if (!quest) {
        return res.status(404).json({
          success: false,
          message: '❌ Quête introuvable'
        });
      }
  
      if (!quest.isActive) {
        return res.status(400).json({
          success: false,
          message: '❌ Cette quête n\'est plus disponible'
        });
      }
  
      const activeQuestIndex = player.activeQuests.findIndex(aq => 
        aq.quest && aq.quest.toString() === questId
      );
  
      if (activeQuestIndex === -1) {
        return res.status(400).json({
          success: false,
          message: '❌ Cette quête n\'est pas en cours'
        });
      }
  
      const isAlreadyCompleted = player.completedQuests.some(completedId => 
        completedId && completedId.toString() === questId
      );
  
      if (isAlreadyCompleted) {
        return res.status(400).json({
          success: false,
          message: '❌ Cette quête est déjà terminée'
        });
      }
  
      console.log(`🎯 Validation de la quête: ${quest.title}`);
      // Pour ce projet, on considère la quête comme automatiquement validée
  
      const rewards = {
        experience: quest.rewards.experience || 0,
        gold: quest.rewards.gold || 0,
        items: quest.rewards.items || [] // Array d'ObjectIds
      };
  
      console.log('💰 Récompenses de la quête:', rewards);
  
      let rewardDetails = [];
  
      // Expérience
      if (rewards.experience > 0) {
        const oldLevel = player.level;
        const oldExp = player.experience || 0;
        player.experience = oldExp + rewards.experience;
        
        // Vérifier le niveau up (formule simple)
        const expNeededForNextLevel = player.level * 100;
        if (player.experience >= expNeededForNextLevel) {
          player.level += 1;
          player.experience -= expNeededForNextLevel;
          rewardDetails.push(`🎉 Niveau ${oldLevel} → ${player.level}`);
        }
        
        rewardDetails.push(`📈 +${rewards.experience} XP`);
      }
  
      // Or
      if (rewards.gold > 0) {
        player.gold = (player.gold || 0) + rewards.gold;
        rewardDetails.push(`💰 +${rewards.gold} pièces d'or`);
      }
  
      if (rewards.items && rewards.items.length > 0) {
        // Population des items pour avoir leurs noms
        const populatedItems = await Item.find({ 
          '_id': { $in: rewards.items } 
        });
        
        for (const item of populatedItems) {
          const existingInventoryItem = player.inventory.find(inv => 
            inv.item && inv.item.toString() === item._id.toString()
          );
  
          if (existingInventoryItem) {
            existingInventoryItem.quantity += 1;
          } else {
            player.inventory.push({
              item: item._id,
              quantity: 1
            });
          }
          
          rewardDetails.push(`🎁 ${item.name}`);
        }
      }
  
     
      player.activeQuests.splice(activeQuestIndex, 1);
      
      player.completedQuests.push(questId);
  
      player.stats = player.stats || {};
      player.stats.questsCompleted = (player.stats.questsCompleted || 0) + 1;
      player.stats.totalExperience = (player.stats.totalExperience || 0) + rewards.experience;
      player.stats.totalGold = (player.stats.totalGold || 0) + rewards.gold;
  
      await player.save();
  
      const updatedPlayer = await Player.findById(player._id)
        .populate('inventory.item', 'name type')
        .populate('completedQuests', 'title rewards');
  
      res.status(200).json({
        success: true,
        message: `🎉 Quête "${quest.title}" accomplie avec succès !`,
        data: {
          rewards: rewardDetails,
          player: {
            level: updatedPlayer.level,
            experience: updatedPlayer.experience,
            gold: updatedPlayer.gold,
            stats: updatedPlayer.stats
          },
          completedQuest: {
            _id: quest._id,
            title: quest.title,
            rewards: quest.rewards
          }
        }
      });
  
    } catch (error) {
      console.error('💥 Erreur completeQuest:', error);
      
      if (error.name === 'CastError') {
        return res.status(400).json({
          success: false,
          message: '❌ Format d\'ID invalide'
        });
      }
  
      if (error.name === 'ValidationError') {
        return res.status(400).json({
          success: false,
          message: '❌ Données de joueur invalides',
          errors: Object.values(error.errors).map(e => e.message)
        });
      }
  
      res.status(500).json({
        success: false,
        message: '❌ Erreur serveur lors de l\'accomplissement de la quête',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  };