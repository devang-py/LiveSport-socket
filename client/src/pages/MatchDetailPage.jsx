import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchMatches } from '../api/matches';
import { formatStatus, formatDate, formatTime, getStatusColor, getSportEmoji } from '../utils/formatters';
import CommentaryItem from '../components/CommentaryItem';
import AddCommentaryModal from '../components/AddCommentaryModal';
import { ArrowLeft, PlusCircle, MessageSquare, Clock, Calendar, Radio } from 'lucide-react';

export default function MatchDetailPage({ lastEvent, subscribe, unsubscribe }) {
  const { id } = useParams();
  const matchId = Number(id);

  const [match, setMatch] = useState(null);
  const [commentary, setCommentary] = useState([]);
  const [newIds, setNewIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddCommentary, setShowAddCommentary] = useState(false);

  // Subscribe to match commentary via WebSocket
  useEffect(() => {
    if (!matchId || isNaN(matchId)) return;
    subscribe(matchId);
    return () => unsubscribe(matchId);
  }, [matchId, subscribe, unsubscribe]);

  // Load match data
  useEffect(() => {
    loadMatch();
  }, [matchId]);

  // Listen for real-time commentary via WebSocket
  useEffect(() => {
    if (lastEvent?.type === 'commentary' && lastEvent.data) {
      const c = lastEvent.data;
      if (c.matchId === matchId) {
        setCommentary((prev) => {
          if (prev.some((item) => item.id === c.id)) return prev;
          return [c, ...prev];
        });
        setNewIds((prev) => new Set(prev).add(c.id));
        // Clear "new" highlight after 3 seconds
        setTimeout(() => {
          setNewIds((prev) => {
            const next = new Set(prev);
            next.delete(c.id);
            return next;
          });
        }, 3000);
      }
    }
  }, [lastEvent, matchId]);

  async function loadMatch() {
    setLoading(true);
    setError('');
    try {
      const matches = await fetchMatches(60);
      const found = matches.find((m) => m.id === matchId);
      if (found) {
        setMatch(found);
      } else {
        setError('Match not found');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  const handleCommentaryCreated = useCallback((newComment) => {
    setCommentary((prev) => {
      if (prev.some((item) => item.id === newComment.id)) return prev;
      return [newComment, ...prev];
    });
  }, []);

  if (loading) {
    return (
      <div className="page-wrapper">
        <div className="container">
          <div className="loading-container">
            <div className="loader"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !match) {
    return (
      <div className="page-wrapper">
        <div className="container">
          <Link to="/" className="back-link">
            <ArrowLeft size={16} /> Back to Matches
          </Link>
          <div className="empty-state">
            <div className="empty-state-icon">😕</div>
            <h3 className="empty-state-title">{error || 'Match not found'}</h3>
            <p className="empty-state-text">
              This match may have been removed or the ID is invalid.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <div className="container">
        <Link to="/" className="back-link">
          <ArrowLeft size={16} /> Back to Matches
        </Link>

        {/* Match Detail Header */}
        <div className="neo-card match-detail-header">
          <div style={{ marginBottom: 'var(--space-md)' }}>
            <span className="match-sport-tag" style={{ fontSize: '0.85rem', padding: '6px 14px' }}>
              {getSportEmoji(match.sport)} {match.sport}
            </span>
          </div>

          <div className="match-detail-teams">
            <div className="match-detail-team">
              <div className="match-detail-team-name">{match.homeTeam}</div>
              <span style={{ fontSize: '0.85rem', color: 'var(--clr-text-muted)', fontFamily: 'var(--font-mono)' }}>HOME</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-sm)' }}>
              <span className={`status-badge ${getStatusColor(match.status)}`} style={{ fontSize: '0.85rem', padding: '6px 16px' }}>
                {formatStatus(match.status)}
              </span>
              <div className="match-detail-score">
                {match.homeScore} — {match.awayScore}
              </div>
            </div>

            <div className="match-detail-team">
              <div className="match-detail-team-name">{match.awayTeam}</div>
              <span style={{ fontSize: '0.85rem', color: 'var(--clr-text-muted)', fontFamily: 'var(--font-mono)' }}>AWAY</span>
            </div>
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 'var(--space-lg)',
            flexWrap: 'wrap',
            fontSize: '0.85rem',
            color: 'var(--clr-text-muted)',
            fontFamily: 'var(--font-mono)'
          }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <Calendar size={14} /> {formatDate(match.startTime)}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <Clock size={14} /> {formatTime(match.startTime)} — {formatTime(match.endTime)}
            </span>
          </div>
        </div>

        {/* Commentary Section */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--space-md)', marginBottom: 'var(--space-lg)' }}>
          <h2 className="section-title" style={{ margin: 0 }}>
            <span className="section-title-icon">💬</span>
            Live Commentary
            {match.status === 'live' && (
              <span className="deco-sticker deco-sticker-pink" style={{ marginLeft: 8 }}>
                <Radio size={12} style={{ marginRight: 4 }} /> Live Feed
              </span>
            )}
          </h2>
          <button className="btn btn-secondary btn-sm" onClick={() => setShowAddCommentary(true)}>
            <PlusCircle size={14} />
            Add Commentary
          </button>
        </div>

        {commentary.length === 0 ? (
          <div className="neo-card-flat empty-state" style={{ padding: 'var(--space-2xl)' }}>
            <div className="empty-state-icon">📝</div>
            <h3 className="empty-state-title">No Commentary Yet</h3>
            <p className="empty-state-text">
              Be the first to add commentary to this match! Click "Add Commentary" above to get started.
            </p>
          </div>
        ) : (
          <div className="commentary-feed">
            {commentary.map((item) => (
              <CommentaryItem key={item.id} item={item} isNew={newIds.has(item.id)} />
            ))}
          </div>
        )}

        {/* Add Commentary Modal */}
        {showAddCommentary && (
          <AddCommentaryModal
            matchId={matchId}
            homeTeam={match.homeTeam}
            awayTeam={match.awayTeam}
            onClose={() => setShowAddCommentary(false)}
            onCreated={handleCommentaryCreated}
          />
        )}
      </div>
    </div>
  );
}
