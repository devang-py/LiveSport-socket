import { Link, useLocation } from 'react-router-dom';
import { Zap, Home, PlusCircle } from 'lucide-react';

export default function Navbar({ isConnected, onCreateMatch }) {
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="navbar-brand">
          <span className="navbar-brand-icon">⚡</span>
          LiveSports
        </Link>

        <div className="navbar-links">
          <Link
            to="/"
            className={`navbar-link${location.pathname === '/' ? ' active' : ''}`}
          >
            <Home size={14} style={{ marginRight: 4, verticalAlign: 'middle' }} />
            Matches
          </Link>
          <button className="btn btn-primary btn-sm" onClick={onCreateMatch}>
            <PlusCircle size={14} />
            New Match
          </button>
        </div>

        <div className={`ws-indicator ${isConnected ? 'connected' : 'disconnected'}`}>
          <span className="ws-dot"></span>
          {isConnected ? 'Live' : 'Offline'}
        </div>
      </div>
    </nav>
  );
}
