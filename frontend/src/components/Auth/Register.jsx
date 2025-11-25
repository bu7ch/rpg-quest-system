import { useState } from 'react';
import { useNavigate, Link } from '@tanstack/react-router';
import { useAuth } from '../../contexts/AuthContext.jsx';

export default function Register() {
  const [formData, setFormData] = useState({
    username: '', 
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    const result = await register(formData);
    
    console.log('📨 Résultat register:', result);
    
    if (result.success) {
      navigate({ to: '/quests' });
    } else {
      setError(result.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="auth-container">
      <div className="nes-container with-title auth-card">
        <p className="title">🎭 CRÉER UN HÉROS</p>
        
        {error && (
          <div className="nes-container is-rounded is-dark rpg-error">
            <p className="nes-text is-error">{error}</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="nes-field">
            <label>Nom du héros</label>
            <input
              type="text"
              name="username" 
              placeholder="Votre nom d'aventurier"
              className="nes-input"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="nes-field">
            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="Votre email"
              className="nes-input"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="nes-field">
            <label>Mot de passe</label>
            <input
              type="password"
              name="password"
              placeholder="Votre mot de passe"
              className="nes-input"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          
          <button type="submit" className="nes-btn is-primary">
            Forger le Héros
          </button>
          
          <p style={{ marginTop: '20px', textAlign: 'center' }}>
            Déjà un aventurier ? <Link to="/login">Se connecter</Link>
          </p>
        </form>
      </div>
    </div>
  );
}