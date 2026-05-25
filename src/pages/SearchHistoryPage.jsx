import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Plus, BookOpen, Trash2 } from 'lucide-react';
import { useSearch } from '../context/SearchContext';
import ComplexityBadge from '../components/ComplexityBadge';
import { S, C } from '../styles';

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
    performSearch(word);
    setInputValue('');
    setTimeout(() => setAnimatingKey(null), 800);
  };

  const handleClear = () => {
    const cache = lru.current;
    if (cache) {
      cache.clear();
      performSearch(' ');
    }
  };

  const cacheCapacity = lru?.current?.getCapacity() || 7;
  const cacheSize = lru?.current?.getSize() || 0;
  const isFull = cacheSize >= cacheCapacity;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.3 }}
      style={S.page}
    >
      {/* Header */}
      <div style={S.pageHeader}>
        <div style={S.iconBadge(C.cyan)}>
          <Clock size={26} color={C.cyan} />
        </div>
        <h1 style={S.pageTitle}>Search History</h1>
        <p style={S.pageSubtitle}>LRU Cache — Doubly Linked List + HashMap visualization</p>
      </div>

      {/* Cache Status */}
      <div style={S.card}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <div>
              <div style={S.label}>Capacity</div>
              <div style={{ fontSize: '24px', fontWeight: 700, fontFamily: 'JetBrains Mono, monospace', color: C.cyan }}>
                {cacheSize} / {cacheCapacity}
              </div>
            </div>
            <div style={{ width: '1px', height: '40px', background: 'rgba(255,255,255,0.08)' }} />
            <div>
              <div style={S.label}>Status</div>
              <div style={{ fontSize: '14px', fontWeight: 500, color: isFull ? C.amber : C.cyan }}>
                {isFull ? '⚠️ Full — next insert evicts LRU' : '✅ Has space'}
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <ComplexityBadge type="time" value="O(1) Get" color="cyan" />
            <ComplexityBadge type="time" value="O(1) Put" color="blue" />
          </div>
        </div>
        {/* Capacity bar */}
        <div style={{ height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '999px', overflow: 'hidden' }}>
          <motion.div
            style={{
              height: '100%',
              borderRadius: '999px',
              background: isFull
                ? 'linear-gradient(90deg, #f59e0b, #ef4444)'
                : 'linear-gradient(90deg, #00d4aa, #4f8ef7)',
            }}
            animate={{ width: `${(cacheSize / cacheCapacity) * 100}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Linked List Visualization */}
      <div style={S.card}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
          <span style={S.sectionTitle}>Doubly Linked List Visualization</span>
          <div style={{ display: 'flex', gap: '16px', fontSize: '11px', color: '#475569' }}>
            <span>← Most Recent (HEAD)</span>
            <span>Least Recent (TAIL) →</span>
          </div>
        </div>

        {recentSearches.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: '#475569', fontSize: '14px' }}>
            Your search history will appear here. Start searching on the Home page!
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0', overflowX: 'auto', paddingBottom: '12px' }}>
            <div style={{ flexShrink: 0, marginRight: '8px', textAlign: 'center' }}>
              <div style={{ fontSize: '9px', fontFamily: 'JetBrains Mono, monospace', color: C.cyan, marginBottom: '4px' }}>HEAD</div>
              <div style={{ color: C.cyan, fontSize: '16px' }}>↓</div>
            </div>

            {recentSearches.map((item, index) => (
              <div key={item.key} style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                <AnimatePresence mode="popLayout">
                  <motion.div
                    layout
                    initial={animatingKey === item.key ? { opacity: 0, scale: 0.5, x: -30 } : { opacity: 1 }}
                    animate={{ opacity: evictedKey === item.key ? 0 : 1, scale: evictedKey === item.key ? 0.5 : 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    onClick={() => setInputValue(item.key)}
                    style={{
                      padding: '12px 16px',
                      minWidth: '100px',
                      textAlign: 'center',
                      cursor: 'pointer',
                      borderRadius: '14px',
                      background: evictedKey === item.key ? 'rgba(239,68,68,0.1)' : 'rgba(255,255,255,0.04)',
                      border: `1px solid ${index === 0 ? 'rgba(0,212,170,0.35)' : index === recentSearches.length - 1 ? 'rgba(239,68,68,0.2)' : 'rgba(255,255,255,0.1)'}`,
                      transition: 'all 0.2s',
                    }}
                  >
                    <div style={{ fontSize: '12px', fontWeight: 500, color: '#f1f5f9', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '90px' }}>
                      {item.key}
                    </div>
                    <div style={{ fontSize: '9px', fontFamily: 'JetBrains Mono, monospace', color: '#475569', marginTop: '4px' }}>
                      {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </div>
                  </motion.div>
                </AnimatePresence>
                {index < recentSearches.length - 1 && (
                  <div style={{ flexShrink: 0, margin: '0 4px', color: '#475569', fontSize: '12px', fontFamily: 'JetBrains Mono, monospace' }}>↔</div>
                )}
              </div>
            ))}

            <div style={{ flexShrink: 0, marginLeft: '8px', textAlign: 'center' }}>
              <div style={{ fontSize: '9px', fontFamily: 'JetBrains Mono, monospace', color: '#ef4444', marginBottom: '4px' }}>TAIL</div>
              <div style={{ color: '#ef4444', fontSize: '16px' }}>↓</div>
            </div>
          </div>
        )}

        <AnimatePresence>
          {evictedKey && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              style={{ marginTop: '12px', padding: '10px 16px', borderRadius: '10px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', fontSize: '13px', color: '#ef4444', textAlign: 'center' }}
            >
              🗑️ Evicted &quot;{evictedKey}&quot; (Least Recently Used)
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Insert Demo */}
      <div style={S.card}>
        <div style={S.cardTitle}>Insert New Search Demo</div>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddToCache()}
            placeholder="Type a search term..."
            style={S.input}
          />
          <button onClick={handleAddToCache} style={S.btnSecondary(C.cyan)}>
            <Plus size={14} /> Add to Cache
          </button>
          <button onClick={handleClear} style={S.btnDanger}>
            <Trash2 size={14} /> Clear
          </button>
        </div>
        <p style={{ ...S.muted, marginTop: '10px' }}>
          When cache is full ({cacheCapacity} items), the TAIL node (least recently used) will be evicted.
        </p>
      </div>

      {/* How It Works */}
      <div style={S.grid2}>
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} style={{ ...S.card, marginBottom: 0 }}>
          <div style={S.cardTitle}>📋 How LRU Cache Works</div>
          {[
            [<><span style={S.mono(C.cyan)}>get(key)</span> — Move node to HEAD (most recent). O(1) via HashMap lookup.</>],
            [<><span style={S.mono(C.cyan)}>put(key, val)</span> — Insert at HEAD. If full, evict TAIL node. O(1).</>],
            [<><span style={S.mono(C.cyan)}>Eviction</span> — Remove the TAIL.prev node (least recently used).</>],
          ].map(([t], i) => <p key={i} style={S.cardText}>{t}</p>)}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} style={{ ...S.card, marginBottom: 0 }}>
          <div style={S.cardTitle}>🏗️ Internal Structure</div>
          {[
            'Doubly Linked List: HEAD ↔ node1 ↔ node2 ↔ ... ↔ TAIL',
            'HashMap: key → DLLNode (O(1) access)',
            'Sentinel nodes: HEAD and TAIL simplify edge cases',
            'Each node stores: key, value, prev, next, timestamp',
          ].map((t, i) => <p key={i} style={{ ...S.cardText, fontFamily: 'JetBrains Mono, monospace', fontSize: '12px' }}>{t}</p>)}
        </motion.div>
      </div>

      {/* About */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} style={S.infoBox}>
        <div style={S.cardTitle}><BookOpen size={14} /> 📚 About This Feature</div>
        <p style={S.cardText}>
          This page demonstrates the <strong style={{ color: C.white }}>LRU (Least Recently Used) Cache</strong> implemented
          with a <strong style={{ color: C.white }}>Doubly Linked List + HashMap</strong>.
          The combination achieves O(1) for both get and put operations — the HashMap provides instant lookup,
          while the DLL maintains insertion order for efficient eviction.
        </p>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '12px' }}>
          <ComplexityBadge type="time" value="O(1) Get" color="cyan" />
          <ComplexityBadge type="time" value="O(1) Put" color="blue" />
          <ComplexityBadge type="space" value="O(K) capacity" color="purple" />
        </div>
        <p style={{ ...S.muted, marginTop: '8px' }}>Real-world use: Browser cache, CPU cache, database query cache, Redis LRU eviction</p>
      </motion.div>
    </motion.div>
  );
};

export default SearchHistoryPage;
