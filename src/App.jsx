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

function AppContent() {
  const { lastOperation } = useSearch();

  return (
    <div className="relative min-h-screen">
      <ParticleBackground />
      <Navbar />
      <main className="relative z-10">
        <AnimatedRoutes />
      </main>
      <AlgorithmPanel
        activeDS={['trie', 'heap', 'lru', 'hashmap']}
        lastOp={lastOperation.op}
        complexity={lastOperation.complexity}
      />
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
