import { useEffect, useRef, useState, useCallback } from 'react';

const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:8000/ws';

/**
 * Custom hook that manages a single WebSocket connection to the backend.
 * Returns helpers for subscribing/unsubscribing to match-specific commentary
 * and provides connection status + a stream of incoming events.
 */
export function useWebSocket() {
  const wsRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  const [lastEvent, setLastEvent] = useState(null);
  const reconnectTimeout = useRef(null);
  const subscribedMatches = useRef(new Set());

  const connect = useCallback(() => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) return;

    const ws = new WebSocket(WS_URL);

    ws.onopen = () => {
      setIsConnected(true);
      // Re-subscribe to all previously subscribed matches on reconnect
      for (const matchId of subscribedMatches.current) {
        ws.send(JSON.stringify({ type: 'subscribe', matchId }));
      }
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setLastEvent(data);
      } catch {
        // ignore malformed messages
      }
    };

    ws.onerror = () => {
      // handled in onclose
    };

    ws.onclose = () => {
      setIsConnected(false);
      wsRef.current = null;
      // Auto-reconnect after 3 seconds
      reconnectTimeout.current = setTimeout(() => {
        connect();
      }, 3000);
    };

    wsRef.current = ws;
  }, []);

  useEffect(() => {
    connect();

    return () => {
      clearTimeout(reconnectTimeout.current);
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, [connect]);

  const subscribe = useCallback((matchId) => {
    subscribedMatches.current.add(matchId);
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'subscribe', matchId }));
    }
  }, []);

  const unsubscribe = useCallback((matchId) => {
    subscribedMatches.current.delete(matchId);
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'unsubscribe', matchId }));
    }
  }, []);

  return { isConnected, lastEvent, subscribe, unsubscribe };
}
