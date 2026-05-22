import { motion } from 'framer-motion';
import { GitBranch, BarChart3, Clock, TrendingUp, Gauge, SpellCheck, BookOpen, Type } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useSearch } from '../context/SearchContext';
import SearchBar from '../components/SearchBar';
import TrendingPanel from '../components/TrendingPanel';
import ComplexityBadge from '../components/ComplexityBadge';
import { getCategoryColor } from '../data/campusData';

const features = [
  {
    title: 'Live Autocomplete',
    description: 'Trie-powered instant search suggestions as you type',
    icon: Type,
    path: '/autocomplete',
    color: '#4f8ef7',
    complexity: 'O(L)',
  },
  {
    title: 'Trie Visualizer',
    description: 'Interactive tree visualization with React Flow',
    icon: GitBranch,
    path: '/trie-visualizer',
    color: '#00d4aa',
    complexity: 'O(L)',
  },
  {
    title: 'Performance Lab',
    description: 'Linear search vs Trie — see the difference live',
    icon: Gauge,
    path: '/performance',
    color: '#a855f7',
    complexity: 'O(N) vs O(L)',
  },
  {
    title: 'Analytics Dashboard',
    description: 'Search frequency tracking with HashMap',
    icon: BarChart3,
    path: '/analytics',
    color: '#f59e0b',
    complexity: 'O(1)',
  },
  {
    title: 'Search History',
    description: 'LRU Cache with doubly linked list visualization',
    icon: Clock,
    path: '/history',
    color: '#00d4aa',
    complexity: 'O(1)',
  },
  {
    title: 'Trending Engine',
    description: 'MaxHeap-powered trending keywords',
    icon: TrendingUp,
    path: '/trending',
    color: '#ef4444',
    complexity: 'O(log N)',
  },
  {
    title: 'Typo Correction',
    description: 'Levenshtein distance DP matrix visualization',
    icon: SpellCheck,
    path: '/typo',
    color: '#4f8ef7',
    complexity: 'O(m×n)',
  },
];

const quickCategories = [
  { name: 'Notes', category: 'notes' },
  { name: 'Events', category: 'events' },
  { name: 'Faculty', category: 'faculty' },
  { name: 'Hostel', category: 'hostel' },
  { name: 'Library', category: 'library' },
  { name: 'Courses', category: 'courses' },
];

const backgroundParticles = [
  { size: 3, left: 12, top: 45, delay: 0.5, duration: 15, xVal: 10 },
  { size: 4, left: 28, top: 15, delay: 2.1, duration: 22, xVal: -8 },
  { size: 2, left: 45, top: 78, delay: 1.2, duration: 18, xVal: 15 },
  { size: 5, left: 63, top: 22, delay: 3.4, duration: 25, xVal: -12 },
  { size: 3, left: 82, top: 60, delay: 0.8, duration: 14, xVal: 8 },
  { size: 4, left: 19, top: 88, delay: 4.5, duration: 20, xVal: 12 },
  { size: 2, left: 35, top: 32, delay: 1.9, duration: 16, xVal: -10 },
  { size: 5, left: 55, top: 67, delay: 2.8, duration: 27, xVal: 6 },
  { size: 3, left: 74, top: 10, delay: 0.2, duration: 19, xVal: -15 },
  { size: 4, left: 91, top: 50, delay: 3.9, duration: 21, xVal: 10 },
  { size: 2, left: 8, top: 25, delay: 1.5, duration: 17, xVal: -5 },
  { size: 3, left: 50, top: 40, delay: 2.5, duration: 24, xVal: 14 },
  { size: 4, left: 68, top: 85, delay: 0.7, duration: 23, xVal: -10 },
  { size: 2, left: 88, top: 30, delay: 4.1, duration: 15, xVal: 8 },
  { size: 5, left: 30, top: 55, delay: 3.2, duration: 26, xVal: -12 }
];

const HomePage = () => {
  const { trendingItems, recentSearches, recordSelection } = useSearch();
  const navigate = useNavigate();

  const handleSelectSuggestion = (word) => {
    recordSelection(word);
    navigate('/autocomplete', { state: { query: word } });
  };

  const handleTrendingClick = (word) => {
    navigate('/autocomplete', { state: { query: word } });
  };

  const handleRecentClick = (word) => {
    navigate('/autocomplete', { state: { query: word } });
  };

  const handleCategoryClick = (categoryName) => {
    navigate('/autocomplete', { state: { query: categoryName } });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen pt-[70px] pb-16 bg-[#0a0a0f] relative overflow-hidden"
    >
      {/* Premium Visual Effects: Ambient Gradient Blobs & Soft Background Glows */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[5%] left-[-10%] w-[600px] h-[600px] rounded-full bg-accent-blue/10 blur-[150px] animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute top-[35%] right-[-10%] w-[550px] h-[550px] rounded-full bg-accent-purple/8 blur-[130px] animate-pulse" style={{ animationDuration: '12s' }} />
        <div className="absolute bottom-[5%] left-[10%] w-[600px] h-[600px] rounded-full bg-accent-cyan/8 blur-[160px] animate-pulse" style={{ animationDuration: '10s' }} />
      </div>

      {/* Premium Visual Effects: Subtle Animated Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {backgroundParticles.map((pt, i) => {
          return (
            <motion.div
              key={i}
              className="absolute rounded-full bg-white/10"
              style={{
                width: pt.size,
                height: pt.size,
                left: `${pt.left}%`,
                top: `${pt.top}%`,
                boxShadow: '0 0 8px rgba(255, 255, 255, 0.3)',
              }}
              animate={{
                y: [0, -140, 0],
                x: [0, pt.xVal, 0],
                opacity: [0.1, 0.35, 0.1],
              }}
              transition={{
                duration: pt.duration,
                repeat: Infinity,
                delay: pt.delay,
                ease: 'easeInOut',
              }}
            />
          );
        })}
      </div>

      <div className="max-w-[1400px] mx-auto px-6 w-full flex flex-col relative z-10">
        {/* 1. Hero Section (Reduced Height) */}
        <section className="relative min-h-[65vh] flex flex-col justify-center items-center text-center pt-[80px] pb-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="w-full max-w-5xl mx-auto flex flex-col items-center justify-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 mb-6">
              <BookOpen size={14} className="text-accent-cyan" />
              <span className="text-xs text-text-secondary font-medium">
                DSA-Powered Search Engine
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl xl:text-7xl font-bold tracking-tight mb-5 leading-tight max-w-5xl mx-auto">
              <span className="gradient-text">Campus Intelligence</span>
            </h1>

            <p className="text-lg md:text-xl text-text-secondary mb-10 max-w-2xl mx-auto leading-relaxed">
              Search Everything. Understand Everything.
            </p>

            {/* Search Bar Container */}
            <div className="w-full max-w-4xl mx-auto mb-8 px-4">
              <div className="shadow-[0_0_50px_rgba(79,142,247,0.18)] rounded-2xl">
                <SearchBar onSelectSuggestion={handleSelectSuggestion} />
              </div>
            </div>

            {/* Quick Categories */}
            <div className="flex flex-wrap items-center justify-center gap-2.5 mb-10">
              {quickCategories.map((cat) => {
                const color = getCategoryColor(cat.category);
                return (
                  <button
                    key={cat.category}
                    onClick={() => handleCategoryClick(cat.name)}
                    className="text-sm px-4 py-2 rounded-full border transition-all hover:scale-105 hover:bg-white/5 active:scale-95 cursor-pointer font-medium"
                    style={{
                      color,
                      borderColor: `${color}30`,
                      backgroundColor: `${color}08`,
                    }}
                  >
                    {cat.name}
                  </button>
                );
              })}
            </div>

            {/* Algorithm Indicators */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              {[
                { name: 'Trie', complexity: 'O(L)', color: '#4f8ef7' },
                { name: 'MaxHeap', complexity: 'O(log N)', color: '#f59e0b' },
                { name: 'LRU Cache', complexity: 'O(1)', color: '#00d4aa' },
                { name: 'HashMap', complexity: 'O(1)*', color: '#a855f7' },
                { name: 'Levenshtein DP', complexity: 'O(m×n)', color: '#ef4444' },
              ].map((algo) => (
                <span
                  key={algo.name}
                  className="text-xs md:text-sm font-mono font-medium px-4 py-2 rounded-full shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] border"
                  style={{
                    backgroundColor: `${algo.color}10`,
                    color: algo.color,
                    borderColor: `${algo.color}25`,
                  }}
                >
                  {algo.name} <span className="opacity-60 text-xs ml-1">{algo.complexity}</span>
                </span>
              ))}
            </div>
          </motion.div>
        </section>

        {/* 2. Trending Section wrapped in ONE premium container */}
        <section className="py-16 border-t border-white/5">
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-3xl md:text-4xl font-bold tracking-tight text-center mb-10 gradient-text"
          >
            Trending Now
          </motion.h2>

          <div className="glass-card rounded-3xl p-8 backdrop-blur shadow-2xl relative overflow-hidden">
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-warning/5 rounded-full blur-2xl pointer-events-none" />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <TrendingPanel items={trendingItems} onClickItem={handleTrendingClick} />
            </motion.div>

            {/* Recent Searches */}
            {recentSearches.length > 0 && (
              <div className="mt-10 pt-10 border-t border-white/5">
                <div className="flex items-center gap-2 mb-6">
                  <Clock size={18} className="text-accent-cyan" />
                  <h3 className="text-lg font-bold tracking-tight text-text-primary">Your Recent Searches</h3>
                  <ComplexityBadge type="ops" value="O(1)" color="cyan" />
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {recentSearches.map((item, i) => (
                    <motion.span
                      key={item.key}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.05 }}
                      onClick={() => handleRecentClick(item.key)}
                      className="text-sm px-4.5 py-2.5 rounded-full border border-white/10 bg-white/5 text-text-secondary hover:bg-white/10 hover:text-text-primary hover:border-white/20 cursor-pointer transition-all active:scale-95"
                    >
                      {item.key}
                    </motion.span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* 3. Features Section with upgraded visual cards */}
        <section className="py-16 border-t border-white/5">
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-3xl md:text-4xl font-bold tracking-tight text-center mb-10 gradient-text"
          >
            Explore Features
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.path}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 * index + 0.5 }}
                  className="h-full"
                >
                  <Link to={feature.path} className="block h-full">
                    <div
                      className="glass-card rounded-3xl p-8 min-h-[180px] h-full flex flex-col justify-between transition-all duration-300 border border-white/10 shadow-xl backdrop-blur hover:-translate-y-1.5 hover:border-white/20 relative overflow-hidden group"
                      style={{
                        borderTop: '3px solid ' + feature.color,
                        boxShadow: `0 10px 30px -10px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.05), 0 0 30px ${feature.color}05`
                      }}
                    >
                      {/* Subtle hover overlay */}
                      <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                      
                      <div className="relative z-10">
                        <div className="flex items-start justify-between mb-6">
                          <div
                            className="w-12 h-12 rounded-xl flex items-center justify-center shadow-[0_4px_20px_rgba(0,0,0,0.3)]"
                            style={{ backgroundColor: `${feature.color}15` }}
                          >
                            <Icon size={24} style={{ color: feature.color }} />
                          </div>
                          <span
                            className="text-xs font-mono font-medium px-3 py-1 rounded-full shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]"
                            style={{
                              backgroundColor: `${feature.color}15`,
                              color: feature.color,
                              border: `1px solid ${feature.color}25`,
                            }}
                          >
                            {feature.complexity}
                          </span>
                        </div>
                        <h3 className="text-xl font-bold tracking-tight text-text-primary mb-3">
                          {feature.title}
                        </h3>
                        <p className="text-sm text-text-secondary leading-relaxed">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* 4. About Section fully centered and premium */}
        <section className="py-16 border-t border-white/5 max-w-5xl mx-auto w-full">
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-3xl md:text-4xl font-bold tracking-tight text-center mb-10 gradient-text"
          >
            About Platform
          </motion.h2>

          <div className="glass-card rounded-3xl p-10 shadow-2xl flex flex-col items-center text-center backdrop-blur relative overflow-hidden">
            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-accent-blue/5 rounded-full blur-2xl pointer-events-none" />
            <p className="text-lg text-text-secondary leading-relaxed mb-8 max-w-3xl">
              This platform demonstrates 5 core Data Structures & Algorithms working together in a real-world search engine.
              Every search query triggers: <span className="font-mono text-accent-blue font-semibold">Trie.getSuggestions()</span>,{' '}
              <span className="font-mono text-accent-purple font-semibold">HashMap.increment()</span>,{' '}
              <span className="font-mono text-warning font-semibold">MaxHeap.updateScore()</span>, and{' '}
              <span className="font-mono text-accent-cyan font-semibold">LRUCache.put()</span> — all in real time.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <ComplexityBadge type="time" value="O(L) Trie" color="blue" />
              <ComplexityBadge type="time" value="O(log N) Heap" color="amber" />
              <ComplexityBadge type="time" value="O(1) LRU" color="cyan" />
              <ComplexityBadge type="time" value="O(1)* HashMap" color="purple" />
            </div>
          </div>
        </section>
      </div>
    </motion.div>
  );
};

export default HomePage;
