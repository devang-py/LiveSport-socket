import { Link } from 'react-router-dom';
import { formatStatus, formatDate, formatTime, getStatusColor, getSportEmoji } from '../utils/formatters';
import { Clock, Calendar } from 'lucide-react';

export default function MatchCard({ match }) {
  return (
    <Link to={`/match/${match.id}`} className="neo-card match-card" style={{ textDecoration: 'none' }}>
      <div className="match-team">
        <div className="match-team-name">{match.homeTeam}</div>
        <span style={{ fontSize: '0.8rem', color: 'var(--clr-text-muted)' }}>Home</span>
      </div>

      <div className="match-score-section">
        <span className={`status-badge ${getStatusColor(match.status)}`}>
          {formatStatus(match.status)}
        </span>
        <div className="match-score">
          {match.homeScore} — {match.awayScore}
        </div>
        <span className="match-vs">VS</span>
      </div>

      <div className="match-team">
        <div className="match-team-name">{match.awayTeam}</div>
        <span style={{ fontSize: '0.8rem', color: 'var(--clr-text-muted)' }}>Away</span>
      </div>

      <div className="match-meta" style={{ gridColumn: '1 / -1' }}>
        <span className="match-sport-tag">
          {getSportEmoji(match.sport)} {match.sport}
        </span>
        <span className="match-meta-item">
          <Calendar size={13} />
          {formatDate(match.startTime)}
        </span>
        <span className="match-meta-item">
          <Clock size={13} />
          {formatTime(match.startTime)}
        </span>
      </div>
    </Link>
  );
}
