import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Plus, Flame, BookOpen, ArrowUp } from 'lucide-react';
import { useSearch } from '../context/SearchContext';
import ComplexityBadge from '../components/ComplexityBadge';

const TrendingPage = () => {
  const { heap, performSearch } = useSearch();
  const [simulateInput, setSimulateInput] = useState('');
  const [heapArray, setHeapArray] = useState(() => {
    return heap?.current ? heap.current.getRawHeap() : [];
  });
  const [swapIndices, setSwapIndices] = useState([]);

  const refreshHeap = useCallback(() => {
    if (heap?.current) {
      setHeapArray(heap.current.getRawHeap());
    }
  }, [heap]);

  const handleSimulateSearch = () => {
    const word = simulateInput.trim();
    if (!word) return;

    performSearch(word);
    refreshHeap();
    setSimulateInput('');

    // Brief highlight animation
    if (heap?.current) {
      const idx = heap.current.indexMap[word];
      if (idx !== undefined) {
        setSwapIndices([idx]);
        setTimeout(() => setSwapIndices([]), 1000);
      }
    }
  };

  // Build tree visualization levels from the heap array state
  const getTreeLevels = () => {
    const arr = heapArray;
    if (arr.length === 0) return [];

    const levels = [];
    let i = 0;
    let levelSize = 1;

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
  const currentHeap = heapArray;
  const topItems = [...heapArray].sort((a, b) => b.score - a.score).slice(0, 10);

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
          <div className="w-14 h-14 rounded-2xl bg-red-500/10 flex items-center justify-center mx-auto mb-4">
            <TrendingUp size={28} className="text-red-500" />
          </div>
          <h1 className="text-3xl font-bold gradient-text mb-2">Trending Engine</h1>
          <p className="text-text-secondary text-sm">MaxHeap-powered real-time trending keyword tracking</p>
        </div>

        {/* Simulate Search Controls */}
        <div className="glass-card p-5 mb-6">
          <h3 className="text-sm font-semibold text-text-primary mb-3">Simulate Search Event</h3>
          <div className="flex gap-2">
            <input
              type="text"
              value={simulateInput}
              onChange={(e) => setSimulateInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSimulateSearch()}
              placeholder="Type a keyword to simulate a search..."
              className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-text-primary outline-none focus:border-warning/50 transition-colors"
            />
            <button
              onClick={handleSimulateSearch}
              className="px-4 py-2.5 rounded-lg bg-warning/20 text-warning text-sm font-medium hover:bg-warning/30 transition-colors flex items-center gap-1.5"
            >
              <Plus size={14} /> Add Search
            </button>
          </div>
          <p className="text-[10px] text-text-muted mt-2">
            Each simulated search → updates heap score → re-heapifies → triggers O(log N) bubble-up
          </p>
        </div>

        {/* Heap Tree Visualization */}
        <div className="glass-card p-6 mb-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-sm font-semibold text-text-primary">MaxHeap Tree Visualization</h3>
            <ComplexityBadge type="time" value="O(log N) insert" color="amber" />
          </div>

          {treeLevels.length === 0 ? (
            <p className="text-center text-text-muted py-8 text-sm">Heap is empty. Simulate searches to populate.</p>
          ) : (
            <div className="space-y-4 overflow-x-auto pb-2">
              {treeLevels.map((level, levelIdx) => (
                <div key={levelIdx} className="flex justify-center gap-3" style={{ gap: `${Math.max(8, 64 / (levelIdx + 1))}px` }}>
                  {level.map((item) => (
                    <motion.div
                      key={item.index}
                      layout
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{
                        scale: swapIndices.includes(item.index) ? 1.15 : 1,
                        opacity: 1,
                      }}
                      transition={{ duration: 0.3 }}
                      className={`
                        glass-card px-3 py-2 min-w-[90px] text-center relative
                        ${item.index === 0 ? 'border-warning/40' : 'border-white/10'}
                        ${swapIndices.includes(item.index) ? 'glow-blue' : ''}
                      `}
                      style={{
                        borderColor: item.index === 0 ? 'rgba(245,158,11,0.4)' : undefined,
                      }}
                    >
                      {item.index === 0 && (
                        <div className="absolute -top-2 -right-2 text-[9px] bg-warning/20 text-warning px-1.5 py-0.5 rounded-full font-mono">
                          MAX
                        </div>
                      )}
                      <div className="text-xs font-medium text-text-primary truncate max-w-[80px]">
                        {item.word}
                      </div>
                      <div className="text-[10px] font-mono text-warning mt-0.5">
                        {item.score}
                      </div>
                    </motion.div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Heap Array Representation */}
        <div className="glass-card p-5 mb-6">
          <h3 className="text-sm font-semibold text-text-primary mb-3">Heap Array Representation</h3>
          <div className="overflow-x-auto">
            <div className="flex gap-1 min-w-max">
              {currentHeap.slice(0, 15).map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className={`text-center px-3 py-2 rounded-lg border ${
                    i === 0 ? 'border-warning/40 bg-warning/5' : 'border-white/10 bg-white/3'
                  }`}
                >
                  <div className="text-[9px] font-mono text-text-muted mb-0.5">i={i}</div>
                  <div className="text-[10px] text-text-primary font-medium truncate max-w-[60px]">{item.word}</div>
                  <div className="text-[10px] font-mono text-warning">{item.score}</div>
                </motion.div>
              ))}
            </div>
            {currentHeap.length > 15 && (
              <p className="text-[10px] text-text-muted mt-2">...and {currentHeap.length - 15} more items</p>
            )}
          </div>
          <div className="mt-3 text-[10px] text-text-muted font-mono">
            Parent(i) = ⌊(i-1)/2⌋ &nbsp;|&nbsp; Left(i) = 2i+1 &nbsp;|&nbsp; Right(i) = 2i+2
          </div>
        </div>

        {/* Trending Cards */}
        <div className="glass-card p-5 mb-6">
          <h3 className="text-sm font-semibold text-text-primary mb-4 flex items-center gap-2">
            <Flame size={14} className="text-warning" />
            Top Trending Keywords
          </h3>
          <div className="space-y-2">
            {topItems.slice(0, 8).map((item, i) => (
              <motion.div
                key={item.word}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/3 transition-colors"
              >
                <span className={`text-sm font-bold w-8 ${i < 3 ? 'text-warning' : 'text-text-muted'}`}>
                  {i < 3 ? '🔥' : ''} #{i + 1}
                </span>
                <span className="text-sm text-text-primary flex-1 font-medium">{item.word}</span>
                <span className="text-sm font-mono text-warning font-bold">{item.score}</span>
                <div className="flex items-center gap-0.5 text-accent-cyan text-[10px]">
                  <ArrowUp size={10} />
                  <span>+{((i * 7 + 13) % 15) + 1}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* How It Works */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="glass-card p-5">
            <h3 className="text-sm font-semibold text-text-primary mb-3">⚙️ Heap Operations</h3>
            <div className="space-y-2 text-xs text-text-secondary">
              <p><span className="font-mono text-warning">insert()</span> — Add item, heapifyUp from last index. O(log N)</p>
              <p><span className="font-mono text-warning">extractMax()</span> — Remove root, swap with last, heapifyDown. O(log N)</p>
              <p><span className="font-mono text-warning">heapifyUp(i)</span> — Compare with parent, swap if larger. Repeat.</p>
              <p><span className="font-mono text-warning">heapifyDown(i)</span> — Compare with children, swap with larger. Repeat.</p>
              <p><span className="font-mono text-warning">updateScore()</span> — Find by indexMap, adjust, re-heapify. O(log N)</p>
            </div>
          </div>

          <div className="glass-card p-5">
            <h3 className="text-sm font-semibold text-text-primary mb-3">📊 Scoring Formula</h3>
            <div className="space-y-2 text-xs text-text-secondary">
              <p>Score = Base Frequency + Search Count Increments</p>
              <p>Each search adds <span className="font-mono text-accent-cyan">+1</span> to the word&apos;s heap score</p>
              <p>Each selection adds <span className="font-mono text-accent-cyan">+2</span> (clicked result)</p>
              <p>Heap property: parent.score ≥ children.score (MaxHeap)</p>
              <p>Root always holds the highest-scoring keyword</p>
            </div>
          </div>
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
            This page demonstrates the <strong className="text-text-primary">MaxHeap (Binary Heap)</strong> data structure
            used for maintaining a live &quot;trending&quot; ranking. The heap ensures the highest-scoring keyword is always
            at the root (index 0), with O(log N) operations for insertion and score updates.
            The index map provides O(1) lookup by word.
          </p>
          <div className="flex flex-wrap gap-2 mt-3">
            <ComplexityBadge type="time" value="O(log N) insert" color="amber" />
            <ComplexityBadge type="time" value="O(log N) extract" color="blue" />
            <ComplexityBadge type="time" value="O(1) peek" color="cyan" />
            <ComplexityBadge type="space" value="O(N)" color="purple" />
          </div>
          <p className="text-[10px] text-text-muted mt-2">
            Real-world use: Priority queues, OS task scheduling, Dijkstra&apos;s algorithm, Twitter trending topics
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default TrendingPage;
