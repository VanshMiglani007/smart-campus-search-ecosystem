import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { SearchProvider, useSearch } from './context/SearchContext';

import Navbar from './components/Navbar';
import ParticleBackground from './components/ParticleBackground';
import AlgorithmPanel from './components/AlgorithmPanel';

import HomePage from './pages/HomePage';
import AutocompletePage from './pages/AutocompletePage';
import TrieVisualizerPage from './pages/TrieVisualizerPage';
import PerformancePage from './pages/PerformancePage';
import AnalyticsDashboard from './pages/AnalyticsDashboard';
import SearchHistoryPage from './pages/SearchHistoryPage';
import TrendingPage from './pages/TrendingPage';
import TypoCorrectionPage from './pages/TypoCorrectionPage';

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<HomePage />} />
        <Route path="/autocomplete" element={<AutocompletePage />} />
        <Route path="/trie-visualizer" element={<TrieVisualizerPage />} />
        <Route path="/performance" element={<PerformancePage />} />
        <Route path="/analytics" element={<AnalyticsDashboard />} />
        <Route path="/history" element={<SearchHistoryPage />} />
        <Route path="/trending" element={<TrendingPage />} />
        <Route path="/typo" element={<TypoCorrectionPage />} />
      </Routes>
    </AnimatePresence>
  );
}

import { useState } from 'react';
import { Mail, Lock, X, CheckCircle2 } from 'lucide-react';
import Footer from './components/Footer';

function AppContent() {
  const { lastOperation, showLoginModal, setShowLoginModal, setUser } = useSearch();
  
  // Login Form States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    // Admin-only credentials validation
    if (email === 'vansh@campusiq.com' && password === 'admin') {
      localStorage.setItem('campusiq_user', 'Vansh');
      setUser('Vansh');
      setSuccessMsg('Admin console unlocked! Welcome, Vansh ❤️');
      setTimeout(() => {
        setShowLoginModal(false);
        setSuccessMsg('');
        setEmail('');
        setPassword('');
      }, 1200);
    } else {
      setError('Invalid admin credentials. Please try again!');
    }
  };

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '100vh',
        overflowX: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#0a0a0f',
      }}
    >
      {/* Particle layer — fixed behind everything */}
      <ParticleBackground />

      {/* Fixed top navbar */}
      <Navbar />

      {/* Main content — pushed below navbar */}
      <main
        style={{
          flex: 1,
          width: '100%',
          paddingTop: '70px',      /* exact navbar height */
          paddingBottom: '40px',   /* space before footer */
          boxSizing: 'border-box',
          overflowX: 'hidden',
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div style={{ flex: 1 }}>
          <AnimatedRoutes />
        </div>
      </main>

      {/* Global Footer */}
      <Footer />

      {/* Algorithm Panel — floating bottom-right */}
      <AlgorithmPanel
        activeDS={['trie', 'heap', 'lru', 'hashmap']}
        lastOp={lastOperation.op}
        complexity={lastOperation.complexity}
      />

      {/* Global Symmetrical Login Modal (Zero Cropping!) */}
      <AnimatePresence>
        {showLoginModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 2000, // higher than floating algorithm panel
              background: 'rgba(5, 5, 8, 0.85)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px',
            }}
            onClick={() => setShowLoginModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              style={{
                width: '100%',
                maxWidth: '380px',
                background: 'rgba(17, 17, 24, 0.95)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '24px',
                padding: '32px 24px',
                boxSizing: 'border-box',
                position: 'relative',
                boxShadow: '0 24px 64px rgba(0, 0, 0, 0.7)',
              }}
              onClick={e => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={() => setShowLoginModal(false)}
                style={{
                  position: 'absolute',
                  top: '18px',
                  right: '18px',
                  background: 'none',
                  border: 'none',
                  color: '#475569',
                  cursor: 'pointer',
                  padding: '4px',
                  transition: 'color 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.color = '#ef4444'; }}
                onMouseLeave={e => { e.currentTarget.style.color = '#475569'; }}
              >
                <X size={18} />
              </button>

              <h2 style={{ fontFamily: 'Syne, sans-serif', fontSize: '24px', fontWeight: 800, margin: '0 0 8px 0', background: 'linear-gradient(135deg, #4f8ef7, #00d4aa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', textAlign: 'center' }}>
                Admin Console
              </h2>
              <p style={{ color: '#94a3b8', fontSize: '13px', margin: '0 0 24px 0', textAlign: 'center' }}>
                Authenticate to access developer algorithms
              </p>

              {error && (
                <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '10px', padding: '10px 12px', color: '#ef4444', fontSize: '12px', marginBottom: '16px', textAlign: 'center' }}>
                  {error}
                </div>
              )}

              {successMsg && (
                <div style={{ background: 'rgba(0, 212, 170, 0.1)', border: '1px solid rgba(0, 212, 170, 0.2)', borderRadius: '10px', padding: '10px 12px', color: '#00d4aa', fontSize: '12px', marginBottom: '16px', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                  <CheckCircle2 size={14} /> {successMsg}
                </div>
              )}

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', color: '#475569', textTransform: 'uppercase', fontWeight: 600, marginBottom: '6px', letterSpacing: '0.05em' }}>Admin Email</label>
                  <div style={{ position: 'relative' }}>
                    <Mail size={14} color="#475569" style={{ position: 'absolute', left: '12px', top: '13px' }} />
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="vansh@campusiq.com" style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '10px 12px 10px 34px', fontSize: '13px', color: '#f1f5f9', outline: 'none', boxSizing: 'border-box' }} />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '11px', color: '#475569', textTransform: 'uppercase', fontWeight: 600, marginBottom: '6px', letterSpacing: '0.05em' }}>Security Key</label>
                  <div style={{ position: 'relative' }}>
                    <Lock size={14} color="#475569" style={{ position: 'absolute', left: '12px', top: '13px' }} />
                    <input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••" style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '10px 12px 10px 34px', fontSize: '13px', color: '#f1f5f9', outline: 'none', boxSizing: 'border-box' }} />
                  </div>
                </div>

                <button type="submit" style={{ width: '100%', padding: '11px', borderRadius: '12px', background: 'linear-gradient(135deg, #4f8ef7, #00d4aa)', color: 'white', border: 'none', fontSize: '13px', fontWeight: 600, cursor: 'pointer', marginTop: '8px', transition: 'opacity 0.2s' }}>
                  Sign In
                </button>
              </form>

              <p style={{ color: '#475569', fontSize: '11px', textAlign: 'center', marginTop: '16px', margin: '16px 0 0' }}>
                Hint: Use <code style={{ color: '#4f8ef7' }}>vansh@campusiq.com</code> / <code style={{ color: '#4f8ef7' }}>admin</code> to test!
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function App() {
  return (
    <Router>
      <SearchProvider>
        <AppContent />
      </SearchProvider>
    </Router>
  );
}

export default App;