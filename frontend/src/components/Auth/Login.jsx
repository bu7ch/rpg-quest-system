import { useState } from 'react';
import { useNavigate, Link } from '@tanstack/react-router';
import { useAuth } from '../../contexts/AuthContext.jsx';

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    const result = await login(formData);
    
    console.log('📨 Résultat login:', result);
    
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
        <p className="title">🔐 CONNEXION</p>
        
        {error && (
          <div className="nes-container is-rounded is-dark rpg-error">
            <p className="nes-text is-error">{error}</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="nes-field">
            <label>Email</label>
            <input
              type="email"
              name="email"
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
              className="nes-input"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          
          <button type="submit" className="nes-btn is-primary">
            Entrer
          </button>
          
          <Link to="/register" className="nes-btn" style={{ marginLeft: '10px' }}>
            Créer un héros
          </Link>
        </form>
      </div>
    </div>
  );
}