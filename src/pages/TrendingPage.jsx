import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Plus, Flame, BookOpen, ArrowUp } from 'lucide-react';
import { useSearch } from '../context/SearchContext';
import ComplexityBadge from '../components/ComplexityBadge';
import { S, C } from '../styles';

const TrendingPage = () => {
  const { heap, performSearch } = useSearch();
  const [simulateInput, setSimulateInput] = useState('');
  const [heapArray, setHeapArray] = useState(() =>
    heap?.current ? heap.current.getRawHeap() : []
  );
  const [swapIndices, setSwapIndices] = useState([]);

  const refreshHeap = useCallback(() => {
    if (heap?.current) setHeapArray(heap.current.getRawHeap());
  }, [heap]);

  const handleSimulateSearch = () => {
    const word = simulateInput.trim();
    if (!word) return;
    performSearch(word);
    refreshHeap();
    setSimulateInput('');
    if (heap?.current) {
      const idx = heap.current.indexMap[word];
      if (idx !== undefined) {
        setSwapIndices([idx]);
        setTimeout(() => setSwapIndices([]), 1000);
      }
    }
  };

  const getTreeLevels = () => {
    const arr = heapArray;
    if (arr.length === 0) return [];
    const levels = [];
    let i = 0, levelSize = 1;
    while (i < arr.length) {
      const level = [];
      for (let j = 0; j < levelSize && i < arr.length; j++, i++) {
        level.push({ ...arr[i], index: i });
      }
      levels.push(level);
      levelSize *= 2;
    }
    return levels;
  };

  const treeLevels = getTreeLevels();
  const topItems = [...heapArray].sort((a, b) => b.score - a.score).slice(0, 10);

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
        <div style={S.iconBadge(C.red)}>
          <TrendingUp size={26} color={C.red} />
        </div>
        <h1 style={S.pageTitle}>Trending Engine</h1>
        <p style={S.pageSubtitle}>MaxHeap-powered real-time trending keyword tracking</p>
      </div>

      {/* Simulate Search */}
      <div style={S.card}>
        <div style={S.cardTitle}>Simulate Search Event</div>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <input
            type="text"
            value={simulateInput}
            onChange={(e) => setSimulateInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSimulateSearch()}
            placeholder="Type a keyword to simulate a search..."
            style={S.input}
          />
          <button onClick={handleSimulateSearch} style={S.btnSecondary(C.amber)}>
            <Plus size={14} /> Add Search
          </button>
        </div>
        <p style={{ ...S.muted, marginTop: '10px' }}>
          Each search → updates heap score → re-heapifies → O(log N) bubble-up
        </p>
      </div>

      {/* Heap Tree Visualization */}
      <div style={S.card}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
          <span style={S.sectionTitle}>MaxHeap Tree Visualization</span>
          <ComplexityBadge type="time" value="O(log N) insert" color="amber" />
        </div>

        {treeLevels.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#475569', padding: '32px 0', fontSize: '14px' }}>
            Heap is empty. Simulate searches to populate.
          </p>
        ) : (
          <div style={{ overflowX: 'auto', paddingBottom: '8px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', minWidth: 'max-content' }}>
              {treeLevels.map((level, levelIdx) => (
                <div key={levelIdx} style={{ display: 'flex', justifyContent: 'center', gap: `${Math.max(8, 60 / (levelIdx + 1))}px` }}>
                  {level.map((item) => (
                    <motion.div
                      key={item.index}
                      layout
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: swapIndices.includes(item.index) ? 1.15 : 1, opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      style={{
                        minWidth: '90px',
                        padding: '10px 14px',
                        borderRadius: '14px',
                        background: item.index === 0 ? `rgba(245,158,11,0.08)` : 'rgba(255,255,255,0.04)',
                        border: `1px solid ${item.index === 0 ? 'rgba(245,158,11,0.4)' : 'rgba(255,255,255,0.1)'}`,
                        textAlign: 'center',
                        position: 'relative',
                        boxShadow: swapIndices.includes(item.index) ? '0 0 20px rgba(79,142,247,0.3)' : 'none',
                      }}
                    >
                      {item.index === 0 && (
                        <div style={{ position: 'absolute', top: '-10px', right: '-8px', fontSize: '9px', background: 'rgba(245,158,11,0.2)', color: C.amber, padding: '2px 6px', borderRadius: '999px', fontFamily: 'JetBrains Mono, monospace' }}>MAX</div>
                      )}
                      <div style={{ fontSize: '12px', fontWeight: 600, color: '#f1f5f9', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '80px' }}>{item.word}</div>
                      <div style={{ fontSize: '11px', fontFamily: 'JetBrains Mono, monospace', color: C.amber, marginTop: '2px' }}>{item.score}</div>
                    </motion.div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Heap Array */}
      <div style={S.card}>
        <div style={S.cardTitle}>Heap Array Representation</div>
        <div style={{ overflowX: 'auto' }}>
          <div style={{ display: 'flex', gap: '8px', minWidth: 'max-content' }}>
            {heapArray.slice(0, 15).map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                style={{
                  textAlign: 'center',
                  padding: '10px 12px',
                  borderRadius: '10px',
                  border: `1px solid ${i === 0 ? 'rgba(245,158,11,0.4)' : 'rgba(255,255,255,0.1)'}`,
                  background: i === 0 ? 'rgba(245,158,11,0.06)' : 'rgba(255,255,255,0.02)',
                  minWidth: '70px',
                }}
              >
                <div style={{ fontSize: '9px', fontFamily: 'JetBrains Mono, monospace', color: '#475569', marginBottom: '4px' }}>i={i}</div>
                <div style={{ fontSize: '11px', color: '#f1f5f9', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '60px' }}>{item.word}</div>
                <div style={{ fontSize: '11px', fontFamily: 'JetBrains Mono, monospace', color: C.amber }}>{item.score}</div>
              </motion.div>
            ))}
          </div>
        </div>
        <div style={{ ...S.muted, marginTop: '12px', fontFamily: 'JetBrains Mono, monospace', fontSize: '11px' }}>
          Parent(i) = ⌊(i-1)/2⌋ &nbsp;|&nbsp; Left(i) = 2i+1 &nbsp;|&nbsp; Right(i) = 2i+2
        </div>
      </div>

      {/* Trending Keywords */}
      <div style={S.card}>
        <div style={S.cardTitle}><Flame size={14} color={C.amber} /> Top Trending Keywords</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {topItems.slice(0, 8).map((item, i) => (
            <motion.div
              key={item.word}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 14px', borderRadius: '12px', background: 'rgba(255,255,255,0.02)' }}
            >
              <span style={{ fontSize: '13px', fontWeight: 700, width: '36px', color: i < 3 ? C.amber : '#475569' }}>
                {i < 3 ? '🔥' : ''} #{i + 1}
              </span>
              <span style={{ fontSize: '14px', color: '#f1f5f9', fontWeight: 500, flex: 1 }}>{item.word}</span>
              <span style={{ fontSize: '14px', fontFamily: 'JetBrains Mono, monospace', color: C.amber, fontWeight: 700 }}>{item.score}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '2px', color: C.cyan, fontSize: '11px' }}>
                <ArrowUp size={10} />+{((i * 7 + 13) % 15) + 1}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* How It Works */}
      <div style={S.grid2}>
        <div style={{ ...S.card, marginBottom: 0 }}>
          <div style={S.cardTitle}>⚙️ Heap Operations</div>
          {[
            ['insert()', 'Add item, heapifyUp from last index. O(log N)'],
            ['extractMax()', 'Remove root, swap with last, heapifyDown. O(log N)'],
            ['heapifyUp(i)', 'Compare with parent, swap if larger. Repeat.'],
            ['heapifyDown(i)', 'Compare with children, swap with larger. Repeat.'],
            ['updateScore()', 'Find by indexMap, adjust, re-heapify. O(log N)'],
          ].map(([fn, desc]) => (
            <p key={fn} style={S.cardText}>
              <span style={S.mono(C.amber)}>{fn}</span> — {desc}
            </p>
          ))}
        </div>
        <div style={{ ...S.card, marginBottom: 0 }}>
          <div style={S.cardTitle}>📊 Scoring Formula</div>
          {[
            'Score = Base Frequency + Search Count Increments',
            <>Each search adds <span style={S.mono(C.cyan)}>+1</span> to the word&apos;s heap score</>,
            <>Each selection adds <span style={S.mono(C.cyan)}>+2</span> (clicked result)</>,
            'Heap property: parent.score ≥ children.score (MaxHeap)',
            'Root always holds the highest-scoring keyword',
          ].map((t, i) => <p key={i} style={S.cardText}>{t}</p>)}
        </div>
      </div>

      {/* About */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} style={S.infoBox}>
        <div style={S.cardTitle}><BookOpen size={14} /> 📚 About This Feature</div>
        <p style={S.cardText}>
          This page demonstrates the <strong style={{ color: C.white }}>MaxHeap (Binary Heap)</strong> data structure for maintaining
          a live &quot;trending&quot; ranking. The heap ensures the highest-scoring keyword is always at the root, with O(log N)
          operations for insertion and score updates. The index map provides O(1) lookup by word.
        </p>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '12px' }}>
          <ComplexityBadge type="time" value="O(log N) insert" color="amber" />
          <ComplexityBadge type="time" value="O(log N) extract" color="blue" />
          <ComplexityBadge type="time" value="O(1) peek" color="cyan" />
          <ComplexityBadge type="space" value="O(N)" color="purple" />
        </div>
        <p style={{ ...S.muted, marginTop: '8px' }}>Real-world use: Priority queues, OS task scheduling, Dijkstra&apos;s, Twitter trending</p>
      </motion.div>
    </motion.div>
  );
};

export default TrendingPage;
