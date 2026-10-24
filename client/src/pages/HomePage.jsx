import { useState, useEffect, useMemo } from 'react';
import { fetchMatches } from '../api/matches';
import MatchCard from '../components/MatchCard';
import { Trophy, Loader } from 'lucide-react';

export default function HomePage({ lastEvent }) {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadMatches();
  }, []);

  // Listen for new match created via WebSocket
  useEffect(() => {
    if (lastEvent?.type === 'match_created' && lastEvent.data) {
      setMatches((prev) => {
        // Avoid duplicates
        if (prev.some((m) => m.id === lastEvent.data.id)) return prev;
        return [lastEvent.data, ...prev];
      });
    }
  }, [lastEvent]);

  async function loadMatches() {
    setLoading(true);
    setError('');
    try {
      const data = await fetchMatches(50);
      setMatches(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const stats = useMemo(() => {
    const live = matches.filter((m) => m.status === 'live').length;
    const scheduled = matches.filter((m) => m.status === 'scheduled').length;
    const finished = matches.filter((m) => m.status === 'finished').length;
    return { total: matches.length, live, scheduled, finished };
  }, [matches]);

  return (
    <div className="page-wrapper">
      <div className="container">
        {/* Hero Section */}
        <div className="hero-section">
          <div className="hero-decoration">⚡ Real-Time Updates</div>
          <h1 className="hero-title">
            Live Sports<br />
            <span style={{ color: 'var(--clr-primary)' }}>Scores & Commentary</span>
          </h1>
          <p className="hero-subtitle">
            Track live matches, get real-time score updates and play-by-play commentary — all powered by WebSocket magic.
          </p>
          {stats.live > 0 && (
            <div className="live-counter">
              <span style={{ animation: 'pulse-dot 1.5s ease-in-out infinite', width: 8, height: 8, borderRadius: '50%', background: '#cc0066', display: 'inline-block' }}></span>
              {stats.live} match{stats.live !== 1 ? 'es' : ''} live now
            </div>
          )}
        </div>

        {/* Stats Row */}
        <div className="stats-row">
          <div className="neo-card stat-card">
            <div className="stat-value">{stats.total}</div>
            <div className="stat-label">Total Matches</div>
          </div>
          <div className="neo-card stat-card" style={{ borderColor: '#cc0066' }}>
            <div className="stat-value" style={{ color: 'var(--clr-live)' }}>{stats.live}</div>
            <div className="stat-label">Live Now</div>
          </div>
          <div className="neo-card stat-card" style={{ borderColor: '#5941cc' }}>
            <div className="stat-value" style={{ color: 'var(--clr-secondary)' }}>{stats.scheduled}</div>
            <div className="stat-label">Scheduled</div>
          </div>
          <div className="neo-card stat-card" style={{ borderColor: '#00814e' }}>
            <div className="stat-value" style={{ color: '#00814e' }}>{stats.finished}</div>
            <div className="stat-label">Finished</div>
          </div>
        </div>

        {/* Page Header */}
        <div className="page-header">
          <h2 className="page-title">
            <span className="page-title-highlight">All Matches</span>
          </h2>
          <button className="btn btn-outline btn-sm" onClick={loadMatches} disabled={loading}>
            <Trophy size={14} />
            Refresh
          </button>
        </div>

        {/* Content */}
        {loading && (
          <div className="loading-container">
            <div className="loader"></div>
          </div>
        )}

        {error && !loading && (
          <div className="neo-card-flat" style={{ textAlign: 'center', padding: 'var(--space-xl)' }}>
            <p className="form-error" style={{ fontSize: '1rem' }}>⚠️ {error}</p>
            <button className="btn btn-outline" onClick={loadMatches} style={{ marginTop: 'var(--space-md)' }}>
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && matches.length === 0 && (
          <div className="empty-state">
            <div className="empty-state-icon">🏟️</div>
            <h3 className="empty-state-title">No Matches Yet</h3>
            <p className="empty-state-text">
              Create your first match using the "New Match" button in the top navigation bar.
            </p>
          </div>
        )}

        {!loading && !error && matches.length > 0 && (
          <div className="match-grid">
            {matches.map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
