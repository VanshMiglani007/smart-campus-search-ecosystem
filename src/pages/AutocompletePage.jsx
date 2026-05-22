import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Type, BookOpen, Zap } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useSearch } from '../context/SearchContext';
import SearchBar from '../components/SearchBar';
import ComplexityBadge from '../components/ComplexityBadge';

const AutocompletePage = () => {
  const { recordSelection, analytics } = useSearch();
  const [selectedWord, setSelectedWord] = useState(null);
  const [durationMin, setDurationMin] = useState(0);
  const location = useLocation();

  const initialQuery = location.state?.query || '';

  useEffect(() => {
    const updateDuration = () => {
      setDurationMin(Math.floor((Date.now() - analytics.sessionStart) / 60000));
    };
    updateDuration();
    const interval = setInterval(updateDuration, 10000);
    return () => clearInterval(interval);
  }, [analytics.sessionStart]);

  const handleSelect = (word) => {
    setSelectedWord(word);
    recordSelection(word);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen pt-28 pb-16 px-6"
    >
      <div className="max-w-5xl mx-auto">
        {/* Page Header */}
        <div className="text-center mb-10">
          <div className="w-14 h-14 rounded-2xl bg-accent-blue/10 flex items-center justify-center mx-auto mb-4">
            <Type size={28} className="text-accent-blue" />
          </div>
          <h1 className="text-3xl font-bold gradient-text mb-2">Live Autocomplete</h1>
          <p className="text-text-secondary text-sm">
            Type below — every keystroke queries the Trie in real time
          </p>
        </div>

        {/* Search Bar with Algorithm Info Panel */}
        <div className="mb-10">
          <SearchBar
            onSelectSuggestion={handleSelect}
            autoFocus={true}
            showAlgorithmInfo={true}
            initialQuery={initialQuery}
          />
        </div>

        {/* Selected Word Display */}
        {selectedWord && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-4 mb-8"
          >
            <div className="flex items-center gap-2 mb-1">
              <Zap size={14} className="text-accent-cyan" />
              <span className="text-xs text-text-muted">Selected Result</span>
            </div>
            <p className="text-lg font-semibold text-text-primary">{selectedWord}</p>
            <p className="text-xs text-text-muted mt-1">
              This search was logged across Trie (frequency++), HashMap (count++), MaxHeap (score++), and LRU Cache.
            </p>
          </motion.div>
        )}

        {/* How It Works Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {/* How autocomplete works */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-5"
          >
            <h3 className="text-sm font-semibold text-text-primary mb-3 flex items-center gap-2">
              🌳 How Trie Autocomplete Works
            </h3>
            <div className="space-y-2 text-xs text-text-secondary leading-relaxed">
              <p>
                <span className="text-accent-blue font-mono">1.</span> User types prefix (e.g., &quot;DA&quot;)
              </p>
              <p>
                <span className="text-accent-blue font-mono">2.</span> Trie navigates: root → D → A in O(L)
              </p>
              <p>
                <span className="text-accent-blue font-mono">3.</span> DFS collects all words below that node
              </p>
              <p>
                <span className="text-accent-blue font-mono">4.</span> Results sorted by frequency (MaxHeap order)
              </p>
              <p>
                <span className="text-accent-blue font-mono">5.</span> Top 8 returned to UI instantly
              </p>
            </div>
            <div className="mt-3 pt-3 border-t border-white/5 flex gap-2">
              <ComplexityBadge type="time" value="O(L + K)" color="blue" />
              <ComplexityBadge type="space" value="O(N×L)" color="purple" />
            </div>
          </motion.div>

          {/* What happens on search */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card p-5"
          >
            <h3 className="text-sm font-semibold text-text-primary mb-3 flex items-center gap-2">
              ⚡ What Happens Per Keystroke
            </h3>
            <div className="space-y-2.5">
              {[
                { ds: 'Trie', op: 'getSuggestions(prefix)', color: '#4f8ef7', complexity: 'O(L+K)' },
                { ds: 'HashMap', op: 'increment(query)', color: '#a855f7', complexity: 'O(1)' },
                { ds: 'MaxHeap', op: 'updateScore(query, +1)', color: '#f59e0b', complexity: 'O(log N)' },
                { ds: 'LRU Cache', op: 'put(query)', color: '#00d4aa', complexity: 'O(1)' },
              ].map((item) => (
                <div key={item.ds} className="flex items-center gap-2 text-xs">
                  <div
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-text-secondary w-16 flex-shrink-0">{item.ds}</span>
                  <span className="font-mono text-text-muted flex-1">{item.op}</span>
                  <span
                    className="font-mono text-[10px] px-1.5 py-0.5 rounded"
                    style={{ color: item.color, backgroundColor: `${item.color}15` }}
                  >
                    {item.complexity}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Session Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8"
        >
          {[
            { label: 'Total Searches', value: analytics.totalSearches, color: '#4f8ef7' },
            {
              label: 'Avg Response',
              value: analytics.responseTimes.length > 0
                ? `${(analytics.responseTimes.reduce((a, b) => a + b, 0) / analytics.responseTimes.length).toFixed(2)}ms`
                : '—',
              color: '#00d4aa',
            },
            {
              label: 'Last Response',
              value: analytics.responseTimes.length > 0
                ? `${analytics.responseTimes[analytics.responseTimes.length - 1].toFixed(2)}ms`
                : '—',
              color: '#a855f7',
            },
            {
              label: 'Session Duration',
              value: `${durationMin}m`,
              color: '#f59e0b',
            },
          ].map((stat) => (
            <div key={stat.label} className="glass-card p-3 text-center">
              <div className="text-[10px] text-text-muted uppercase tracking-wider mb-1">{stat.label}</div>
              <div className="text-lg font-bold font-mono" style={{ color: stat.color }}>
                {stat.value}
              </div>
            </div>
          ))}
        </motion.div>

        {/* Viva Info Box */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="glass-card p-5 mb-16"
        >
          <h4 className="text-sm font-semibold text-text-primary mb-2 flex items-center gap-2">
            <BookOpen size={14} />
            📚 About This Feature
          </h4>
          <p className="text-xs text-text-secondary leading-relaxed mb-2">
            This page demonstrates the <strong className="text-text-primary">Trie data structure</strong> for prefix-based autocomplete search.
            Unlike linear search which checks every word O(N), a Trie navigates directly to the prefix in O(L) time,
            making it ideal for real-time search as the user types.
          </p>
          <p className="text-xs text-text-secondary leading-relaxed mb-2">
            When no results are found, the system falls back to <strong className="text-text-primary">Levenshtein distance</strong> (edit distance)
            to suggest the closest matching word — &quot;Did you mean...?&quot; feature using Dynamic Programming.
          </p>
          <div className="flex flex-wrap gap-2 mt-3">
            <ComplexityBadge type="time" value="O(L) Search" color="blue" />
            <ComplexityBadge type="time" value="O(L+K) Suggest" color="cyan" />
            <ComplexityBadge type="space" value="O(N×L) Trie" color="purple" />
          </div>
          <p className="text-[10px] text-text-muted mt-2">
            Real-world use: Google Search, VS Code IntelliSense, mobile keyboard predictions
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default AutocompletePage;
