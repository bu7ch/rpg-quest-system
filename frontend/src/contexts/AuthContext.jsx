// frontend/src/contexts/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refreshPlayer = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await axios.get('http://localhost:3000/api/player/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log('🔄 Réponse refreshPlayer:', response.data);
      
      if (response.data.success) {
        const playerData = response.data.data || response.data.player;
        if (playerData) {
          setPlayer(playerData);
          setError(null);
        }
      }
    } catch (error) {
      console.error('❌ Erreur rafraîchissement joueur:', error);
      setError('Impossible de rafraîchir le profil');
    }
  };

  // Chargement initial du joueur
  useEffect(() => {
    const initializePlayer = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const response = await axios.get('http://localhost:3000/api/player/profile', {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          console.log('📦 Réponse initialisation:', response.data);
          
          if (response.data.success) {
            const playerData = response.data.data || response.data.player;
            if (playerData) {
              setPlayer(playerData);
            }
          }
        }
      } catch (error) {
        console.error('❌ Erreur initialisation:', error);
        localStorage.removeItem('token');
        setError('Session expirée');
      } finally {
        setLoading(false);
      }
    };

    initializePlayer();
  }, []);

  const value = {
    player,
    loading,
    error,
    refreshPlayer,
    login: async (credentials) => {
      try {
        setError(null);
        const response = await axios.post('http://localhost:3000/api/auth/login', credentials);
        
        console.log('🔐 Réponse login:', response.data);
        
        if (response.data.success) {
          localStorage.setItem('token', response.data.token);
          
          const playerData = response.data.data?.player || response.data.data || response.data.player;
          
          if (playerData) {
            setPlayer(playerData);
            return response.data;
          } else {
            throw new Error('Données joueur manquantes dans la réponse');
          }
        } else {
          throw new Error(response.data.message || 'Erreur de connexion');
        }
      } catch (error) {
        console.error('❌ Erreur login:', error);
        const errorMessage = error.response?.data?.message || error.message || 'Erreur de connexion';
        setError(errorMessage);
        return { success: false, message: errorMessage };
      }
    },
    register: async (userData) => {
      try {
        setError(null);
        const response = await axios.post('http://localhost:3000/api/auth/register', userData);
        
        console.log('📝 Réponse register:', response.data);
        
        if (response.data.success) {
          localStorage.setItem('token', response.data.token);
          
          const playerData = response.data.data?.player || response.data.data || response.data.player;
          
          if (playerData) {
            setPlayer(playerData);
            return response.data;
          } else {
            throw new Error('Données joueur manquantes dans la réponse');
          }
        } else {
          throw new Error(response.data.message || 'Erreur d\'inscription');
        }
      } catch (error) {
        console.error('❌ Erreur register:', error);
        const errorMessage = error.response?.data?.message || error.message || 'Erreur d\'inscription';
        setError(errorMessage);
        return { success: false, message: errorMessage };
      }
    },
    logout: () => {
      localStorage.removeItem('token');
      setPlayer(null);
      setError(null);
    },
    clearError: () => setError(null)
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}