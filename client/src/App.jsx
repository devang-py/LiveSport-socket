import { useState, useCallback } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import CreateMatchModal from './components/CreateMatchModal';
import Toast from './components/Toast';
import HomePage from './pages/HomePage';
import MatchDetailPage from './pages/MatchDetailPage';
import { useWebSocket } from './hooks/useWebSocket';

export default function App() {
  const { isConnected, lastEvent, subscribe, unsubscribe } = useWebSocket();
  const [showCreateMatch, setShowCreateMatch] = useState(false);
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const handleMatchCreated = useCallback((match) => {
    addToast(`Match "${match.homeTeam} vs ${match.awayTeam}" created!`, 'success');
  }, [addToast]);

  return (
    <BrowserRouter>
      <Navbar
        isConnected={isConnected}
        onCreateMatch={() => setShowCreateMatch(true)}
      />

      <Routes>
        <Route
          path="/"
          element={<HomePage lastEvent={lastEvent} />}
        />
        <Route
          path="/match/:id"
          element={
            <MatchDetailPage
              lastEvent={lastEvent}
              subscribe={subscribe}
              unsubscribe={unsubscribe}
            />
          }
        />
      </Routes>

      {/* Create Match Modal */}
      {showCreateMatch && (
        <CreateMatchModal
          onClose={() => setShowCreateMatch(false)}
          onCreated={handleMatchCreated}
        />
      )}

      {/* Toast Notifications */}
      <div className="toast-container">
        {toasts.map((t) => (
          <Toast
            key={t.id}
            message={t.message}
            type={t.type}
            onDismiss={() => removeToast(t.id)}
          />
        ))}
      </div>
    </BrowserRouter>
  );
}
