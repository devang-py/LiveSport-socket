const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

/**
 * Fetch all matches from the backend.
 * @param {number} [limit] – optional limit for how many matches to fetch
 * @returns {Promise<Array>}
 */
export async function fetchMatches(limit) {
  const url = new URL(`${API_BASE}/matches`);
  if (limit) url.searchParams.set('limit', String(limit));

  const res = await fetch(url.toString());
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to fetch matches');
  }
  const json = await res.json();
  return json.data;
}

/**
 * Create a new match.
 * @param {object} matchData
 * @returns {Promise<object>} the created match
 */
export async function createMatch(matchData) {
  const res = await fetch(`${API_BASE}/matches`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(matchData),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to create match');
  }
  const json = await res.json();
  return json.data;
}

/**
 * Create a commentary entry for a match.
 * @param {number} matchId
 * @param {object} commentaryData
 * @returns {Promise<object>}
 */
export async function createCommentary(matchId, commentaryData) {
  const res = await fetch(`${API_BASE}/matches/${matchId}/commentary`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(commentaryData),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to create commentary');
  }
  const json = await res.json();
  return json.data;
}
