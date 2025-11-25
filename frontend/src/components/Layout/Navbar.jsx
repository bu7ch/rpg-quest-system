import { Link } from '@tanstack/react-router';
import { useAuth } from '../../contexts/AuthContext.jsx';

export default function Navbar() {
  const { logout } = useAuth();

  return (
    <nav className="navbar">
      <h2>🏰 Royaume d'Algorithmia</h2>
      <div className="nav-links">
        <Link to="/quests">📜 Quêtes</Link>
        <Link to="/inventory">🎒 Inventaire</Link>
        <button onClick={logout} className="btn-logout">🚪 Déconnexion</button>
      </div>
    </nav>
  );
}