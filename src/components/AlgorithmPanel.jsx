import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Activity, ChevronDown, ChevronUp } from 'lucide-react';

const AlgorithmPanel = ({ activeDS = [], lastOp = '', complexity = '' }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const dsLabels = {
    trie:        { name: 'Trie',        complexity: 'O(L)',    color: '#4f8ef7' },
    heap:        { name: 'Heap',        complexity: 'O(logN)', color: '#f59e0b' },
    lru:         { name: 'LRU Cache',   complexity: 'O(1)',    color: '#00d4aa' },
    hashmap:     { name: 'HashMap',     complexity: 'O(1)*',   color: '#a855f7' },
    levenshtein: { name: 'Levenshtein', complexity: 'O(m×n)',  color: '#ef4444' },
  };

  return (
    <motion.div
      style={{
        position: 'fixed',
        bottom: '16px',
        right: '16px',
        zIndex: 200,
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      <div
        style={{
          minWidth: '220px',
          borderRadius: '16px',
          background: 'rgba(17,17,24,0.92)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(255,255,255,0.1)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
          cursor: 'pointer',
          userSelect: 'none',
          overflow: 'hidden',
        }}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '10px 16px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Activity size={14} color="#00d4aa" />
            <span style={{ fontSize: '12px', fontWeight: 500, color: '#94a3b8' }}>
              Active Algorithms
            </span>
          </div>
          {isExpanded
            ? <ChevronUp size={14} color="#475569" />
            : <ChevronDown size={14} color="#475569" />
          }
        </div>

        {/* Expanded content */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              style={{ overflow: 'hidden' }}
            >
              <div
                style={{
                  padding: '8px 16px 14px',
                  borderTop: '1px solid rgba(255,255,255,0.06)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                }}
              >
                {/* DS tags */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {activeDS.map((ds) => {
                    const info = dsLabels[ds];
                    if (!info) return null;
                    return (
                      <span
                        key={ds}
                        style={{
                          fontSize: '10px',
                          fontFamily: 'JetBrains Mono, monospace',
                          fontWeight: 500,
                          padding: '2px 8px',
                          borderRadius: '999px',
                          backgroundColor: `${info.color}18`,
                          color: info.color,
                          border: `1px solid ${info.color}30`,
                        }}
                      >
                        {info.name} {info.complexity}
                      </span>
                    );
                  })}
                </div>

                {lastOp && (
                  <div style={{ fontSize: '11px', color: '#475569' }}>
                    <span style={{ color: '#94a3b8' }}>Last op: </span>
                    <span style={{ fontFamily: 'JetBrains Mono, monospace', color: '#4f8ef7' }}>
                      {lastOp}
                    </span>
                  </div>
                )}

                {complexity && (
                  <div style={{ fontSize: '11px', color: '#475569' }}>
                    <span style={{ color: '#94a3b8' }}>Time: </span>
                    <span style={{ fontFamily: 'JetBrains Mono, monospace', color: '#00d4aa' }}>
                      {complexity}
                    </span>
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
