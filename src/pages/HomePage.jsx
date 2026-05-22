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
      className="min-h-screen pt-28 pb-12"
    >
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center px-6 pt-20 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-center max-w-4xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 mb-8">
            <BookOpen size={14} className="text-accent-cyan" />
            <span className="text-xs text-text-secondary font-medium">
              DSA-Powered Search Engine
            </span>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            <span className="gradient-text">Campus Intelligence</span>
          </h1>

          <p className="text-lg sm:text-xl text-text-secondary mb-10 max-w-2xl mx-auto">
            Search Everything. Understand Everything.
          </p>

          {/* Algorithm Indicators */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 mb-12">
            {[
              { name: 'Trie', complexity: 'O(L)', color: '#4f8ef7' },
              { name: 'MaxHeap', complexity: 'O(log N)', color: '#f59e0b' },
              { name: 'LRU Cache', complexity: 'O(1)', color: '#00d4aa' },
              { name: 'HashMap', complexity: 'O(1)*', color: '#a855f7' },
              { name: 'Levenshtein DP', complexity: 'O(m×n)', color: '#ef4444' },
            ].map((algo) => (
              <span
                key={algo.name}
                className="text-xs font-mono font-medium px-3.5 py-1.5 rounded-full shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] border"
                style={{
                  backgroundColor: `${algo.color}10`,
                  color: algo.color,
                  borderColor: `${algo.color}25`,
                }}
              >
                {algo.name} {algo.complexity}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="w-full max-w-2xl mx-auto mb-10"
        >
          <SearchBar onSelectSuggestion={handleSelectSuggestion} />
        </motion.div>

        {/* Quick Categories */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex flex-wrap items-center justify-center gap-2.5 mb-8"
        >
          {quickCategories.map((cat) => {
            const color = getCategoryColor(cat.category);
            return (
              <button
                key={cat.category}
                onClick={() => handleCategoryClick(cat.name)}
                className="text-xs px-4 py-2 rounded-full border transition-all hover:scale-105 hover:bg-white/5 active:scale-95 cursor-pointer"
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
        </motion.div>
      </section>

      {/* Trending Section */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 mt-12 mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <TrendingPanel items={trendingItems} onClickItem={handleTrendingClick} />
        </motion.div>
      </section>

      {/* Recent Searches */}
      {recentSearches.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 lg:px-8 my-16">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex items-center gap-2 mb-5">
              <Clock size={18} className="text-accent-cyan" />
              <h3 className="text-sm font-semibold text-text-primary">Your Recent Searches</h3>
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
                  className="text-xs px-3.5 py-2 rounded-full border border-white/10 bg-white/5 text-text-secondary hover:bg-white/10 hover:text-text-primary hover:border-white/20 cursor-pointer transition-all active:scale-95"
                >
                  {item.key}
                </motion.span>
              ))}
            </div>
          </motion.div>
        </section>
      )}

      {/* Feature Cards Grid */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 mt-20 mb-20">
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-2xl font-bold text-center mb-12 gradient-text"
        >
          Explore All Features
        </motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.path}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 * index + 0.5 }}
              >
                <Link to={feature.path} className="block">
                  <div className="glass-card-hover p-6 h-full flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between mb-4">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center shadow-[0_4px_20px_rgba(0,0,0,0.3)]"
                          style={{ backgroundColor: `${feature.color}15` }}
                        >
                          <Icon size={20} style={{ color: feature.color }} />
                        </div>
                        <span
                          className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-full shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]"
                          style={{
                            backgroundColor: `${feature.color}15`,
                            color: feature.color,
                            border: `1px solid ${feature.color}25`,
                          }}
                        >
                          {feature.complexity}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-text-primary mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-xs text-text-secondary leading-relaxed">
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

      {/* About Box */}
      <section className="max-w-4xl mx-auto px-6 mt-16 mb-24">
        <div className="glass-card p-6 shadow-2xl">
          <h4 className="text-sm font-semibold text-text-primary mb-3 flex items-center gap-2">
            📚 About This Platform
          </h4>
          <p className="text-xs text-text-secondary leading-relaxed mb-4">
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
    </motion.div>
  );
};

export default HomePage;
