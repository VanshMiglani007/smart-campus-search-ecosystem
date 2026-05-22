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
        <section className="relative flex flex-col items-center justify-center text-center pt-20 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 mb-8">
              <BookOpen size={14} className="text-accent-cyan" />
              <span className="text-xs text-text-secondary font-medium">
                DSA-Powered Search Engine
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl xl:text-6xl font-extrabold mb-6 leading-tight tracking-tight">
              <span className="gradient-text">Campus Intelligence</span>
            </h1>

            <p className="text-base md:text-lg text-text-secondary mb-8 max-w-2xl mx-auto">
              Search Everything. Understand Everything.
            </p>

            {/* Algorithm Indicators */}
            <div className="flex flex-wrap items-center justify-center gap-2.5">
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
                  {algo.name} <span className="opacity-60 text-xs">{algo.complexity}</span>
                </span>
              ))}
            </div>
          </motion.div>
        </section>

        {/* 2. Search Area */}
        <section className="py-16 border-t border-white/5 flex flex-col items-center">
          <h2 className="text-2xl md:text-3xl font-extrabold text-center mb-8 text-text-primary">
            Explore Campus IQ Search
          </h2>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="w-full max-w-3xl mx-auto mb-10"
          >
            <SearchBar onSelectSuggestion={handleSelectSuggestion} />
          </motion.div>

          {/* Quick Categories */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap items-center justify-center gap-2.5"
          >
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
          </motion.div>
        </section>

        {/* 3. Trending Section */}
        <section className="py-16 border-t border-white/5">
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
              <div className="flex items-center gap-2 mb-5">
                <Clock size={18} className="text-accent-cyan" />
                <h3 className="text-lg font-bold text-text-primary">Your Recent Searches</h3>
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
                    className="text-sm px-4 py-2 rounded-full border border-white/10 bg-white/5 text-text-secondary hover:bg-white/10 hover:text-text-primary hover:border-white/20 cursor-pointer transition-all active:scale-95"
                  >
                    {item.key}
                  </motion.span>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* 4. Features Section */}
        <section className="py-16 border-t border-white/5">
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-3xl md:text-4xl font-extrabold text-center mb-12 gradient-text"
          >
            Explore All Features
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                    <div className="glass-card-hover p-6 h-full flex flex-col justify-between transition-all duration-300">
                      <div>
                        <div className="flex items-start justify-between mb-4">
                          <div
                            className="w-12 h-12 rounded-xl flex items-center justify-center shadow-[0_4px_20px_rgba(0,0,0,0.3)]"
                            style={{ backgroundColor: `${feature.color}15` }}
                          >
                            <Icon size={22} style={{ color: feature.color }} />
                          </div>
                          <span
                            className="text-xs font-mono font-medium px-2.5 py-1 rounded-full shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]"
                            style={{
                              backgroundColor: `${feature.color}15`,
                              color: feature.color,
                              border: `1px solid ${feature.color}25`,
                            }}
                          >
                            {feature.complexity}
                          </span>
                        </div>
                        <h3 className="text-lg font-bold text-text-primary mb-2">
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

        {/* 5. About Box Section */}
        <section className="py-16 border-t border-white/5 max-w-4xl mx-auto w-full">
          <div className="glass-card p-8 shadow-2xl">
            <h4 className="text-lg font-bold text-text-primary mb-4 flex items-center gap-2">
              📚 About This Platform
            </h4>
            <p className="text-sm text-text-secondary leading-relaxed mb-6">
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
