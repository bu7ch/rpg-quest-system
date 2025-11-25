import { useState, useEffect } from 'react';
import { useLoaderData, Navigate, useMatch } from '@tanstack/react-router';
import { useAuth } from '../../contexts/AuthContext.jsx';
import axios from 'axios';
import './QuestJournal.css';

const API_URL = 'http://localhost:3000/api';

export default function QuestJournal() {
  const { player, loading: authLoading, refreshPlayer } = useAuth();

  const match = useMatch({ from: '/quests' });
  const loaderData = match.loaderData;

  // États locaux
  const [availableQuests, setAvailableQuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [acceptingQuest, setAcceptingQuest] = useState(null);
  const [activeTab, setActiveTab] = useState('available');

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      headers: {
        Authorization: `Bearer ${token}`
      }
    };
  };

  useEffect(() => {
    if (loaderData) {
      const questsData = loaderData.data || loaderData;
      setAvailableQuests(Array.isArray(questsData) ? questsData : []);
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [loaderData]);

  // Redirection si non authentifié
  if (authLoading) {
    return (
      <div className="loading-container nes-container is-dark">
        <p className="nes-text">🔄 Chargement...</p>
        <progress className="nes-progress is-pattern" value="50" max="100"></progress>
      </div>
    );
  }

  if (!player) {
    return <Navigate to="/login" replace />;
  }

  // Accepter une quête
  const handleAcceptQuest = async (questId) => {
    try {
      setError('');
      setAcceptingQuest(questId);

      console.log(`🎯 Acceptation de la quête: ${questId}`);
      console.log('🔐 Token utilisé:', localStorage.getItem('token') ? 'Présent' : 'Absent');

      await axios.post(
        `${API_URL}/player/accept-quest/${questId}`, 
        {}, 
        getAuthHeaders() // headers avec token
      );

      await refreshPlayer();

      const res = await axios.get(`${API_URL}/quests/available`, getAuthHeaders());
      const newQuests = res.data.data || res.data;
      setAvailableQuests(Array.isArray(newQuests) ? newQuests : []);

      console.log('✅ Quête acceptée avec succès');

    } catch (error) {
      console.error('❌ Erreur acceptation quête:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      
      const errorMessage = error.response?.data?.message || 'Erreur lors de l\'acceptation de la quête';
      setError(errorMessage);
      
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    } finally {
      setAcceptingQuest(null);
    }
  };

  const handleCompleteQuest = async (questId) => {
    try {
      setError('');

      console.log(`🎯 Accomplissement de la quête: ${questId}`);

      const response = await axios.post(
        `${API_URL}/player/complete-quest/${questId}`,
        {},
        getAuthHeaders()
      );

      if (response.data.success) {
        await refreshPlayer();

        // Afficher les récompenses
        const rewardsText = response.data.data.rewards.join(', ');
        alert(`🎉 ${response.data.message}\n\n📦 Récompenses: ${rewardsText}`);

        // Recharger les quêtes disponibles
        const res = await axios.get(`${API_URL}/quests/available`, getAuthHeaders());
        const newQuests = res.data.data || res.data;
        setAvailableQuests(Array.isArray(newQuests) ? newQuests : []);
      }

    } catch (error) {
      console.error('❌ Erreur accomplissement quête:', error);
      const errorMessage = error.response?.data?.message || 'Erreur lors de l\'accomplissement de la quête';
      setError(errorMessage);
      
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    }
  };

  const handleAbandonQuest = async (activeQuestId) => {
    try {
      setError('');

      if (!confirm('Êtes-vous sûr de vouloir abandonner cette quête ?')) {
        return;
      }

      await axios.post(
        `${API_URL}/player/abandon-quest/${activeQuestId}`,
        {},
        getAuthHeaders()
      );

      await refreshPlayer();

      alert('✅ Quête abandonnée');

    } catch (error) {
      console.error('❌ Erreur abandon quête:', error);
      const errorMessage = error.response?.data?.message || 'Erreur lors de l\'abandon de la quête';
      setError(errorMessage);
      
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    }
  };

  const calculateProgress = (activeQuest) => {
    if (!activeQuest.progress) return 0;
    const { current = 0, total = 1 } = activeQuest.progress;
    return Math.min(Math.round((current / total) * 100), 100);
  };

  // const getQuestDuration = (startedAt) => {
  //   const startDate = new Date(startedAt);
  //   const now = new Date();
  //   const diffMs = now - startDate;
  //   const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

  //   if (diffHours < 1) return 'Moins d\'une heure';
  //   if (diffHours < 24) return `${diffHours}h`;

  //   const diffDays = Math.floor(diffHours / 24);
  //   return `${diffDays} jour${diffDays > 1 ? 's' : ''}`;
  // };

  // État de chargement principal
  if (loading) {
    return (
      <div className="loading-container nes-container is-dark">
        <p className="nes-text">🔄 Chargement du journal de quêtes...</p>
        <progress className="nes-progress is-pattern" value="50" max="100"></progress>
      </div>
    );
  }

  return (
    <div className="quest-journal nes-container with-title is-dark">
      <p className="title">📜 JOURNAL DE QUÊTES</p>

      {/* Affichage des erreurs */}
      {error && (
        <div className="nes-container is-rounded is-dark rpg-error">
          <p className="nes-text is-error">⚠️ {error}</p>
          <button
            className="nes-btn is-error"
            onClick={() => setError('')}
          >
            ×
          </button>
        </div>
      )}

      {/* 🔥  Navigation par onglets */}
      <div className="quest-tabs">
        <button
          className={`nes-btn ${activeTab === 'available' ? 'is-primary' : ''}`}
          onClick={() => setActiveTab('available')}
        >
          ✨ Disponibles
        </button>
        <button
          className={`nes-btn ${activeTab === 'active' ? 'is-warning' : ''}`}
          onClick={() => setActiveTab('active')}
        >
          ⚔️ En Cours ({player.activeQuests?.length || 0})
        </button>
        <button
          className={`nes-btn ${activeTab === 'completed' ? 'is-success' : ''}`}
          onClick={() => setActiveTab('completed')}
        >
          ✅ Terminées ({player.completedQuests?.length || 0})
        </button>
      </div>

      {/* SECTION QUÊTES DISPONIBLES */}
      {activeTab === 'available' && (
        <section className="available-quests">
          <h3 className="nes-text is-primary">✨ Quêtes disponibles</h3>

          {availableQuests.length === 0 ? (
            <div className="nes-container is-rounded is-dark empty-state">
              <p className="nes-text">🏰 Aucune quête disponible pour le moment...</p>
              <p className="nes-text is-disabled">
                Revenez plus tard ou augmentez votre niveau !
              </p>
            </div>
          ) : (
            <div className="quests-grid">
              {availableQuests.map(quest => {
                const canAccept = player.level >= (quest.requirements?.minLevel || 1);
                const isAccepting = acceptingQuest === (quest._id || quest.id);

                return (
                  <div key={quest._id || quest.id} className="nes-container is-rounded quest-card">
                    <div className="quest-header">
                      <h4 className="nes-text is-success">⚔️ {quest.title}</h4>
                      <span className="quest-difficulty nes-badge">
                        <span className={`is-${getDifficultyColor(quest.requirements?.minLevel || 1)}`}>
                          Niv. {quest.requirements?.minLevel || 1}
                        </span>
                      </span>
                    </div>

                    <p className="quest-description">{quest.description}</p>

                    {/* Objectifs de la quête */}
                    {quest.objectives && (
                      <div className="quest-objectives">
                        <p className="nes-text is-disabled">
                          <strong>Objectif:</strong> {quest.objectives.description}
                        </p>
                      </div>
                    )}

                    {/* Métadonnées de la quête */}
                    <div className="quest-meta">
                      <span className="nes-badge">
                        <span className="is-success">🎁 {quest.rewards?.experience || 0} XP</span>
                      </span>
                      {quest.rewards?.gold && (
                        <span className="nes-badge">
                          <span className="is-warning">💰 {quest.rewards.gold} Or</span>
                        </span>
                      )}
                      {quest.rewards?.items && quest.rewards.items.length > 0 && (
                        <span className="nes-badge">
                          <span className="is-primary">📦 {quest.rewards.items.length} Objet(s)</span>
                        </span>
                      )}
                    </div>

                    {/* Bouton d'acceptation */}
                    <button
                      onClick={() => handleAcceptQuest(quest._id || quest.id)}
                      disabled={!canAccept || isAccepting}
                      className={`nes-btn ${!canAccept ? 'is-disabled' : isAccepting ? 'is-warning' : 'is-primary'}`}
                    >
                      {isAccepting ? '⏳ Acceptation...' :
                        !canAccept ? `Niveau ${quest.requirements?.minLevel} requis` :
                          '⭐ Accepter la quête'}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      )}

      {/* SECTION QUÊTES EN COURS */}
      {activeTab === 'active' && (
        <section className="active-quests">
          <h3 className="nes-text is-warning">⚔️ Quêtes en cours</h3>

          {!player.activeQuests || player.activeQuests.length === 0 ? (
            <div className="nes-container is-rounded is-dark empty-state">
              <p className="nes-text">📭 Vous n'avez pas de quête active</p>
              <p className="nes-text is-disabled">
                Acceptez une quête disponible pour commencer votre aventure !
              </p>
            </div>
          ) : (
            <div className="quests-grid">
              {player.activeQuests.map((activeQuest, index) => {
                const progressPercentage = calculateProgress(activeQuest);
                const canComplete = progressPercentage >= 100; // Ou autre condition de validation

                return (
                  <div key={activeQuest.quest?._id || activeQuest.quest?.id || index} className="nes-container is-rounded active-quest-card">
                    <div className="quest-header">
                      <h4 className="nes-text is-warning">🎯 {activeQuest.quest?.title}</h4>
                      <div className="quest-actions">
                        <button
                          onClick={() => handleAbandonQuest(activeQuest.quest?._id || activeQuest.quest?.id)}
                          className="nes-btn is-error"
                          style={{ fontSize: '0.8rem', padding: '2px 8px' }}
                          title="Abandonner la quête"
                        >
                          ✕
                        </button>
                      </div>
                    </div>

                    <p className="quest-description">{activeQuest.quest?.description}</p>

                    {/* Barre de progression */}
                    <div className="quest-progress">
                      <div className="progress-info">
                        <small className="nes-text">
                          <strong>Progression:</strong> {activeQuest.progress?.current || 0}/{activeQuest.progress?.total || 1}
                        </small>
                        <small className="nes-text">
                          {progressPercentage}%
                        </small>
                      </div>

                      <div className="progress-bar-container">
                        <progress
                          className={`nes-progress ${getProgressColor(progressPercentage)}`}
                          value={activeQuest.progress?.current || 0}
                          max={activeQuest.progress?.total || 1}
                        ></progress>
                      </div>
                    </div>

                    {/* Bouton d'accomplissement */}
                    <button
                      onClick={() => handleCompleteQuest(activeQuest.quest?._id || activeQuest.quest?.id)}
                      disabled={!canComplete}
                      className={`nes-btn ${canComplete ? 'is-success' : 'is-disabled'}`}
                    >
                      {canComplete ? '✅ Accomplir la quête' : '⏳ En cours...'}
                    </button>

                    {/* Récompenses à venir */}
                    {activeQuest.quest?.rewards && (
                      <div className="quest-rewards">
                        <p className="nes-text is-success">
                          <strong>Récompenses:</strong> {activeQuest.quest.rewards.experience} XP
                          {activeQuest.quest.rewards.gold && `, ${activeQuest.quest.rewards.gold} Or`}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>
      )}

      {/* SECTION QUÊTES TERMINÉES */}
      {activeTab === 'completed' && (
        <section className="completed-quests">
          <h3 className="nes-text is-success">✅ Quêtes terminées</h3>

          {!player.completedQuests || player.completedQuests.length === 0 ? (
            <div className="nes-container is-rounded is-dark empty-state">
              <p className="nes-text">🏆 Aucune quête terminée pour le moment</p>
              <p className="nes-text is-disabled">
                Terminez vos quêtes en cours pour les voir apparaître ici !
              </p>
            </div>
          ) : (
            <div className="quests-grid">
              {player.completedQuests.map((quest, index) => (
                <div key={quest._id || quest.id || index} className="nes-container is-rounded completed-quest-card">
                  <h4 className="nes-text is-success">🏅 {quest.title}</h4>
                  <p>{quest.description}</p>

                  <div className="quest-meta">
                    <span className="nes-badge">
                      <span className="is-success">✅ Terminée</span>
                    </span>
                    {quest.rewards && (
                      <span className="nes-badge">
                        <span className="is-warning">🎁 {quest.rewards.experience} XP</span>
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {/* Informations du joueur */}
      <div className="player-info nes-container is-rounded">
        <h4 className="nes-text is-primary">👤 {player.username}</h4>
        <div className="player-stats">
          <p className="nes-text">Niveau: <strong>{player.level}</strong></p>
          <p className="nes-text">
            Quêtes: <strong>{player.activeQuests?.length || 0}</strong> actives,
            <strong> {player.completedQuests?.length || 0}</strong> terminées
          </p>
          {player.stats && (
            <p className="nes-text">
              Santé: <strong>{player.stats.health}/{player.stats.maxHealth}</strong>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// 🔥 Fonctions utilitaires
function getDifficultyColor(level) {
  if (level <= 5) return 'success';
  if (level <= 10) return 'warning';
  return 'error';
}

function getProgressColor(percentage) {
  if (percentage < 30) return 'is-error';
  if (percentage < 70) return 'is-warning';
  return 'is-success';
}