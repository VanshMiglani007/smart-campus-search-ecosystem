import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Type, BookOpen, Zap } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useSearch } from '../context/SearchContext';
import SearchBar from '../components/SearchBar';
import ComplexityBadge from '../components/ComplexityBadge';
import { S, C } from '../styles';

const AutocompletePage = () => {
  const { recordSelection, analytics } = useSearch();
  const [selectedWord, setSelectedWord] = useState(null);
  const [durationMin, setDurationMin] = useState(0);
  const location = useLocation();
  const initialQuery = location.state?.query || '';

  useEffect(() => {
    const updateDuration = () => setDurationMin(Math.floor((Date.now() - analytics.sessionStart) / 60000));
    updateDuration();
    const interval = setInterval(updateDuration, 10000);
    return () => clearInterval(interval);
  }, [analytics.sessionStart]);

  const handleSelect = (word) => {
    setSelectedWord(word);
    recordSelection(word);
  };

  const operations = [
    { ds: 'Trie',      op: 'getSuggestions(prefix)',  color: C.blue,   complexity: 'O(L+K)' },
    { ds: 'HashMap',   op: 'increment(query)',         color: C.purple, complexity: 'O(1)' },
    { ds: 'MaxHeap',   op: 'updateScore(query, +1)',   color: C.amber,  complexity: 'O(log N)' },
    { ds: 'LRU Cache', op: 'put(query)',               color: C.cyan,   complexity: 'O(1)' },
  ];

  const statCards = [
    { label: 'Total Searches',  value: analytics.totalSearches, color: C.blue },
    {
      label: 'Avg Response',
      value: analytics.responseTimes.length > 0
        ? `${(analytics.responseTimes.reduce((a, b) => a + b, 0) / analytics.responseTimes.length).toFixed(2)}ms`
        : '—',
      color: C.cyan,
    },
    {
      label: 'Last Response',
      value: analytics.responseTimes.length > 0
        ? `${analytics.responseTimes[analytics.responseTimes.length - 1].toFixed(2)}ms`
        : '—',
      color: C.purple,
    },
    { label: 'Session Duration', value: `${durationMin}m`, color: C.amber },
  ];

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
        <div style={S.iconBadge(C.blue)}>
          <Type size={26} color={C.blue} />
        </div>
        <h1 style={S.pageTitle}>Live Autocomplete</h1>
        <p style={S.pageSubtitle}>Type below — every keystroke queries the Trie in real time</p>
      </div>

      {/* Search Bar */}
      <div style={{ marginBottom: '24px' }}>
        <SearchBar
          onSelectSuggestion={handleSelect}
          autoFocus
          showAlgorithmInfo
          initialQuery={initialQuery}
        />
      </div>

      {/* Selected word */}
      {selectedWord && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ ...S.card, border: `1px solid ${C.cyan}30`, background: `rgba(0,212,170,0.04)` }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <Zap size={14} color={C.cyan} />
            <span style={S.muted}>Selected Result</span>
          </div>
          <p style={{ fontSize: '18px', fontWeight: 600, color: '#f1f5f9' }}>{selectedWord}</p>
          <p style={{ ...S.muted, marginTop: '6px' }}>
            Logged across Trie (frequency++), HashMap (count++), MaxHeap (score++), and LRU Cache.
          </p>
        </motion.div>
      )}

      {/* How It Works */}
      <div style={S.grid2}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} style={{ ...S.card, marginBottom: 0 }}>
          <div style={S.cardTitle}>🌳 How Trie Autocomplete Works</div>
          {[
            <>User types prefix (e.g., &quot;DA&quot;)</>,
            <>Trie navigates: root → D → A in <span style={S.mono(C.blue)}>O(L)</span></>,
            'DFS collects all words below that node',
            'Results sorted by frequency (MaxHeap order)',
            'Top 8 returned to UI instantly',
          ].map((t, i) => (
            <p key={i} style={S.cardText}>
              <span style={S.mono(C.blue)}>{i + 1}.</span> {t}
            </p>
          ))}
          <div style={{ display: 'flex', gap: '8px', marginTop: '14px', flexWrap: 'wrap' }}>
            <ComplexityBadge type="time" value="O(L + K)" color="blue" />
            <ComplexityBadge type="space" value="O(N×L)" color="purple" />
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} style={{ ...S.card, marginBottom: 0 }}>
          <div style={S.cardTitle}>⚡ What Happens Per Keystroke</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {operations.map((item) => (
              <div key={item.ds} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: item.color, flexShrink: 0 }} />
                <span style={{ color: '#94a3b8', width: '72px', flexShrink: 0, fontSize: '12px' }}>{item.ds}</span>
                <span style={{ fontFamily: 'JetBrains Mono, monospace', color: '#475569', flex: 1, fontSize: '11px' }}>{item.op}</span>
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', padding: '2px 8px', borderRadius: '6px', background: `${item.color}14`, color: item.color, border: `1px solid ${item.color}25`, flexShrink: 0 }}>
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
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: '16px',
          marginBottom: '20px',
        }}
      >
        {statCards.map((stat) => (
          <div key={stat.label} style={S.statCard(stat.color)}>
            <div style={{ fontSize: '11px', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '8px' }}>{stat.label}</div>
            <div style={{ fontSize: '24px', fontWeight: 700, fontFamily: 'JetBrains Mono, monospace', color: stat.color }}>{stat.value}</div>
          </div>
        ))}
      </motion.div>

      {/* About */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} style={S.infoBox}>
        <div style={S.cardTitle}><BookOpen size={14} /> 📚 About This Feature</div>
        <p style={S.cardText}>
          This page demonstrates the <strong style={{ color: C.white }}>Trie data structure</strong> for prefix-based autocomplete search.
          Unlike linear search which checks every word O(N), a Trie navigates directly to the prefix in O(L) time,
          making it ideal for real-time search as the user types.
        </p>
        <p style={S.cardText}>
          When no results are found, the system falls back to <strong style={{ color: C.white }}>Levenshtein distance</strong> (edit distance)
          to suggest the closest matching word — &quot;Did you mean...?&quot; feature using Dynamic Programming.
        </p>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '12px' }}>
          <ComplexityBadge type="time" value="O(L) Search" color="blue" />
          <ComplexityBadge type="time" value="O(L+K) Suggest" color="cyan" />
          <ComplexityBadge type="space" value="O(N×L) Trie" color="purple" />
        </div>
        <p style={{ ...S.muted, marginTop: '8px' }}>Real-world use: Google Search, VS Code IntelliSense, mobile keyboard predictions</p>
      </motion.div>
    </motion.div>
  );
};

export default AutocompletePage;
