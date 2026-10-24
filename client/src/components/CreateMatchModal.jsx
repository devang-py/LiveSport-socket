import { useState } from 'react';
import { createMatch } from '../api/matches';
import { X } from 'lucide-react';

const SPORTS = ['Football', 'Basketball', 'Cricket', 'Tennis', 'Baseball', 'Hockey', 'Rugby', 'Volleyball'];

export default function CreateMatchModal({ onClose, onCreated }) {
  const [form, setForm] = useState({
    sport: 'Football',
    homeTeam: '',
    awayTeam: '',
    startTime: '',
    endTime: '',
    homeScore: 0,
    awayScore: 0,
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

    if (!form.homeTeam.trim() || !form.awayTeam.trim()) {
      setError('Both team names are required.');
      return;
    }
    if (!form.startTime || !form.endTime) {
      setError('Start and end times are required.');
      return;
    }

    const startDate = new Date(form.startTime);
    const endDate = new Date(form.endTime);
    if (endDate <= startDate) {
      setError('End time must be after start time.');
      return;
    }

    setLoading(true);
    try {
      const match = await createMatch({
        sport: form.sport.toLowerCase(),
        homeTeam: form.homeTeam.trim(),
        awayTeam: form.awayTeam.trim(),
        startTime: startDate.toISOString(),
        endTime: endDate.toISOString(),
        homeScore: Number(form.homeScore) || 0,
        awayScore: Number(form.awayScore) || 0,
      });
      onCreated(match);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to create match');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">🏟️ Create New Match</h3>
          <button className="modal-close" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label" htmlFor="sport">Sport</label>
              <select
                id="sport"
                name="sport"
                className="form-select"
                value={form.sport}
                onChange={handleChange}
              >
                {SPORTS.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="homeTeam">Home Team</label>
                <input
                  id="homeTeam"
                  name="homeTeam"
                  type="text"
                  className="form-input"
                  placeholder="e.g. Manchester United"
                  value={form.homeTeam}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="awayTeam">Away Team</label>
                <input
                  id="awayTeam"
                  name="awayTeam"
                  type="text"
                  className="form-input"
                  placeholder="e.g. Liverpool FC"
                  value={form.awayTeam}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="startTime">Start Time</label>
                <input
                  id="startTime"
                  name="startTime"
                  type="datetime-local"
                  className="form-input"
                  value={form.startTime}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="endTime">End Time</label>
                <input
                  id="endTime"
                  name="endTime"
                  type="datetime-local"
                  className="form-input"
                  value={form.endTime}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="homeScore">Home Score</label>
                <input
                  id="homeScore"
                  name="homeScore"
                  type="number"
                  className="form-input"
                  min="0"
                  value={form.homeScore}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="awayScore">Away Score</label>
                <input
                  id="awayScore"
                  name="awayScore"
                  type="number"
                  className="form-input"
                  min="0"
                  value={form.awayScore}
                  onChange={handleChange}
                />
              </div>
            </div>

            {error && <p className="form-error">⚠️ {error}</p>}
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-outline" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Creating...' : 'Create Match'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
