import { useEffect, useCallback } from 'react';

/**
 * Toast notification component.
 * Auto-dismisses after `duration` milliseconds.
 */
export default function Toast({ message, type = 'info', onDismiss, duration = 4000 }) {
  const dismiss = useCallback(() => {
    onDismiss?.();
  }, [onDismiss]);

  useEffect(() => {
    const timer = setTimeout(dismiss, duration);
    return () => clearTimeout(timer);
  }, [dismiss, duration]);

  return (
    <div className={`toast toast-${type}`} onClick={dismiss} role="alert">
      {type === 'success' && '✅ '}
      {type === 'error' && '❌ '}
      {type === 'info' && '📢 '}
      {message}
    </div>
  );
}
