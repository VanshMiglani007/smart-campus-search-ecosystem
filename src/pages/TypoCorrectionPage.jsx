import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { SpellCheck, BookOpen, Search, CheckCircle2 } from 'lucide-react';
import { levenshtein, findClosestMatch, getCellType } from '../algorithms/Levenshtein';
import { getAllWords } from '../data/campusData';
import ComplexityBadge from '../components/ComplexityBadge';

const TypoCorrectionPage = () => {
  const [input, setInput] = useState('');
  const [result, setResult] = useState(null);
  const [detailResult, setDetailResult] = useState(null);
  const allWords = useMemo(() => getAllWords(), []);

  const handleCheck = () => {
    const word = input.trim();
    if (!word) return;

    // Find closest match from campus data
    const match = findClosestMatch(word, allWords, 3);

    if (match) {
      // Compute full detail between input and matched word
      const detail = levenshtein(word, match.word);
      setResult(match);
      setDetailResult(detail);
    } else {
      setResult(null);
      setDetailResult(null);
    }
  };

  // Get cell color based on operation type
  const getCellColor = (type, isFinalCell) => {
    if (isFinalCell) return { bg: 'rgba(0,212,170,0.3)', border: '#00d4aa', text: '#00d4aa' };
    switch (type) {
      case 'match':
        return { bg: 'rgba(79,142,247,0.15)', border: 'rgba(79,142,247,0.3)', text: '#4f8ef7' };
      case 'replace':
        return { bg: 'rgba(79,142,247,0.2)', border: 'rgba(79,142,247,0.5)', text: '#4f8ef7' };
      case 'insert':
        return { bg: 'rgba(0,212,170,0.15)', border: 'rgba(0,212,170,0.3)', text: '#00d4aa' };
      case 'delete':
        return { bg: 'rgba(239,68,68,0.15)', border: 'rgba(239,68,68,0.3)', text: '#ef4444' };
      default:
        return { bg: 'rgba(255,255,255,0.03)', border: 'rgba(255,255,255,0.08)', text: '#94a3b8' };
    }
  };

  // Pre-made examples
  const examples = [
    { typo: 'chatgtp', correct: 'Coding Club' },
    { typo: 'plcement', correct: 'Placement Portal' },
    { typo: 'hostal', correct: 'Hostel Food Menu' },
    { typo: 'exma', correct: 'Exam Form' },
    { typo: 'labriry', correct: 'Library Timing' },
  ];

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
          <div className="w-14 h-14 rounded-2xl bg-accent-blue/10 flex items-center justify-center mx-auto mb-4">
            <SpellCheck size={28} className="text-accent-blue" />
          </div>
          <h1 className="text-3xl font-bold gradient-text mb-2">Typo Correction</h1>
          <p className="text-text-secondary text-sm">Levenshtein Distance — Dynamic Programming matrix visualization</p>
        </div>

        {/* Input */}
        <div className="glass-card p-5 mb-6">
          <label className="text-xs text-text-muted uppercase tracking-wider mb-2 block">
            Type a misspelled word
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCheck()}
              placeholder="e.g. chatgtp, plcement, hostal..."
              className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-text-primary outline-none focus:border-accent-blue/50 transition-colors"
            />
            <button
              onClick={handleCheck}
              className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-accent-blue to-accent-purple text-white text-sm font-medium hover:opacity-90 transition-opacity flex items-center gap-1.5"
            >
              <Search size={14} /> Check
            </button>
          </div>

          {/* Quick examples */}
          <div className="flex flex-wrap gap-2 mt-3">
            <span className="text-[10px] text-text-muted">Try:</span>
            {examples.map((ex) => (
              <button
                key={ex.typo}
                onClick={() => { setInput(ex.typo); }}
                className="text-[10px] px-2 py-0.5 rounded-full border border-white/10 text-text-muted hover:text-text-primary hover:border-accent-blue/30 transition-colors"
              >
                {ex.typo}
              </button>
            ))}
          </div>
        </div>

        {/* Result */}
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-5 mb-6"
          >
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-sm text-text-muted">You typed:</span>
              <span className="text-lg font-mono text-red-400 line-through">{input}</span>
              <span className="text-text-muted">→</span>
              <span className="text-sm text-text-muted">Did you mean:</span>
              <span className="text-lg font-bold text-accent-cyan">{result.word}</span>
              <CheckCircle2 size={18} className="text-accent-cyan" />
              <span className="text-xs font-mono text-text-muted">(distance: {result.distance})</span>
            </div>
          </motion.div>
        )}

        {/* DP Matrix */}
        {detailResult && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-5 mb-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-text-primary">DP Matrix Visualization</h3>
              <ComplexityBadge
                type="time"
                value={`O(${input.trim().length}×${result.word.length}) = O(${input.trim().length * result.word.length})`}
                color="blue"
              />
            </div>

            <div className="overflow-x-auto">
              <table className="border-collapse mx-auto">
                <thead>
                  <tr>
                    <th className="w-10 h-10 text-[10px] font-mono text-text-muted"></th>
                    <th className="w-10 h-10 text-[10px] font-mono text-text-muted">&quot;&quot;</th>
                    {result.word.split('').map((char, j) => (
                      <th key={j} className="w-10 h-10 text-xs font-mono text-accent-cyan font-bold">
                        {char}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {detailResult.matrix.map((row, i) => (
                    <tr key={i}>
                      <td className="w-10 h-10 text-xs font-mono text-accent-blue font-bold text-center">
                        {i === 0 ? '""' : input.trim()[i - 1]}
                      </td>
                      {row.map((cell, j) => {
                        const isFinal = i === detailResult.matrix.length - 1 && j === row.length - 1;
                        const cellType = getCellType(detailResult.matrix, input.trim(), result.word, i, j);
                        const colors = getCellColor(cellType, isFinal);

                        return (
                          <motion.td
                            key={j}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: (i * row.length + j) * 0.008 }}
                            className="w-10 h-10 text-center text-xs font-mono font-bold"
                            style={{
                              backgroundColor: colors.bg,
                              border: `1px solid ${colors.border}`,
                              color: colors.text,
                            }}
                          >
                            {cell}
                          </motion.td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap items-center justify-center gap-4 mt-4 text-[10px]">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded" style={{ backgroundColor: 'rgba(79,142,247,0.2)', border: '1px solid rgba(79,142,247,0.5)' }} />
                <span className="text-text-muted">Match / Replace (diagonal)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded" style={{ backgroundColor: 'rgba(0,212,170,0.15)', border: '1px solid rgba(0,212,170,0.3)' }} />
                <span className="text-text-muted">Insert (left)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded" style={{ backgroundColor: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)' }} />
                <span className="text-text-muted">Delete (up)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded" style={{ backgroundColor: 'rgba(0,212,170,0.3)', border: '1px solid #00d4aa' }} />
                <span className="text-text-muted">Final cell (answer)</span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Operations List */}
        {detailResult && detailResult.operations && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-5 mb-6"
          >
            <h3 className="text-sm font-semibold text-text-primary mb-3">Operations Performed</h3>
            <div className="space-y-1.5">
              {detailResult.operations
                .filter(op => op.type !== 'match')
                .map((op, i) => (
                <div key={i} className="flex items-center gap-2 text-xs">
                  <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold"
                    style={{
                      backgroundColor:
                        op.type === 'replace' ? 'rgba(79,142,247,0.2)' :
                        op.type === 'insert' ? 'rgba(0,212,170,0.2)' :
                        'rgba(239,68,68,0.2)',
                      color:
                        op.type === 'replace' ? '#4f8ef7' :
                        op.type === 'insert' ? '#00d4aa' :
                        '#ef4444',
                    }}
                  >
                    {i + 1}
                  </span>
                  <span className="text-text-secondary">
                    {op.type === 'replace' && (
                      <>Replace &apos;{op.sourceChar}&apos; → &apos;{op.targetChar}&apos; <span className="text-text-muted">(position {op.position})</span></>
                    )}
                    {op.type === 'insert' && (
                      <>Insert &apos;{op.targetChar}&apos; <span className="text-text-muted">(position {op.position})</span></>
                    )}
                    {op.type === 'delete' && (
                      <>Delete &apos;{op.sourceChar}&apos; <span className="text-text-muted">(position {op.position})</span></>
                    )}
                  </span>
                </div>
              ))}
              {detailResult.operations.filter(op => op.type !== 'match').length === 0 && (
                <p className="text-xs text-accent-cyan">✓ Perfect match — no operations needed!</p>
              )}
            </div>
            <div className="mt-3 pt-3 border-t border-white/5 text-[10px] text-text-muted font-mono">
              Edit Distance: {detailResult.distance} &nbsp;|&nbsp;
              Complexity: O(m × n) = O({input.trim().length} × {result?.word?.length || 0}) = O({input.trim().length * (result?.word?.length || 0)})
            </div>
          </motion.div>
        )}

        {/* How It Works */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-card p-5"
          >
            <h3 className="text-sm font-semibold text-text-primary mb-3">📐 How Levenshtein Works</h3>
            <div className="space-y-2 text-xs text-text-secondary leading-relaxed">
              <p>Build a 2D matrix of size (m+1) × (n+1) where m, n are string lengths.</p>
              <p>Each cell <span className="font-mono text-accent-blue">dp[i][j]</span> = minimum edits to transform source[0..i] to target[0..j].</p>
              <p>Three operations: <span className="text-accent-blue">Replace</span> (diagonal +1), <span className="text-accent-cyan">Insert</span> (left +1), <span className="text-red-400">Delete</span> (up +1).</p>
              <p>If characters match: <span className="font-mono text-accent-cyan">dp[i][j] = dp[i-1][j-1]</span> (no cost).</p>
              <p>Final answer: bottom-right cell <span className="font-mono text-accent-cyan">dp[m][n]</span>.</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-card p-5"
          >
            <h3 className="text-sm font-semibold text-text-primary mb-3">🔍 Typo Correction Flow</h3>
            <div className="space-y-2 text-xs text-text-secondary leading-relaxed">
              <p><span className="font-mono text-accent-blue">1.</span> User types misspelled word</p>
              <p><span className="font-mono text-accent-blue">2.</span> Compare against all 85 campus keywords</p>
              <p><span className="font-mono text-accent-blue">3.</span> Compute Levenshtein distance for each word</p>
              <p><span className="font-mono text-accent-blue">4.</span> Return closest match within threshold (≤ 3)</p>
              <p><span className="font-mono text-accent-blue">5.</span> Display DP matrix and operations list</p>
            </div>
          </motion.div>
        </div>

        {/* Viva Info Box */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="glass-card p-5 mb-16"
        >
          <h4 className="text-sm font-semibold text-text-primary mb-2 flex items-center gap-2">
            <BookOpen size={14} />
            📚 About This Feature
          </h4>
          <p className="text-xs text-text-secondary leading-relaxed mb-2">
            This page demonstrates the <strong className="text-text-primary">Levenshtein Distance</strong> algorithm,
            a classic <strong className="text-text-primary">Dynamic Programming</strong> problem. It computes the minimum number of
            single-character edits (insert, delete, replace) needed to transform one string into another.
            The full DP matrix is visualized with color-coded cells showing which operation was chosen at each step.
          </p>
          <div className="flex flex-wrap gap-2 mt-3">
            <ComplexityBadge type="time" value="O(m×n)" color="blue" />
            <ComplexityBadge type="space" value="O(m×n) matrix" color="purple" />
          </div>
          <p className="text-[10px] text-text-muted mt-2">
            Real-world use: Spell checkers, DNA sequence alignment, Git diff, autocorrect, fuzzy search
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default TypoCorrectionPage;
