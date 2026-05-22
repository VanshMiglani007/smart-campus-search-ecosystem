import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Plus, BookOpen, Trash2 } from 'lucide-react';
import { useSearch } from '../context/SearchContext';
import ComplexityBadge from '../components/ComplexityBadge';

const SearchHistoryPage = () => {
  const { lru, recentSearches, performSearch } = useSearch();
  const [inputValue, setInputValue] = useState('');
  const [evictedKey, setEvictedKey] = useState(null);
  const [animatingKey, setAnimatingKey] = useState(null);

  const handleAddToCache = () => {
    const word = inputValue.trim();
    if (!word) return;

    const cache = lru.current;
    if (!cache) return;

    setAnimatingKey(word);
    const result = cache.put(word, word);

    if (result.evictedKey) {
      setEvictedKey(result.evictedKey);
      setTimeout(() => setEvictedKey(null), 2000);
    }

    // Also trigger the search pipeline to keep everything in sync
    performSearch(word);

    setInputValue('');
    setTimeout(() => setAnimatingKey(null), 800);
  };

  const handleClear = () => {
    const cache = lru.current;
    if (cache) {
      cache.clear();
      // Force re-render by performing a no-op search
      performSearch(' ');
    }
  };

  const cacheCapacity = lru?.current?.getCapacity() || 7;
  const cacheSize = lru?.current?.getSize() || 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen pt-20 px-4"
    >
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-accent-cyan/10 flex items-center justify-center mx-auto mb-4">
            <Clock size={28} className="text-accent-cyan" />
          </div>
          <h1 className="text-3xl font-bold gradient-text mb-2">Search History</h1>
          <p className="text-text-secondary text-sm">LRU Cache — Doubly Linked List + HashMap visualization</p>
        </div>

        {/* Cache Status Bar */}
        <div className="glass-card p-4 mb-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-4">
              <div>
                <span className="text-[10px] text-text-muted uppercase tracking-wider">Capacity</span>
                <div className="text-lg font-bold font-mono text-accent-cyan">{cacheSize} / {cacheCapacity}</div>
              </div>
              <div className="h-8 w-px bg-white/10" />
              <div>
                <span className="text-[10px] text-text-muted uppercase tracking-wider">Status</span>
                <div className={`text-sm font-medium ${cacheSize >= cacheCapacity ? 'text-warning' : 'text-accent-cyan'}`}>
                  {cacheSize >= cacheCapacity ? '⚠️ Full — next insert evicts LRU' : '✅ Has space'}
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <ComplexityBadge type="time" value="O(1) Get" color="cyan" />
              <ComplexityBadge type="time" value="O(1) Put" color="blue" />
            </div>
          </div>
          {/* Capacity bar */}
          <div className="mt-3 h-2 bg-white/5 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{
                background: cacheSize >= cacheCapacity
                  ? 'linear-gradient(90deg, #f59e0b, #ef4444)'
                  : 'linear-gradient(90deg, #00d4aa, #4f8ef7)',
              }}
              animate={{ width: `${(cacheSize / cacheCapacity) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Visual Linked List */}
        <div className="glass-card p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-text-primary">
              Doubly Linked List Visualization
            </h3>
            <div className="flex items-center gap-4 text-[10px] text-text-muted">
              <span>← Most Recent (HEAD)</span>
              <span>Least Recent (TAIL) →</span>
            </div>
          </div>

          {recentSearches.length === 0 ? (
            <div className="text-center py-10 text-text-muted text-sm">
              Your search history will appear here. Start searching on the Home page!
            </div>
          ) : (
            <div className="flex items-center gap-0 overflow-x-auto pb-3">
              {/* HEAD label */}
              <div className="flex-shrink-0 mr-2">
                <div className="text-[9px] font-mono text-accent-cyan text-center mb-1">HEAD</div>
                <div className="text-accent-cyan text-lg">↓</div>
              </div>

              {recentSearches.map((item, index) => (
                <div key={item.key} className="flex items-center flex-shrink-0">
                  <AnimatePresence mode="popLayout">
                    <motion.div
                      layout
                      initial={animatingKey === item.key ? { opacity: 0, scale: 0.5, x: -30 } : { opacity: 1 }}
                      animate={{
                        opacity: evictedKey === item.key ? 0 : 1,
                        scale: evictedKey === item.key ? 0.5 : 1,
                        x: 0,
                      }}
                      transition={{ duration: 0.3 }}
                      className={`
                        glass-card px-4 py-3 min-w-[100px] text-center cursor-default
                        ${index === 0 ? 'border-accent-cyan/30' : ''}
                        ${index === recentSearches.length - 1 ? 'border-red-500/20' : ''}
                        ${evictedKey === item.key ? 'bg-red-500/10' : ''}
                      `}
                      style={{
                        borderColor: index === 0 ? 'rgba(0,212,170,0.3)' : undefined,
                      }}
                    >
                      <div className="text-xs font-medium text-text-primary truncate max-w-[90px]">
                        {item.key}
                      </div>
                      <div className="text-[9px] text-text-muted font-mono mt-1">
                        {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </div>
                    </motion.div>
                  </AnimatePresence>

                  {/* Arrow */}
                  {index < recentSearches.length - 1 && (
                    <div className="flex-shrink-0 mx-1 text-text-muted">
                      <span className="text-[10px] font-mono">↔</span>
                    </div>
                  )}
                </div>
              ))}

              {/* TAIL label */}
              <div className="flex-shrink-0 ml-2">
                <div className="text-[9px] font-mono text-red-400 text-center mb-1">TAIL</div>
                <div className="text-red-400 text-lg">↓</div>
              </div>
            </div>
          )}

          {/* Eviction alert */}
          <AnimatePresence>
            {evictedKey && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-3 px-3 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-red-400 text-center"
              >
                🗑️ Evicted &quot;{evictedKey}&quot; (Least Recently Used)
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Insert Demo */}
        <div className="glass-card p-5 mb-6">
          <h3 className="text-sm font-semibold text-text-primary mb-3">Insert New Search Demo</h3>
          <div className="flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddToCache()}
              placeholder="Type a search term..."
              className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-text-primary outline-none focus:border-accent-cyan/50 transition-colors"
            />
            <button
              onClick={handleAddToCache}
              className="px-4 py-2.5 rounded-lg bg-accent-cyan/20 text-accent-cyan text-sm font-medium hover:bg-accent-cyan/30 transition-colors flex items-center gap-1.5"
            >
              <Plus size={14} /> Add to Cache
            </button>
            <button
              onClick={handleClear}
              className="px-4 py-2.5 rounded-lg bg-red-500/10 text-red-400 text-sm font-medium hover:bg-red-500/20 transition-colors flex items-center gap-1.5"
            >
              <Trash2 size={14} /> Clear
            </button>
          </div>
          <p className="text-[10px] text-text-muted mt-2">
            When cache is full ({cacheCapacity} items), the TAIL node (least recently used) will be evicted with a red fade-out animation.
          </p>
        </div>

        {/* Data Structure Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-5"
          >
            <h3 className="text-sm font-semibold text-text-primary mb-3">📋 How LRU Cache Works</h3>
            <div className="space-y-2 text-xs text-text-secondary leading-relaxed">
              <p>
                <span className="text-accent-cyan font-mono">get(key)</span> — Move node to HEAD (most recent). O(1) via HashMap lookup.
              </p>
              <p>
                <span className="text-accent-cyan font-mono">put(key, val)</span> — Insert at HEAD. If full, evict TAIL node. O(1).
              </p>
              <p>
                <span className="text-accent-cyan font-mono">Eviction</span> — Remove the TAIL.prev node (least recently used).
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card p-5"
          >
            <h3 className="text-sm font-semibold text-text-primary mb-3">🏗️ Internal Structure</h3>
            <div className="space-y-2 text-xs font-mono text-text-muted">
              <p>Doubly Linked List: HEAD ↔ node1 ↔ node2 ↔ ... ↔ TAIL</p>
              <p>HashMap: key → DLLNode (O(1) access)</p>
              <p>Sentinel nodes: HEAD and TAIL simplify edge cases</p>
              <p>Each node stores: key, value, prev, next, timestamp</p>
            </div>
          </motion.div>
        </div>

        {/* Viva Info Box */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="glass-card p-5 mb-16"
        >
          <h4 className="text-sm font-semibold text-text-primary mb-2 flex items-center gap-2">
            <BookOpen size={14} />
            📚 About This Feature
          </h4>
          <p className="text-xs text-text-secondary leading-relaxed mb-2">
            This page demonstrates the <strong className="text-text-primary">LRU (Least Recently Used) Cache</strong> implemented
            with a <strong className="text-text-primary">Doubly Linked List + HashMap</strong>.
            The combination achieves O(1) for both get and put operations — the HashMap provides instant lookup,
            while the DLL maintains insertion order for efficient eviction.
          </p>
          <div className="flex flex-wrap gap-2 mt-3">
            <ComplexityBadge type="time" value="O(1) Get" color="cyan" />
            <ComplexityBadge type="time" value="O(1) Put" color="blue" />
            <ComplexityBadge type="space" value="O(K) capacity" color="purple" />
          </div>
          <p className="text-[10px] text-text-muted mt-2">
            Real-world use: Browser cache, CPU cache, database query cache, Redis LRU eviction
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default SearchHistoryPage;
