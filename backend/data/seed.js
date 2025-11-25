const mongoose = require('mongoose');
require('dotenv').config();
const Item = require('../src/models/Item');
const Quest = require('../src/models/Quest');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('📦 Connexion à la base de données établie');

    await Item.deleteMany({});
    await Quest.deleteMany({});
    console.log('🧹 Anciennes données nettoyées');

    // Items de base - RESPECT STRICT DU MODÈLE
    const potion = await Item.create({
      name: 'Potion de Santé',
      description: 'Restaure 50 points de vie',
      type: 'potion',
      effect: { 
        health: 50,
        experience: 0,
        strength: 0
      }
    });

    const sword = await Item.create({
      name: 'Épée Enflammée',
      description: 'Une lame brûlante qui inflige des dégâts de feu',
      type: 'weapon',
      effect: { 
        health: 0,
        experience: 0,
        strength: 15
      }
    });

    const shield = await Item.create({
      name: 'Bouclier de Bois',
      description: 'Un bouclier simple mais efficace',
      type: 'armor',
      effect: { 
        health: 0,
        experience: 0,
        strength: 10
      }
    });

    const amulet = await Item.create({
      name: 'Amulette de Protection',
      description: 'Offre une protection magique contre les attaques',
      type: 'misc',
      effect: { 
        health: 20,
        experience: 0,
        strength: 5
      }
    });

    const manaPotion = await Item.create({
      name: 'Potion de Mana',
      description: 'Restaure 30 points de mana',
      type: 'potion',
      effect: { 
        health: 0,
        experience: 0,
        strength: 0
      }
    });

    const expScroll = await Item.create({
      name: 'Parchemin d\'Expérience',
      description: 'Accorde de l\'expérience lorsqu\'utilisé',
      type: 'misc',
      effect: { 
        health: 0,
        experience: 100,
        strength: 0
      }
    });

    const questItem = await Item.create({
      name: 'Pièce Antique',
      description: 'Une pièce ancienne nécessaire pour une quête',
      type: 'quest',
      effect: { 
        health: 0,
        experience: 0,
        strength: 0
      }
    });

    console.log('✅ 7 items créés selon le modèle:');

    // 🌟 5 QUÊTES VARIÉES RESPECTANT LE MODÈLE QUEST
    const quests = await Quest.create([
      {
        title: 'La Première Aventure',
        description: 'Tuer 3 rats dans les égouts de la ville',
        status: 'available',
        requirements: { 
          minLevel: 1,
          requiredItems: []
        },
        rewards: { 
          experience: 150, 
          items: [potion._id],
          gold: 50
        },
        isActive: true
      },
      {
        title: 'Chasse aux Gobelins',
        description: 'Les gobelins pillent les fermes aux alentours. Éliminez 5 gobelins dans la forêt voisine.',
        status: 'available',
        requirements: { 
          minLevel: 3,
          requiredItems: []
        },
        rewards: { 
          experience: 300, 
          items: [sword._id, potion._id],
          gold: 100
        },
        isActive: true
      },
      {
        title: 'La Pierre Ancestrale',
        description: 'Récupérez la pierre ancestrale volée dans le temple en ruines. Méfiez-vous des gardiens !',
        status: 'available',
        requirements: { 
          minLevel: 5,
          requiredItems: [questItem._id] 
        },
        rewards: { 
          experience: 500, 
          items: [amulet._id, expScroll._id],
          gold: 200
        },
        isActive: true
      },
      {
        title: 'Protection du Village',
        description: 'Aidez à renforcer les défenses du village en apportant des fournitures au forgeron.',
        status: 'available',
        requirements: { 
          minLevel: 2,
          requiredItems: []
        },
        rewards: { 
          experience: 200, 
          items: [shield._id],
          gold: 75
        },
        isActive: true
      },
      {
        title: 'L\'Herbe des Anciens',
        description: 'Trouvez l\'herbe médicinale rare dans les marais pour soigner les villageois malades.',
        status: 'available',
        requirements: { 
          minLevel: 4,
          requiredItems: []
        },
        rewards: { 
          experience: 400, 
          items: [potion._id, manaPotion._id, expScroll._id],
          gold: 150
        },
        isActive: true
      }
    ]);

    console.log('\n✅ 5 quêtes créées avec succès !');
    
    // Affichage détaillé
    console.log('\n📋 ITEMS CRÉÉS:');
    const items = await Item.find();
    items.forEach(item => {
      console.log(`🏷️  ${item.name} (${item.type})`);
      console.log(`   📝 ${item.description}`);
      console.log(`   ⚡ Effets: santé=${item.effect.health}, exp=${item.effect.experience}, force=${item.effect.strength}`);
    });

    console.log('\n🎯 QUÊTES DISPONIBLES:');
    quests.forEach(quest => {
      console.log(`\n📜 ${quest.title}`);
      console.log(`   📖 ${quest.description}`);
      console.log(`   📊 Niveau requis: ${quest.requirements.minLevel}`);
      console.log(`   🎁 Récompenses: ${quest.rewards.experience} XP, ${quest.rewards.gold} Or`);
      if (quest.rewards.items.length > 0) {
        console.log(`   🎒 Items: ${quest.rewards.items.length} item(s) à gagner`);
      }
      if (quest.requirements.requiredItems.length > 0) {
        console.log(`   🔐 Items requis: ${quest.requirements.requiredItems.length} item(s) nécessaires`);
      }
    });

    console.log('\n🎉 Seed terminé avec succès !');
    console.log('💡 Utilisez ces données pour tester votre jeu RPG.');
    
  } catch (error) {
    console.error('💥 Erreur lors du seed:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Connexion fermée');
    process.exit();
  }
};

seedData();