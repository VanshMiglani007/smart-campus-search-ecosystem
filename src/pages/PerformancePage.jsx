import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Gauge, Play, BookOpen, Zap } from 'lucide-react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Trie } from '../algorithms/Trie';
import campusData from '../data/campusData';
import ComplexityBadge from '../components/ComplexityBadge';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Generate extra words for scaling
function generateDataset(size) {
  const words = campusData.map((d) => d.word);
  const alphabet = 'abcdefghijklmnopqrstuvwxyz';
  while (words.length < size) {
    let w = '';
    const len = 4 + Math.floor(Math.random() * 8);
    for (let i = 0; i < len; i++) {
      w += alphabet[Math.floor(Math.random() * 26)];
    }
    words.push(w);
  }
  return words.slice(0, size);
}

// Linear search implementation
function linearSearch(dataset, prefix) {
  let operations = 0;
  const results = [];
  const lowerPrefix = prefix.toLowerCase();

  for (const word of dataset) {
    operations++;
    if (word.toLowerCase().startsWith(lowerPrefix)) {
      results.push(word);
    }
  }

  return { results, operations };
}

const PerformancePage = () => {
  const [datasetSize, setDatasetSize] = useState(200);
  const [queryInput, setQueryInput] = useState('da');
  const [results, setResults] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [isRunning, setIsRunning] = useState(false);

  const runComparison = useCallback(() => {
    setIsRunning(true);

    // Use setTimeout to let UI update first
    setTimeout(() => {
      const dataset = generateDataset(datasetSize);

      // Build Trie
      const trie = new Trie();
      dataset.forEach((w) => trie.insert(w, 'test', 1));

      const prefix = queryInput.trim() || 'da';

      // ── Linear Search ──
      const linearStart = performance.now();
      const linearResult = linearSearch(dataset, prefix);
      const linearTime = performance.now() - linearStart;

      // ── Trie Search ──
      const trieStart = performance.now();
      const trieSuggestions = trie.getSuggestions(prefix, 100);
      const trieTime = performance.now() - trieStart;

      const trieNodesTraversed = trieSuggestions._nodesTraversed || prefix.length;
      const speedup = linearTime > 0 ? (linearTime / Math.max(trieTime, 0.001)).toFixed(1) : '∞';

      setResults({
        linear: {
          time: linearTime,
          operations: linearResult.operations,
          results: linearResult.results.length,
        },
        trie: {
          time: trieTime,
          operations: trieNodesTraversed,
          results: trieSuggestions.length,
        },
        speedup,
        datasetSize,
        prefix,
      });

      // ── Run multiple queries for chart ──
      const prefixes = ['d', 'da', 'daa', 'data', 'datab'];
      const linearTimes = [];
      const trieTimes = [];

      for (const p of prefixes) {
        const lStart = performance.now();
        linearSearch(dataset, p);
        linearTimes.push(performance.now() - lStart);

        const tStart = performance.now();
        trie.getSuggestions(p, 100);
        trieTimes.push(performance.now() - tStart);
      }

      setChartData({
        labels: prefixes.map((p) => `"${p}" (L=${p.length})`),
        datasets: [
          {
            label: 'Linear Search O(N)',
            data: linearTimes.map((t) => parseFloat(t.toFixed(3))),
            backgroundColor: 'rgba(239, 68, 68, 0.6)',
            borderColor: 'rgba(239, 68, 68, 1)',
            borderWidth: 1,
            borderRadius: 6,
          },
          {
            label: 'Trie Search O(L)',
            data: trieTimes.map((t) => parseFloat(t.toFixed(3))),
            backgroundColor: 'rgba(0, 212, 170, 0.6)',
            borderColor: 'rgba(0, 212, 170, 1)',
            borderWidth: 1,
            borderRadius: 6,
          },
        ],
      });

      setIsRunning(false);
    }, 50);
  }, [datasetSize, queryInput]);

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: { color: '#94a3b8', font: { family: "'JetBrains Mono', monospace", size: 11 } },
      },
      title: {
        display: true,
        text: `Time Comparison Across Query Lengths (Dataset: ${datasetSize} words)`,
        color: '#f1f5f9',
        font: { family: "'Space Grotesk', sans-serif", size: 14 },
      },
      tooltip: {
        callbacks: {
          label: (ctx) => `${ctx.dataset.label}: ${ctx.parsed.y}ms`,
        },
      },
    },
    scales: {
      x: {
        ticks: { color: '#94a3b8', font: { family: "'JetBrains Mono', monospace", size: 10 } },
        grid: { color: 'rgba(255,255,255,0.03)' },
      },
      y: {
        ticks: {
          color: '#94a3b8',
          font: { family: "'JetBrains Mono', monospace", size: 10 },
          callback: (v) => `${v}ms`,
        },
        grid: { color: 'rgba(255,255,255,0.05)' },
      },
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen pt-28 pb-16 px-6"
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-accent-purple/10 flex items-center justify-center mx-auto mb-4">
            <Gauge size={28} className="text-accent-purple" />
          </div>
          <h1 className="text-3xl font-bold gradient-text mb-2">Performance Comparison</h1>
          <p className="text-text-secondary text-sm">Linear Search O(N) vs Trie Search O(L) — measured live</p>
        </div>

        {/* Controls */}
        <div className="glass-card p-5 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
            <div>
              <label className="text-xs text-text-muted uppercase tracking-wider mb-2 block">
                Dataset Size: <span className="text-accent-blue font-mono">{datasetSize}</span>
              </label>
              <input
                type="range"
                min="10"
                max="1000"
                step="10"
                value={datasetSize}
                onChange={(e) => setDatasetSize(parseInt(e.target.value))}
                className="w-full accent-accent-blue"
              />
              <div className="flex justify-between text-[10px] text-text-muted mt-1">
                <span>10</span>
                <span>500</span>
                <span>1000</span>
              </div>
            </div>
            <div>
              <label className="text-xs text-text-muted uppercase tracking-wider mb-2 block">
                Query Prefix
              </label>
              <input
                type="text"
                value={queryInput}
                onChange={(e) => setQueryInput(e.target.value)}
                placeholder="e.g. da"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-text-primary outline-none focus:border-accent-purple/50 transition-colors"
              />
            </div>
            <button
              onClick={runComparison}
              disabled={isRunning}
              className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-accent-blue to-accent-purple text-white text-sm font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Play size={16} />
              {isRunning ? 'Running...' : 'Run Comparison'}
            </button>
          </div>
        </div>

        {/* Results */}
        {results && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {/* Linear Search Result */}
              <div className="glass-card p-5 border-l-2" style={{ borderLeftColor: '#ef4444' }}>
                <h3 className="text-sm font-bold text-red-400 mb-3">LINEAR SEARCH</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-text-muted">Time:</span>
                    <span className="font-mono text-red-400">{results.linear.time.toFixed(3)}ms</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-text-muted">Operations:</span>
                    <span className="font-mono text-text-primary">{results.linear.operations}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-text-muted">Results:</span>
                    <span className="font-mono text-text-primary">{results.linear.results}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-text-muted">Complexity:</span>
                    <ComplexityBadge type="time" value="O(N)" color="purple" />
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-text-muted">Memory:</span>
                    <ComplexityBadge type="space" value="O(1)" color="blue" />
                  </div>
                  {/* Progress bar */}
                  <div className="mt-2 h-2 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-red-500 transition-all duration-500"
                      style={{
                        width: `${Math.min(100, (results.linear.time / Math.max(results.linear.time, results.trie.time)) * 100)}%`,
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Trie Search Result */}
              <div className="glass-card p-5 border-l-2" style={{ borderLeftColor: '#00d4aa' }}>
                <h3 className="text-sm font-bold text-accent-cyan mb-3">TRIE SEARCH</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-text-muted">Time:</span>
                    <span className="font-mono text-accent-cyan">{results.trie.time.toFixed(3)}ms</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-text-muted">Operations:</span>
                    <span className="font-mono text-text-primary">{results.trie.operations}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-text-muted">Results:</span>
                    <span className="font-mono text-text-primary">{results.trie.results}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-text-muted">Complexity:</span>
                    <ComplexityBadge type="time" value="O(L)" color="cyan" />
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-text-muted">Memory:</span>
                    <ComplexityBadge type="space" value="O(N×L)" color="purple" />
                  </div>
                  {/* Progress bar */}
                  <div className="mt-2 h-2 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-accent-cyan transition-all duration-500"
                      style={{
                        width: `${Math.min(100, (results.trie.time / Math.max(results.linear.time, results.trie.time)) * 100)}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Speedup Banner */}
            <div className="glass-card p-4 text-center">
              <span className="text-sm text-text-secondary">
                Trie is{' '}
                <span className="text-2xl font-bold gradient-text mx-1">{results.speedup}×</span>
                {' '}faster for prefix &quot;{results.prefix}&quot; on {results.datasetSize} words
              </span>
            </div>
          </motion.div>
        )}

        {/* Chart */}
        {chartData && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-5 mb-6"
          >
            <Bar data={chartData} options={chartOptions} />
          </motion.div>
        )}

        {/* Explanation Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-5 mb-6"
        >
          <h3 className="text-sm font-semibold text-text-primary mb-3 flex items-center gap-2">
            <Zap size={14} className="text-warning" />
            Why Trie Wins
          </h3>
          <div className="space-y-3 text-xs text-text-secondary leading-relaxed">
            <p>
              <strong className="text-red-400">Linear Search</strong> must check every word in the dataset →
              <span className="font-mono text-red-400"> O(N)</span> where N = dataset size.
              As the dataset grows from 100 → 1000 words, time grows proportionally.
            </p>
            <p>
              <strong className="text-accent-cyan">Trie Search</strong> navigates directly to the prefix node →
              <span className="font-mono text-accent-cyan"> O(L)</span> where L = query length.
              Whether dataset has 100 or 1,000,000 words, prefix lookup time stays the same!
            </p>
            <p className="text-text-muted">
              Trade-off: Trie uses more memory <span className="font-mono">O(N × L)</span> to store the tree structure,
              while linear search uses only <span className="font-mono">O(1)</span> extra memory.
              For search-heavy applications, the speed benefit far outweighs the memory cost.
            </p>
          </div>
        </motion.div>

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
            This page demonstrates the <strong className="text-text-primary">empirical comparison</strong> between
            linear search and Trie-based search. The comparison uses <code className="text-accent-blue">performance.now()</code> for
            high-resolution timing and counts actual operations performed.
          </p>
          <div className="flex flex-wrap gap-2 mt-3">
            <ComplexityBadge type="time" value="O(N) Linear" color="purple" />
            <ComplexityBadge type="time" value="O(L) Trie" color="cyan" />
          </div>
          <p className="text-[10px] text-text-muted mt-2">
            Real-world use: Comparing algorithm efficiency is fundamental in DSA — this page proves why Trie is optimal for prefix search
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default PerformancePage;
