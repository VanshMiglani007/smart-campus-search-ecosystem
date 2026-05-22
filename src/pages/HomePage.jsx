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
      className="min-h-screen pt-[70px] pb-16 bg-[#0a0a0f]"
    >
      <div className="max-w-[1400px] mx-auto px-6 w-full flex flex-col">
        {/* 1. Hero Section */}
        <section className="relative min-h-[85vh] flex flex-col justify-center items-center text-center pt-[120px] pb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="w-full max-w-5xl mx-auto flex flex-col items-center justify-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 mb-8">
              <BookOpen size={14} className="text-accent-cyan" />
              <span className="text-xs text-text-secondary font-medium">
                DSA-Powered Search Engine
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl xl:text-7xl font-bold tracking-tight mb-6 leading-tight max-w-5xl mx-auto">
              <span className="gradient-text">Campus Intelligence</span>
            </h1>

            <p className="text-lg md:text-xl text-text-secondary mb-12 max-w-2xl mx-auto leading-relaxed">
              Search Everything. Understand Everything.
            </p>

            {/* Search Bar Container */}
            <div className="w-full max-w-4xl mx-auto mb-8 px-4">
              <div className="shadow-[0_0_50px_rgba(79,142,247,0.15)] rounded-2xl">
                <SearchBar onSelectSuggestion={handleSelectSuggestion} />
              </div>
            </div>

            {/* Quick Categories */}
            <div className="flex flex-wrap items-center justify-center gap-2.5 mb-12">
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

        {/* 2. Trending Section */}
        <section className="py-24 border-t border-white/5">
          <div className="glass-card p-8 md:p-12 shadow-2xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <TrendingPanel items={trendingItems} onClickItem={handleTrendingClick} />
            </motion.div>

            {/* Recent Searches */}
            {recentSearches.length > 0 && (
              <div className="mt-12 pt-12 border-t border-white/5">
                <div className="flex items-center gap-2 mb-6">
                  <Clock size={18} className="text-accent-cyan" />
                  <h3 className="text-xl font-bold tracking-tight text-text-primary">Your Recent Searches</h3>
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

        {/* 3. Features Section */}
        <section className="py-24 border-t border-white/5">
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-4xl md:text-5xl font-bold tracking-tight text-center mb-16 gradient-text"
          >
            Explore All Features
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
                    <div className="glass-card-hover p-8 min-h-[180px] h-full flex flex-col justify-between transition-all duration-300">
                      <div>
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

        {/* 4. About Section */}
        <section className="py-24 border-t border-white/5 max-w-4xl mx-auto w-full">
          <div className="glass-card p-10 shadow-2xl">
            <h4 className="text-2xl font-bold tracking-tight text-text-primary mb-4 flex items-center gap-2">
              📚 About This Platform
            </h4>
            <p className="text-base text-text-secondary leading-relaxed mb-6">
              This platform demonstrates 5 core Data Structures & Algorithms working together in a real-world search engine.
              Every search query triggers: <span className="font-mono text-accent-blue">Trie.getSuggestions()</span>,{' '}
              <span className="font-mono text-accent-purple">HashMap.increment()</span>,{' '}
              <span className="font-mono text-warning">MaxHeap.updateScore()</span>, and{' '}
              <span className="font-mono text-accent-cyan">LRUCache.put()</span> — all in real time.
            </p>
            <div className="flex flex-wrap gap-2.5">
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
