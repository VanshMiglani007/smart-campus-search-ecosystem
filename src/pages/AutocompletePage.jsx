import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Type, BookOpen, Zap, Sparkles, Cpu, Cpu as TerminalIcon, Clock, CheckCircle2 } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useSearch } from '../context/SearchContext';
import SearchBar from '../components/SearchBar';
import ComplexityBadge from '../components/ComplexityBadge';
import { S, C } from '../styles';
import campusData, { getCategoryColor } from '../data/campusData';

const AutocompletePage = () => {
  const { recordSelection, analytics } = useSearch();
  const [selectedWord, setSelectedWord] = useState(null);
  const [searchesList, setSearchesList] = useState([]);
  const [durationMin, setDurationMin] = useState(0);
  const [activeTab, setActiveTab] = useState('how-it-works'); // 'how-it-works' | 'stats'
  
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
    
    // Append to live activity stream
    setSearchesList(prev => {
      const filtered = prev.filter(w => w.word !== word);
      const match = campusData.find(item => item.word === word) || { category: 'custom' };
      return [{ word, category: match.category, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) }, ...filtered].slice(0, 3);
    });
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

      {/* 2-Column Responsive Layout */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1.1fr 0.9fr',
          gap: '28px',
          alignItems: 'start',
          width: '100%',
        }}
        className="autocomplete-grid"
      >
        {/* Left Column: Interactive Search Arena */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Glassmorphic Search Sandbox Card */}
          <div
            style={{
              ...S.card,
              background: 'rgba(15, 15, 25, 0.5)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              padding: '28px',
              marginBottom: 0,
            }}
          >
            <div style={{ ...S.cardTitle, fontSize: '16px', marginBottom: '8px' }}>
              <Sparkles size={16} color={C.cyan} /> Live Prefix Sandbox
            </div>
            <p style={{ ...S.cardText, fontSize: '13px', marginBottom: '24px', color: '#94a3b8' }}>
              Type a campus prefix (e.g. <strong style={{ color: '#f1f5f9' }}>"notes"</strong>, <strong style={{ color: '#f1f5f9' }}>"hostel"</strong>, <strong style={{ color: '#f1f5f9' }}>"pla"</strong>). Keystrokes match character nodes instantly.
            </p>

            <SearchBar
              onSelectSuggestion={handleSelect}
              autoFocus
              showAlgorithmInfo={false}
              initialQuery={initialQuery}
            />
          </div>

          {/* Active selection feedback */}
          <AnimatePresence mode="wait">
            {selectedWord && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                style={{
                  ...S.card,
                  border: `1px solid ${C.cyan}30`,
                  background: `rgba(0, 212, 170, 0.04)`,
                  padding: '20px 24px',
                  marginBottom: 0,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                  <Zap size={14} color={C.cyan} />
                  <span style={{ fontSize: '11px', color: C.cyan, textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em' }}>Selected Result</span>
                </div>
                <div style={{ fontSize: '20px', fontWeight: 700, color: '#f1f5f9', fontFamily: 'Syne, sans-serif' }}>
                  {selectedWord}
                </div>
                <p style={{ fontSize: '12px', color: '#64748b', marginTop: '6px', margin: '6px 0 0 0' }}>
                  Uniquely recorded and incremented inside the Trie database index.
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Symmetrical Search Activity Feed */}
          <div style={{ ...S.card, padding: '24px 28px', marginBottom: 0 }}>
            <div style={{ ...S.cardTitle, fontSize: '14px', color: '#f1f5f9', marginBottom: '16px' }}>
              <Clock size={14} color={C.purple} /> Session Search Stream
            </div>

            {searchesList.length === 0 ? (
              <div
                style={{
                  border: '1px dashed rgba(255, 255, 255, 0.08)',
                  borderRadius: '16px',
                  padding: '32px 20px',
                  textAlign: 'center',
                }}
              >
                <code style={{ fontSize: '11px', color: C.blue, padding: '2px 8px', background: `${C.blue}12`, borderRadius: '6px', display: 'inline-block', marginBottom: '10px' }}>
                  listening for query selection...
                </code>
                <p style={{ fontSize: '12px', color: '#475569', margin: 0, lineHeight: 1.5 }}>
                  Select suggestions from the sandbox dropdown above to stream live cache listings.
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <AnimatePresence>
                  {searchesList.map((item, idx) => {
                    const catColor = getCategoryColor(item.category);
                    return (
                      <motion.div
                        key={item.word}
                        initial={{ opacity: 0, x: -15 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 15 }}
                        transition={{ duration: 0.2 }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '12px 16px',
                          background: 'rgba(255, 255, 255, 0.02)',
                          border: '1px solid rgba(255, 255, 255, 0.06)',
                          borderLeft: `3px solid ${catColor || C.cyan}`,
                          borderRadius: '12px',
                        }}
                      >
                        <div>
                          <div style={{ fontSize: '13px', fontWeight: 600, color: '#e2e8f0' }}>{item.word}</div>
                          <div style={{ fontSize: '10px', color: '#64748b', textTransform: 'capitalize', marginTop: '2px' }}>{item.category}</div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '10px', fontFamily: 'JetBrains Mono, monospace', color: '#475569' }}>{item.time}</span>
                          <CheckCircle2 size={12} color={C.cyan} />
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Dynamic Developer Console Tabs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Tab Selector Widget */}
          <div
            style={{
              ...S.card,
              padding: '6px',
              borderRadius: '14px',
              background: 'rgba(15, 15, 25, 0.8)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '4px',
              marginBottom: 0,
            }}
          >
            {[
              { id: 'how-it-works', label: '🌳 Trie Blueprint' },
              { id: 'stats', label: '📊 System Stats' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: '8px',
                  borderRadius: '10px',
                  border: 'none',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  color: activeTab === tab.id ? '#f1f5f9' : '#64748b',
                  background: activeTab === tab.id ? 'rgba(255,255,255,0.06)' : 'transparent',
                  transition: 'all 0.2s',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Interactive Tab Content panels */}
          <AnimatePresence mode="wait">
            {activeTab === 'how-it-works' ? (
              <motion.div
                key="how-it-works-panel"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.15 }}
                style={{ ...S.card, marginBottom: 0, minHeight: '340px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
              >
                <div>
                  <div style={S.cardTitle}>
                    <Cpu size={14} color={C.blue} /> Prefix Tree Mechanics
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {[
                      <>Enter character nodes sequentially: <code style={{ color: C.blue }}>root → T → R → I → E</code>.</>,
                      <>Traverses characters in <strong style={{ color: '#e2e8f0' }}>O(L)</strong> depth complexity.</>,
                      <>Deep DFS traversal extracts children words.</>,
                      <>Results ranked by live scoring MaxHeap structures.</>,
                      <>Instantly returns the top 8 matches.</>
                    ].map((step, idx) => (
                      <div key={idx} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                        <span
                          style={{
                            width: '18px',
                            height: '18px',
                            borderRadius: '50%',
                            background: `${C.blue}15`,
                            color: C.blue,
                            fontSize: '10px',
                            fontWeight: 700,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                            marginTop: '2px',
                          }}
                        >
                          {idx + 1}
                        </span>
                        <p style={{ ...S.cardText, margin: 0, fontSize: '12px' }}>{step}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div
                  style={{
                    display: 'flex',
                    gap: '8px',
                    marginTop: '24px',
                    borderTop: '1px solid rgba(255,255,255,0.06)',
                    paddingTop: '16px',
                  }}
                >
                  <ComplexityBadge type="time" value="O(L + K)" color="blue" />
                  <ComplexityBadge type="space" value="O(N×L)" color="purple" />
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="stats-panel"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.15 }}
                style={{ ...S.card, marginBottom: 0, minHeight: '340px', display: 'flex', flexDirection: 'column', gap: '20px' }}
              >
                <div>
                  <div style={S.cardTitle}>
                    <TerminalIcon size={14} color={C.cyan} /> Keystroke Operations
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {operations.map((item) => (
                      <div key={item.ds} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px' }}>
                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: item.color, flexShrink: 0 }} />
                        <span style={{ color: '#64748b', width: '64px', flexShrink: 0, fontSize: '11px', fontWeight: 600 }}>{item.ds}</span>
                        <span style={{ fontFamily: 'JetBrains Mono, monospace', color: '#475569', flex: 1, fontSize: '10px' }}>{item.op}</span>
                        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', padding: '1px 6px', borderRadius: '4px', background: `${item.color}14`, color: item.color, border: `1px solid ${item.color}25`, flexShrink: 0 }}>
                          {item.complexity}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: '10px',
                    borderTop: '1px solid rgba(255,255,255,0.06)',
                    paddingTop: '16px',
                  }}
                >
                  {statCards.map((stat) => (
                    <div
                      key={stat.label}
                      style={{
                        padding: '10px 12px',
                        borderRadius: '10px',
                        background: 'rgba(255, 255, 255, 0.01)',
                        border: '1px solid rgba(255, 255, 255, 0.03)',
                      }}
                    >
                      <div style={{ fontSize: '9px', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{stat.label}</div>
                      <div style={{ fontSize: '16px', fontWeight: 700, fontFamily: 'JetBrains Mono, monospace', color: stat.color, marginTop: '4px' }}>{stat.value}</div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* About Box - Compact Info Footer */}
          <div style={{ ...S.infoBox, margin: 0, padding: '20px' }}>
            <div style={{ ...S.cardTitle, fontSize: '13px', marginBottom: '8px' }}>
              <BookOpen size={13} color={C.blue} /> Symmetrical Index Evictions
            </div>
            <p style={{ ...S.cardText, fontSize: '11px', lineHeight: 1.6, margin: 0, color: '#64748b' }}>
              When prefix queries return empty sets, Levenshtein fuzzy distance evaluates individual tokens dynamically to calculate suggestions with O(m×n) matrix visualization.
            </p>
          </div>
        </div>
      </div>

      {/* Responsive styles */}
      <style>{`
        @media (max-width: 1024px) {
          .autocomplete-grid {
            grid-template-columns: 1fr !important;
            gap: 20px !important;
          }
        }
      `}</style>
    </motion.div>
  );
};

export default AutocompletePage;
