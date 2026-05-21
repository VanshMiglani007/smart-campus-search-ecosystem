import { motion } from 'framer-motion';
import { Search, GitBranch, BarChart3, Clock, TrendingUp, Gauge, SpellCheck, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

const features = [
  {
    title: 'Live Autocomplete',
    description: 'Trie-powered instant search suggestions as you type',
    icon: Search,
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

const HomePage = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen pt-14"
    >
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center px-4 pt-20 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-center max-w-4xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 mb-6">
            <BookOpen size={14} className="text-accent-cyan" />
            <span className="text-xs text-text-secondary font-medium">
              DSA-Powered Search Engine
            </span>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-4 leading-tight">
            <span className="gradient-text">Campus Intelligence</span>
          </h1>

          <p className="text-lg sm:text-xl text-text-secondary mb-8 max-w-2xl mx-auto">
            Search Everything. Understand Everything.
          </p>

          {/* Algorithm Indicators */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
            {[
              { name: 'Trie', complexity: 'O(L)', color: '#4f8ef7' },
              { name: 'MaxHeap', complexity: 'O(log N)', color: '#f59e0b' },
              { name: 'LRU Cache', complexity: 'O(1)', color: '#00d4aa' },
              { name: 'HashMap', complexity: 'O(1)*', color: '#a855f7' },
              { name: 'Levenshtein DP', complexity: 'O(m×n)', color: '#ef4444' },
            ].map((algo) => (
              <span
                key={algo.name}
                className="text-xs font-mono font-medium px-3 py-1 rounded-full"
                style={{
                  backgroundColor: `${algo.color}15`,
                  color: algo.color,
                  border: `1px solid ${algo.color}30`,
                }}
              >
                {algo.name} {algo.complexity}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Placeholder for search bar — will be fully wired in Milestone 3 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="w-full max-w-2xl mx-auto mb-16"
        >
          <div className="glass-card flex items-center gap-3 px-5 py-4">
            <Search size={20} className="text-text-muted" />
            <span className="text-text-muted text-sm">
              Search bar coming in Milestone 3...
            </span>
          </div>
        </motion.div>
      </section>

      {/* Feature Cards Grid */}
      <section className="max-w-6xl mx-auto px-4 pb-20">
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-2xl font-bold text-center mb-10 gradient-text"
        >
          Explore All Features
        </motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.path}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 * index }}
              >
                <Link to={feature.path} className="block">
                  <div className="glass-card-hover p-5 h-full">
                    <div className="flex items-start justify-between mb-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: `${feature.color}15` }}
                      >
                        <Icon size={20} style={{ color: feature.color }} />
                      </div>
                      <span
                        className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-full"
                        style={{
                          backgroundColor: `${feature.color}15`,
                          color: feature.color,
                          border: `1px solid ${feature.color}30`,
                        }}
                      >
                        {feature.complexity}
                      </span>
                    </div>
                    <h3 className="text-base font-semibold text-text-primary mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-xs text-text-muted leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>
    </motion.div>
  );
};

export default HomePage;
