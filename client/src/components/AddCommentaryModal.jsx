import { useState } from 'react';
import { createCommentary } from '../api/matches';
import { X, Send } from 'lucide-react';

const EVENT_TYPES = [
  'kick_off', 'goal', 'assist', 'foul', 'yellow_card', 'red_card',
  'substitution', 'offside', 'corner', 'free_kick', 'penalty',
  'half_time', 'full_time', 'injury', 'var_review', 'commentary',
];

export default function AddCommentaryModal({ matchId, homeTeam, awayTeam, onClose, onCreated }) {
  const [form, setForm] = useState({
    minute: '',
    sequence: '',
    period: '',
    eventType: 'commentary',
    actor: '',
    team: '',
    message: '',
    tags: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!form.message.trim()) {
      setError('Message is required.');
      return;
    }
    if (!form.sequence && form.sequence !== '0') {
      setError('Sequence number is required.');
      return;
    }
    if (!form.eventType) {
      setError('Event type is required.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        eventType: form.eventType,
        message: form.message.trim(),
        sequence: Number(form.sequence),
      };
      if (form.minute) payload.minute = Number(form.minute);
      if (form.period.trim()) payload.period = form.period.trim();
      if (form.actor.trim()) payload.actor = form.actor.trim();
      if (form.team.trim()) payload.team = form.team.trim();
      if (form.tags.trim()) {
        payload.tags = form.tags.split(',').map((t) => t.trim()).filter(Boolean);
      }

      const result = await createCommentary(matchId, payload);
      onCreated(result);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to add commentary');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">📝 Add Commentary</h3>
          <button className="modal-close" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="eventType">Event Type</label>
                <select
                  id="eventType"
                  name="eventType"
                  className="form-select"
                  value={form.eventType}
                  onChange={handleChange}
                >
                  {EVENT_TYPES.map((et) => (
                    <option key={et} value={et}>
                      {et.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="sequence">Sequence #</label>
                <input
                  id="sequence"
                  name="sequence"
                  type="number"
                  min="0"
                  className="form-input"
                  placeholder="0"
                  value={form.sequence}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="minute">Minute (optional)</label>
                <input
                  id="minute"
                  name="minute"
                  type="number"
                  min="0"
                  className="form-input"
                  placeholder="e.g. 45"
                  value={form.minute}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="period">Period (optional)</label>
                <input
                  id="period"
                  name="period"
                  type="text"
                  className="form-input"
                  placeholder="e.g. First Half"
                  value={form.period}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="actor">Player / Actor (optional)</label>
                <input
                  id="actor"
                  name="actor"
                  type="text"
                  className="form-input"
                  placeholder="e.g. Messi"
                  value={form.actor}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="team">Team (optional)</label>
                <select
                  id="team"
                  name="team"
                  className="form-select"
                  value={form.team}
                  onChange={handleChange}
                >
                  <option value="">— Select Team —</option>
                  {homeTeam && <option value={homeTeam}>{homeTeam}</option>}
                  {awayTeam && <option value={awayTeam}>{awayTeam}</option>}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                className="form-textarea"
                placeholder="Describe what happened..."
                value={form.message}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="tags">Tags (comma-separated, optional)</label>
              <input
                id="tags"
                name="tags"
                type="text"
                className="form-input"
                placeholder="e.g. highlight, important"
                value={form.tags}
                onChange={handleChange}
              />
            </div>

            {error && <p className="form-error">⚠️ {error}</p>}
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-outline" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-secondary" disabled={loading}>
              <Send size={14} />
              {loading ? 'Sending...' : 'Add Commentary'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
