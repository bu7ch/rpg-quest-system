import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext.jsx';
import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

export default function Inventory() {
  const { player, login } = useAuth(); // login pour recharger le profil après utilisation
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleUseItem = async (itemId, itemName) => {
    setLoading(true);
    setError('');
    
    try {
      const response = await axios.post(`${API_URL}/player/use-item/${itemId}`);
      alert(`✅ ${response.data.message}`);
      
      await login(player.email, 'password123'); 
    } catch (error) {
      setError(error.response?.data?.message || '❌ Erreur lors de l\'utilisation');
    } finally {
      setLoading(false);
    }
  };

  if (!player) return null;

  return (
    <div className="inventory-page nes-container with-title is-dark">
      <p className="title">🎒 INVENTAIRE DU HÉROS</p>
      
      {error && <div className="nes-balloon from-left rpg-error">{error}</div>}
      
      <div className="inventory-grid">
        {player.inventory?.length === 0 ? (
          <p className="nes-text">Votre inventaire est vide...</p>
        ) : (
          player.inventory.map(({ item, quantity }) => (
            <div key={item._id} className="nes-container inventory-item">
              <div className="item-icon">
                <i className={`nes-icon ${getItemIcon(item.type)} is-medium`}></i>
              </div>
              
              <div className="item-info">
                <h4>{item.name}</h4>
                <p className="nes-text">{item.description}</p>
                <span className="nes-badge">
                  <span className="is-dark">x{quantity}</span>
                </span>
              </div>
              
              <div className="item-actions">
                <button
                  onClick={() => handleUseItem(item._id, item.name)}
                  disabled={loading}
                  className="nes-btn is-success"
                >
                  {loading ? '...' : 'Utiliser'}
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="inventory-stats nes-container">
        <p className="nes-text">💰 Or: {player.gold}</p>
        <p className="nes-text">❤️ Santé: {player.stats.health}/{player.stats.maxHealth}</p>
      </div>
    </div>
  );
}

// Fonction helper pour les icônes
function getItemIcon(type) {
  const icons = {
    potion: 'heart', // ❤️
    weapon: 'sword', // ⚔️
    armor: 'shield', // 🛡️
    quest: 'scroll', // 📜
    misc: 'coin' // 🪙
  };
  return icons[type] || 'star';
}