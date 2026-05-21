import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Activity, ChevronDown, ChevronUp } from 'lucide-react';

const AlgorithmPanel = ({ activeDS = [], lastOp = '', complexity = '' }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const dsLabels = {
    trie: { name: 'Trie', complexity: 'O(L)', color: '#4f8ef7' },
    heap: { name: 'Heap', complexity: 'O(log N)', color: '#f59e0b' },
    lru: { name: 'LRU Cache', complexity: 'O(1)', color: '#00d4aa' },
    hashmap: { name: 'HashMap', complexity: 'O(1)*', color: '#a855f7' },
    levenshtein: { name: 'Levenshtein', complexity: 'O(m×n)', color: '#ef4444' },
  };

  return (
    <motion.div
      className="fixed bottom-4 right-4 z-50"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      <div
        className="glass-card cursor-pointer select-none"
        style={{ minWidth: 240 }}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2.5">
          <div className="flex items-center gap-2">
            <Activity size={14} className="text-accent-cyan" />
            <span className="text-xs font-medium text-text-secondary">
              Active Algorithms
            </span>
          </div>
          {isExpanded ? (
            <ChevronDown size={14} className="text-text-muted" />
          ) : (
            <ChevronUp size={14} className="text-text-muted" />
          )}
        </div>

        {/* Expanded Content */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="px-4 pb-3 space-y-2 border-t border-white/5 pt-2">
                {/* Active data structures */}
                <div className="flex flex-wrap gap-1.5">
                  {activeDS.map((ds) => {
                    const info = dsLabels[ds];
                    if (!info) return null;
                    return (
                      <span
                        key={ds}
                        className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-full"
                        style={{
                          backgroundColor: `${info.color}15`,
                          color: info.color,
                          border: `1px solid ${info.color}30`,
                        }}
                      >
                        {info.name} {info.complexity}
                      </span>
                    );
                  })}
                </div>

                {/* Last operation */}
                {lastOp && (
                  <div className="text-[11px] text-text-muted">
                    <span className="text-text-secondary">Last op: </span>
                    <span className="font-mono text-accent-blue">{lastOp}</span>
                  </div>
                )}

                {/* Complexity */}
                {complexity && (
                  <div className="text-[11px] text-text-muted">
                    <span className="text-text-secondary">Time: </span>
                    <span className="font-mono text-accent-cyan">{complexity}</span>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default AlgorithmPanel;
