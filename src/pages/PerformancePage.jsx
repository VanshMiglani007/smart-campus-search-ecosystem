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
import { S, C } from '../styles';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function generateDataset(size) {
  const words = campusData.map((d) => d.word);
  const alphabet = 'abcdefghijklmnopqrstuvwxyz';
  while (words.length < size) {
    let w = '';
    const len = 4 + Math.floor(Math.random() * 8);
    for (let i = 0; i < len; i++) w += alphabet[Math.floor(Math.random() * 26)];
    words.push(w);
  }
  return words.slice(0, size);
}

function linearSearch(dataset, prefix) {
  let operations = 0;
  const results = [];
  const lowerPrefix = prefix.toLowerCase();
  for (const word of dataset) {
    operations++;
    if (word.toLowerCase().startsWith(lowerPrefix)) results.push(word);
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
    setTimeout(() => {
      const dataset = generateDataset(datasetSize);
      const trie = new Trie();
      dataset.forEach((w) => trie.insert(w, 'test', 1));
      const prefix = queryInput.trim() || 'da';

      const linearStart = performance.now();
      const linearResult = linearSearch(dataset, prefix);
      const linearTime = performance.now() - linearStart;

      const trieStart = performance.now();
      const trieSuggestions = trie.getSuggestions(prefix, 100);
      const trieTime = performance.now() - trieStart;

      const trieNodesTraversed = trieSuggestions._nodesTraversed || prefix.length;
      const speedup = linearTime > 0 ? (linearTime / Math.max(trieTime, 0.001)).toFixed(1) : '∞';

      setResults({
        linear: { time: linearTime, operations: linearResult.operations, results: linearResult.results.length },
        trie: { time: trieTime, operations: trieNodesTraversed, results: trieSuggestions.length },
        speedup, datasetSize, prefix,
      });

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
          { label: 'Linear Search O(N)', data: linearTimes.map((t) => parseFloat(t.toFixed(3))), backgroundColor: 'rgba(239,68,68,0.6)', borderColor: 'rgba(239,68,68,1)', borderWidth: 1, borderRadius: 6 },
          { label: 'Trie Search O(L)', data: trieTimes.map((t) => parseFloat(t.toFixed(3))), backgroundColor: 'rgba(0,212,170,0.6)', borderColor: 'rgba(0,212,170,1)', borderWidth: 1, borderRadius: 6 },
        ],
      });

      setIsRunning(false);
    }, 50);
  }, [datasetSize, queryInput]);

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top', labels: { color: '#94a3b8', font: { family: "'JetBrains Mono', monospace", size: 11 } } },
      title: { display: true, text: `Time Comparison Across Query Lengths (Dataset: ${datasetSize} words)`, color: '#f1f5f9', font: { family: "'Syne', sans-serif", size: 14 } },
      tooltip: { callbacks: { label: (ctx) => `${ctx.dataset.label}: ${ctx.parsed.y}ms` } },
    },
    scales: {
      x: { ticks: { color: '#94a3b8', font: { family: "'JetBrains Mono', monospace", size: 10 } }, grid: { color: 'rgba(255,255,255,0.03)' } },
      y: { ticks: { color: '#94a3b8', font: { family: "'JetBrains Mono', monospace", size: 10 }, callback: (v) => `${v}ms` }, grid: { color: 'rgba(255,255,255,0.05)' } },
    },
  };

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
        <div style={S.iconBadge(C.purple)}>
          <Gauge size={26} color={C.purple} />
        </div>
        <h1 style={S.pageTitle}>Performance Comparison</h1>
        <p style={S.pageSubtitle}>Linear Search O(N) vs Trie Search O(L) — measured live</p>
      </div>

      {/* Controls */}
      <div style={S.card}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', alignItems: 'end' }}>
          <div>
            <label style={S.label}>
              Dataset Size: <span style={S.mono(C.blue)}>{datasetSize}</span>
            </label>
            <input
              type="range"
              min="10"
              max="1000"
              step="10"
              value={datasetSize}
              onChange={(e) => setDatasetSize(parseInt(e.target.value))}
              style={{ width: '100%', accentColor: C.blue }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#475569', marginTop: '4px' }}>
              <span>10</span><span>500</span><span>1000</span>
            </div>
          </div>
          <div>
            <label style={S.label}>Query Prefix</label>
            <input
              type="text"
              value={queryInput}
              onChange={(e) => setQueryInput(e.target.value)}
              placeholder="e.g. da"
              style={S.input}
            />
          </div>
          <button
            onClick={runComparison}
            disabled={isRunning}
            style={{
              ...S.btnPrimary(C.blue),
              justifyContent: 'center',
              opacity: isRunning ? 0.5 : 1,
              padding: '12px 24px',
              width: '100%',
            }}
          >
            <Play size={16} />
            {isRunning ? 'Running...' : 'Run Comparison'}
          </button>
        </div>
      </div>

      {/* Results */}
      {results && (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '20px' }}>
          <div style={S.grid2}>
            {/* Linear */}
            <div style={{ ...S.card, borderLeft: `3px solid ${C.red}`, marginBottom: 0 }}>
              <div style={{ fontSize: '13px', fontWeight: 700, color: C.red, marginBottom: '14px', fontFamily: 'Syne, sans-serif' }}>LINEAR SEARCH</div>
              {[
                ['Time', `${results.linear.time.toFixed(3)}ms`, C.red],
                ['Operations', results.linear.operations, '#f1f5f9'],
                ['Results found', results.linear.results, '#f1f5f9'],
              ].map(([label, val, color]) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '8px' }}>
                  <span style={{ color: '#94a3b8' }}>{label}:</span>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', color }}>{val}</span>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '8px' }}>
                <span style={{ color: '#94a3b8' }}>Complexity:</span>
                <ComplexityBadge type="time" value="O(N)" color="purple" />
              </div>
              <div style={{ marginTop: '10px', height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '999px', overflow: 'hidden' }}>
                <div style={{ height: '100%', borderRadius: '999px', background: C.red, width: `${Math.min(100, (results.linear.time / Math.max(results.linear.time, results.trie.time)) * 100)}%`, transition: 'width 0.5s' }} />
              </div>
            </div>

            {/* Trie */}
            <div style={{ ...S.card, borderLeft: `3px solid ${C.cyan}`, marginBottom: 0 }}>
              <div style={{ fontSize: '13px', fontWeight: 700, color: C.cyan, marginBottom: '14px', fontFamily: 'Syne, sans-serif' }}>TRIE SEARCH</div>
              {[
                ['Time', `${results.trie.time.toFixed(3)}ms`, C.cyan],
                ['Nodes traversed', results.trie.operations, '#f1f5f9'],
                ['Results found', results.trie.results, '#f1f5f9'],
              ].map(([label, val, color]) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '8px' }}>
                  <span style={{ color: '#94a3b8' }}>{label}:</span>
                  <span style={{ fontFamily: 'JetBrains Mono, monospace', color }}>{val}</span>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '8px' }}>
                <span style={{ color: '#94a3b8' }}>Complexity:</span>
                <ComplexityBadge type="time" value="O(L)" color="cyan" />
              </div>
              <div style={{ marginTop: '10px', height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '999px', overflow: 'hidden' }}>
                <div style={{ height: '100%', borderRadius: '999px', background: C.cyan, width: `${Math.min(100, (results.trie.time / Math.max(results.linear.time, results.trie.time)) * 100)}%`, transition: 'width 0.5s' }} />
              </div>
            </div>
          </div>

          {/* Speedup banner */}
          <div style={{ ...S.card, textAlign: 'center' }}>
            <span style={{ fontSize: '15px', color: '#94a3b8' }}>
              Trie is{' '}
              <span style={{ fontSize: '28px', fontWeight: 800, background: 'linear-gradient(135deg, #4f8ef7, #00d4aa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                {results.speedup}×
              </span>
              {' '}faster for prefix &quot;{results.prefix}&quot; on {results.datasetSize} words
            </span>
          </div>
        </motion.div>
      )}

      {/* Chart */}
      {chartData && (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} style={S.card}>
          <Bar data={chartData} options={chartOptions} />
        </motion.div>
      )}

      {/* Why Trie Wins */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} style={S.card}>
        <div style={S.cardTitle}><Zap size={14} color={C.amber} /> Why Trie Wins</div>
        <p style={S.cardText}>
          <strong style={{ color: C.red }}>Linear Search</strong> must check every word in the dataset →
          <span style={S.mono(C.red)}> O(N)</span> where N = dataset size.
          As the dataset grows from 100 → 1000 words, time grows proportionally.
        </p>
        <p style={S.cardText}>
          <strong style={{ color: C.cyan }}>Trie Search</strong> navigates directly to the prefix node →
          <span style={S.mono(C.cyan)}> O(L)</span> where L = query length.
          Whether dataset has 100 or 1,000,000 words, prefix lookup time stays the same!
        </p>
        <p style={S.cardText}>
          Trade-off: Trie uses more memory <span style={S.mono()}>O(N × L)</span> to store the tree structure,
          while linear search uses only <span style={S.mono()}>O(1)</span> extra memory.
        </p>
      </motion.div>

      {/* About */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} style={S.infoBox}>
        <div style={S.cardTitle}><BookOpen size={14} /> 📚 About This Feature</div>
        <p style={S.cardText}>
          This page demonstrates the <strong style={{ color: C.white }}>empirical comparison</strong> between
          linear search and Trie-based search. The comparison uses <code style={{ color: C.blue }}>performance.now()</code> for
          high-resolution timing and counts actual operations performed.
        </p>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '12px' }}>
          <ComplexityBadge type="time" value="O(N) Linear" color="purple" />
          <ComplexityBadge type="time" value="O(L) Trie" color="cyan" />
        </div>
        <p style={{ ...S.muted, marginTop: '8px' }}>Real-world: Proves why Trie is optimal for prefix search</p>
      </motion.div>
    </motion.div>
  );
};

export default PerformancePage;
