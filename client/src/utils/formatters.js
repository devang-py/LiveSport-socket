/**
 * Format a status enum value into a display-friendly badge label.
 */
export function formatStatus(status) {
  switch (status) {
    case 'live':
      return 'LIVE';
    case 'scheduled':
      return 'SCHEDULED';
    case 'finished':
      return 'FINISHED';
    default:
      return status?.toUpperCase() || 'UNKNOWN';
  }
}

/**
 * Format an ISO date string into a human-readable form.
 */
export function formatDate(isoString) {
  if (!isoString) return '—';
  const d = new Date(isoString);
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * Format an ISO date string into a time string.
 */
export function formatTime(isoString) {
  if (!isoString) return '—';
  const d = new Date(isoString);
  return d.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Get a color class based on match status for neobrutalism badges.
 */
export function getStatusColor(status) {
  switch (status) {
    case 'live':
      return 'status-live';
    case 'scheduled':
      return 'status-scheduled';
    case 'finished':
      return 'status-finished';
    default:
      return 'status-default';
  }
}

/**
 * Get sport emoji for display.
 */
export function getSportEmoji(sport) {
  const map = {
    football: '⚽',
    soccer: '⚽',
    basketball: '🏀',
    cricket: '🏏',
    tennis: '🎾',
    baseball: '⚾',
    hockey: '🏒',
    rugby: '🏉',
    volleyball: '🏐',
    golf: '⛳',
  };
  return map[sport?.toLowerCase()] || '🏅';
}
