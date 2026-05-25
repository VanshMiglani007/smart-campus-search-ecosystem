import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
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

import { useState } from 'react';
import { Mail, Lock, X, CheckCircle2 } from 'lucide-react';
import Footer from './components/Footer';

function LockedConsole({ title, subtitle }) {
  const { setShowLoginModal } = useSearch();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        maxWidth: '560px',
        margin: '80px auto',
        padding: '48px 32px',
        borderRadius: '24px',
        background: 'rgba(255, 255, 255, 0.02)',
        border: '1px solid rgba(255, 255, 255, 0.07)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        textAlign: 'center',
        boxSizing: 'border-box',
      }}
    >
      {/* Animated Lock Icon */}
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
        style={{
          width: '64px',
          height: '64px',
          borderRadius: '20px',
          background: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.25)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '28px',
          boxShadow: '0 8px 32px rgba(239, 68, 68, 0.15)',
        }}
      >
        <Lock size={28} color="#ef4444" />
      </motion.div>

      <h2
        style={{
          fontFamily: 'Syne, sans-serif',
          fontSize: '26px',
          fontWeight: 800,
          color: '#f1f5f9',
          marginBottom: '12px',
        }}
      >
        {title}
      </h2>

      <p
        style={{
          fontSize: '14px',
          color: '#94a3b8',
          lineHeight: 1.6,
          marginBottom: '32px',
          maxWidth: '420px',
        }}
      >
        {subtitle}
      </p>

      <button
        onClick={() => setShowLoginModal(true)}
        style={{
          padding: '14px 28px',
          borderRadius: '12px',
          background: 'linear-gradient(135deg, #4f8ef7, #00d4aa)',
          color: 'white',
          border: 'none',
          fontSize: '14px',
          fontWeight: 700,
          cursor: 'pointer',
          boxShadow: '0 8px 24px rgba(79, 142, 247, 0.2)',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          transition: 'all 0.2s',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.transform = 'scale(1.03) translateY(-1px)';
          e.currentTarget.style.boxShadow = '0 12px 30px rgba(79, 142, 247, 0.35)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = 'scale(1) translateY(0)';
          e.currentTarget.style.boxShadow = '0 8px 24px rgba(79, 142, 247, 0.2)';
        }}
      >
        ⚡ Unlock Admin Console
      </button>
    </motion.div>
  );
}

function AnimatedRoutes() {
  const { user } = useSearch();
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<HomePage />} />
        
        <Route path="/autocomplete" element={
          user ? <AutocompletePage /> : <LockedConsole title="Autocomplete Sandbox Locked" subtitle="Authenticate as Admin to run live prefix search queries across the campus trie index." />
        } />
        
        <Route path="/trie-visualizer" element={
          user ? <TrieVisualizerPage /> : <LockedConsole title="Trie Visualizer Locked" subtitle="Authenticate as Admin to observe real-time prefix trie branch expansions and character node layouts." />
        } />
        
        <Route path="/performance" element={
          user ? <PerformancePage /> : <LockedConsole title="Performance Lab Locked" subtitle="Authenticate as Admin to execute linear lookup vs Trie search benchmark analytics." />
        } />
        
        <Route path="/analytics" element={
          user ? <AnalyticsDashboard /> : <LockedConsole title="Analytics Console Locked" subtitle="Authenticate as Admin to display query volume, trending frequencies, and heap rankings." />
        } />
        
        <Route path="/history" element={
          user ? <SearchHistoryPage /> : <LockedConsole title="LRU Eviction History Locked" subtitle="Authenticate as Admin to interact with linear cache list representations and live eviction tracking." />
        } />
        
        <Route path="/trending" element={
          user ? <TrendingPage /> : <LockedConsole title="MaxHeap Rankings Locked" subtitle="Authenticate as Admin to manage decay indices and global search frequency queues." />
        } />
        
        <Route path="/typo" element={
          user ? <TypoCorrectionPage /> : <LockedConsole title="Typo Correction Lab Locked" subtitle="Authenticate as Admin to process fuzzy string distance matching metrics." />
        } />
      </Routes>
    </AnimatePresence>
  );
}

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
                  Unlock Console
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